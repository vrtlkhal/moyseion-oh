// ===========================================================================
//  MOYΣEION — the statue.
//  Renders the GLB. Pose is driven by window.__statueTurn (turns travelled)
//  and window.__pageProgress (0..1 down the page), both published by motion.js.
//  This module knows nothing about sections; the whole schedule lives there.
// ===========================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const root = document.documentElement;
const wrap   = document.getElementById('statueWrap');
const canvas = document.getElementById('statueCanvas');

// The statue is the centre of the mark, so a WebGL failure is not merely
// cosmetic — it would leave the sigil hollow. .no-3d puts the SVG figure back.
function fallback(msg, err){
  console.warn(msg, err || '');
  root.classList.add('no-3d');
}

// WebGL can be present-but-unusable: GPU blocklists, headless, a context lost
// at construction. The constructor THROWS there, and an uncaught throw would
// kill this module before the load-failure path below could ever run.
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
} catch (err) {
  fallback('WebGL unavailable — SVG figure restored', err);
  throw err;
}

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 3.2);

// ---- LIGHT AS THE NARRATIVE --------------------------------------------
// The key used to sit at a fixed (2,3,4) for the whole page, so the gold caught
// the light exactly the same way in section 01 and section 06 and the only
// thing distinguishing them was the text beside it. The key now swings a
// quarter-circle around the figure across the descent — a dawn moving over the
// manifesto. It is the cheapest narrative device on the page: two trig calls a
// frame, no new geometry, no new asset.
const KEY_FROM = -0.35, KEY_TO = 1.25;        // azimuth in radians, x-z plane
const key  = new THREE.DirectionalLight(0xf1dca4, 2.2);
const rim  = new THREE.DirectionalLight(0xf1dca4, 1.1);
const fill = new THREE.AmbientLight(0x836d30, 0.9);
key.position.set(2, 3, 4);
rim.position.set(-3, -2, 1.5);
scene.add(key, rim, fill);

const dpr = Math.min(window.devicePixelRatio || 1, 2);
function sizeRenderer(){
  // The wrap is not one size: it is logo-sized inside the mark and shrinks to
  // the travel size on the way out. The backing store is sized ONCE to the
  // largest it will ever need (__statueMaxPx, published by motion.js) and CSS
  // minifies it for the rest of the page. Minification stays sharp; the
  // alternatives are a per-frame buffer reallocation during the exit lerp, or a
  // ~3x upscale on the logo — the one place softness would be most obvious.
  const wrapPx = wrap.getBoundingClientRect().width;
  const s = Math.max(wrapPx, window.__statueMaxPx || 0) || wrapPx;
  if (!s) return;
  renderer.setPixelRatio(dpr);
  renderer.setSize(s, s, false);     // false: leave the canvas CSS at 100% of the wrap
  camera.aspect = 1; camera.updateProjectionMatrix();
}
// The only resize entry point. This module used to add its own undebounced
// window resize listener alongside two debounced ones in the motion module;
// motion.js owns the schedule now and calls this at the right point in it.
window.__statueResize = sizeRenderer;
sizeRenderer();

// ---- THE MODEL ----
let model = null;
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

// TWO WAYS IN, because this page has two lives. Served over http it fetches an
// external meshopt-compressed .glb (127 KB). Opened straight off the disk by
// double-clicking it, fetch() is blocked — file:// is an opaque origin — so the
// single-file build embeds the same bytes as base64 on window.__STATUE_GLB and
// this takes the other branch. Either way it is the same 127 KB of geometry,
// not the 871 KB the original carried.
const glbBytes = window.__STATUE_GLB
  ? Promise.resolve(Uint8Array.from(atob(window.__STATUE_GLB), c => c.charCodeAt(0)).buffer)
  : fetch('assets/statue.glb').then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); });

glbBytes
  .then(buf => new Promise((res, rej) => loader.parse(buf, '', res, rej)))
  .then(gltf => {
    const gs = gltf.scene;
    // gold + glossy (low roughness) so the key and rim throw a moving highlight
    // across it — reads as reflecting light, not a matte silhouette.
    gs.traverse(o => {
      if (o.isMesh) o.material = new THREE.MeshStandardMaterial({
        color: 0xc2a567, metalness: 0.45, roughness: 0.28,
        // The model is an extruded relief, 0.16 units deep against 4.85 tall.
        // At a glancing angle you can see through to the inside of the far wall
        // if the back faces are dropped, so both sides are drawn.
        side: THREE.DoubleSide
      });
    });
    const box = new THREE.Box3().setFromObject(gs);
    const c  = box.getCenter(new THREE.Vector3());
    const sz = box.getSize(new THREE.Vector3());
    gs.scale.setScalar(1.6 / Math.max(sz.x, sz.y, sz.z));
    gs.position.copy(c).multiplyScalar(-1.6 / Math.max(sz.x, sz.y, sz.z));  // centre in a pivot
    model = new THREE.Group();
    model.add(gs);
    // ZYX so the yaw applies to the statue FIRST, in its own frame, and any
    // screen-plane lean last, on top. With the default XYZ the lean gets
    // carried around by the yaw and the figure precesses like a spun top.
    model.rotation.order = 'ZYX';
    scene.add(model);
  })
  .catch(err => fallback('GLB load failed — SVG figure restored', err));

// ---- POSE ----
const BASE_TILT = 0;      // rad — upright. The yaw below is the only thing that moves it.
const DEPTH     = 0.40;   // world units it swings toward the camera mid-travel.
                          // Camera at 3.2 with a 35° FOV and a 1.6-tall model,
                          // so this is about as far forward as it can come
                          // before the head clips the top of the canvas.

// A SWING, NOT A SPIN — and this is a geometry fact, not a taste one.
// The GLB's bounding box is 3.69 x 4.85 x 0.16: it is an extruded relief, thirty
// times taller than it is deep. A full 2π yaw therefore passes through two
// exactly edge-on positions per turn where the figure is a 0.16-unit sliver and
// effectively vanishes, and through a half turn where the reader is shown the
// flat back of a plate. At TURN_TRAV + TURN_ARC = 2 turns per section that was
// four disappearances and two blank backs per section.
//
// sin(turn·π) keeps the contract the schedule depends on — whole turns are
// pose-identical to zero, so the figure is frontal at every landing — while the
// travel between landings becomes one slow sweep to YAW_MAX and back. The sign
// alternates with each unit, so consecutive sections sway opposite ways, which
// is the pendulum the old bowed transit used to give for free.
// Set SPIN_FULL true to restore the original 2π yaw.
const SPIN_FULL = false;
const YAW_MAX   = 0.95;   // rad, ~54° — past ~70° the relief starts to foreshorten away

function renderFrame(){
  // Don't pay for a WebGL frame while the statue is invisible: it is at
  // opacity 0 for the whole visit section and footer. Reading the inline
  // style, not a rect — no layout is forced.
  if (wrap.style.opacity === '0') return;

  if (model){
    const turn = window.__statueTurn || 0;
    model.rotation.set(0, SPIN_FULL ? turn * Math.PI * 2 : Math.sin(turn * Math.PI) * YAW_MAX, BASE_TILT);
    model.position.z = Math.sin(Math.PI * (turn % 1)) * DEPTH;
  }
  const a = KEY_FROM + (KEY_TO - KEY_FROM) * (window.__pageProgress || 0);
  key.position.set(Math.sin(a) * 4, 3, Math.cos(a) * 4);

  renderer.render(scene, camera);
}

// ONE CLOCK. This used to drive itself on its own requestAnimationFrame loop,
// separate from the gsap ticker that positions the wrap — so the statue's
// TRANSFORM and the statue's PIXELS were produced by two different callbacks
// that browsers are free to schedule in either order. Half the time the canvas
// rendered the pose from the previous frame inside a wrap that had already
// moved, which reads as the figure swimming a frame behind its own outline.
// Registering on the same ticker, after motion.js, puts the write and the
// render in one frame, in the right order, always.
if (window.gsap) gsap.ticker.add(renderFrame);
else (function loop(){ requestAnimationFrame(loop); renderFrame(); })();
