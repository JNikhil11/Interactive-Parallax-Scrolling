import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let container = null;
let canvas = null;
let renderer = null;
let scene = null;
let camera = null;
let animId = null;
let timeline = null;
let observer = null;
let isVisible = true;
let resizeHandler = null;

// Armor Groups & References
let suitRoot = null;
let mannequinGroup = null;
let chestCoreGroup = null;
let spineRibGroup = null;
let abdominalsGroup = null;
let pelvisGroup = null;
let shoulderCollarGroup = null;
let bicepsGroup = null;
let forearmsGroup = null;
let handsGroup = null;
let thighsGroup = null;
let shinGreavesGroup = null;
let bootsGroup = null;
let chestArmorGroup = null;
let helmetGroup = null;
let faceplateMesh = null;
let eyeGlowMesh = null;
let chestPointLight = null;
let sparksMesh = null;
let sparkGeo = null;
let sparkPositions = null;
let sparkVelocities = null;

// Stage indicator DOM element
let stageIndicatorEl = null;
let progressFillEl = null;

const STAGE_LABELS = [
  '01 // NEUTRAL UNDERSUIT',
  '02 // CHEST ARC REACTOR DOCKED',
  '03 // SPINAL CHASSIS SEALED',
  '04 // ABDOMINAL PLATES ENGAGED',
  '05 // PELVIS ACTUATORS ATTACHED',
  '06 // SHOULDER COLLAR LOCKED',
  '07 // UPPER-ARM SLEEVES MOUNTED',
  '08 // FOREARM GAUNTLETS CLOSED',
  '09 // ARTICULATED HANDS ONLINE',
  '10 // THIGH ARMOR CLAMPED',
  '11 // SHIN GREAVES & CALVES SEALED',
  '12 // ARMORED COMBAT BOOTS LOCKED',
  '13 // PECTORAL BREASTPLATE ENGAGED',
  '14 // MOTORIZED FACEPLATE SEALED',
  '15 // SUIT FULLY ONLINE — HERO MODE',
];

export function initExosuit3D() {
  destroyExosuit3D();

  container = document.getElementById('exosuit-container');
  canvas = document.getElementById('exosuit-3d-canvas');
  stageIndicatorEl = document.getElementById('suit-stage-indicator');
  progressFillEl = document.getElementById('suit-progress-fill');

  if (!container || !canvas) return;

  const width = container.clientWidth || 540;
  const height = container.clientHeight || 640;

  // 1. WebGL Renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('WebGL init fallback:', err);
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // 2. Three.js Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
  camera.position.set(0, 0.15, 4.4);

  // 3. Lighting Setup (Cinematic Studio Lighting)
  // Key Light (Golden warm)
  const keyLight = new THREE.DirectionalLight(0xFFF0DD, 2.8);
  keyLight.position.set(3, 4, 3.5);
  scene.add(keyLight);

  // Rim Light (Cyan metallic edge)
  const rimLight = new THREE.DirectionalLight(0x00E5FF, 3.6);
  rimLight.position.set(-3.5, 2.5, -2.5);
  scene.add(rimLight);

  // Fill Light (Soft indigo)
  const fillLight = new THREE.DirectionalLight(0x38BDF8, 1.2);
  fillLight.position.set(0, -2, 3);
  scene.add(fillLight);

  // Ambient Light
  const ambientLight = new THREE.HemisphereLight(0x1E293B, 0x050811, 1.4);
  scene.add(ambientLight);

  // Dynamic Chest Arc Reactor Light
  chestPointLight = new THREE.PointLight(0x00F5FF, 0, 3.5);
  chestPointLight.position.set(0, 0.42, 0.35);
  scene.add(chestPointLight);

  // 4. Build Exosuit Architecture
  buildExosuitHierarchy();

  // 5. Build Sparks Particle System
  buildSparksSystem();

  // 6. Ground Pedestal Reflection
  buildGroundPedestal();

  // 7. Render Loop
  let lastTime = performance.now();
  function animate(now) {
    if (isVisible && renderer && scene && camera) {
      const dt = (now - lastTime) * 0.001;
      lastTime = now;

      // Update sparks if any
      updateSparks(dt);

      // Subtle atmospheric suit breathing idle
      if (suitRoot) {
        suitRoot.position.y = Math.sin(now * 0.0018) * 0.015;
      }

      renderer.render(scene, camera);
    } else {
      lastTime = now;
    }
    animId = requestAnimationFrame(animate);
  }
  animId = requestAnimationFrame(animate);

  // 8. Visibility Intersection Observer
  const sceneElem = document.getElementById('scene-creation');
  if (sceneElem) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(sceneElem);
  }

  // 9. Resize Listener
  resizeHandler = () => {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth || 540;
    const h = container.clientHeight || 640;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', resizeHandler, { passive: true });

  // 10. GSAP Assembly Choreography
  setupAssemblyChoreography();
}

/**
 * Build the 3D Exosuit model with PBR metallic shaders
 */
function buildExosuitHierarchy() {
  suitRoot = new THREE.Group();
  suitRoot.position.set(0, -0.15, 0);
  scene.add(suitRoot);

  // --- Physically Based Materials ---
  // Deep Metallic Crimson Red with Automotive Clearcoat
  const crimsonMat = new THREE.MeshPhysicalMaterial({
    color: 0x940B18,
    emissive: 0x1B0205,
    roughness: 0.18,
    metalness: 0.88,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
    reflectivity: 0.95,
  });

  // Brushed Champagne Gold
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xD8B24A,
    emissive: 0x241C06,
    roughness: 0.25,
    metalness: 0.92,
    clearcoat: 0.7,
    clearcoatRoughness: 0.18,
  });

  // Precision Machined Titanium & Piston Steel
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x768092,
    roughness: 0.32,
    metalness: 0.95,
  });

  // Technical Carbon-Weave Undersuit
  const undersuitMat = new THREE.MeshStandardMaterial({
    color: 0x14171E,
    roughness: 0.78,
    metalness: 0.18,
  });

  // Glowing Cyan Emitters
  const cyanCoreMat = new THREE.MeshBasicMaterial({ color: 0xF0FDFF });
  const cyanAuraMat = new THREE.MeshStandardMaterial({
    color: 0x00E5FF,
    emissive: 0x00E5FF,
    emissiveIntensity: 3.2,
    roughness: 0.15,
  });

  // -------------------------------------------------------------
  // STAGE 01: Anonymous Mannequin in Technical Undersuit
  // -------------------------------------------------------------
  mannequinGroup = new THREE.Group();
  suitRoot.add(mannequinGroup);

  // Head (Neutral Anonymous Form)
  const headGeo = new THREE.SphereGeometry(0.16, 24, 24);
  headGeo.scale(0.9, 1.25, 1.05);
  const headMesh = new THREE.Mesh(headGeo, undersuitMat);
  headMesh.position.set(0, 0.98, 0);
  mannequinGroup.add(headMesh);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.14, 16);
  const neckMesh = new THREE.Mesh(neckGeo, undersuitMat);
  neckMesh.position.set(0, 0.78, 0);
  mannequinGroup.add(neckMesh);

  // Torso / Chest Underbody
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.44, 20);
  torsoGeo.scale(1.25, 1, 0.85);
  const torsoMesh = new THREE.Mesh(torsoGeo, undersuitMat);
  torsoMesh.position.set(0, 0.48, 0);
  mannequinGroup.add(torsoMesh);

  // Abdominal Midsection
  const abGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.25, 20);
  abGeo.scale(1.15, 1, 0.8);
  const abMesh = new THREE.Mesh(abGeo, undersuitMat);
  abMesh.position.set(0, 0.18, 0);
  mannequinGroup.add(abMesh);

  // Pelvis / Hips
  const pelvisGeo = new THREE.BoxGeometry(0.36, 0.20, 0.24);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, undersuitMat);
  pelvisMesh.position.set(0, -0.02, 0);
  mannequinGroup.add(pelvisMesh);

  // Arms (Left & Right)
  [-1, 1].forEach((side) => {
    // Shoulder Socket
    const shBall = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), titaniumMat);
    shBall.position.set(side * 0.34, 0.62, 0);
    mannequinGroup.add(shBall);

    // Bicep
    const bicepMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.28, 16), undersuitMat);
    bicepMesh.position.set(side * 0.38, 0.45, 0);
    mannequinGroup.add(bicepMesh);

    // Elbow Joint
    const elbowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), titaniumMat);
    elbowMesh.position.set(side * 0.40, 0.28, 0);
    mannequinGroup.add(elbowMesh);

    // Forearm
    const forearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 16), undersuitMat);
    forearmMesh.position.set(side * 0.42, 0.12, 0);
    mannequinGroup.add(forearmMesh);

    // Hand
    const handMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.10, 0.04), undersuitMat);
    handMesh.position.set(side * 0.44, -0.06, 0);
    mannequinGroup.add(handMesh);
  });

  // Legs (Left & Right)
  [-1, 1].forEach((side) => {
    // Hip Hinge
    const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), titaniumMat);
    hipJoint.position.set(side * 0.14, -0.12, 0);
    mannequinGroup.add(hipJoint);

    // Thigh
    const thighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 16), undersuitMat);
    thighMesh.position.set(side * 0.15, -0.34, 0);
    mannequinGroup.add(thighMesh);

    // Knee Joint
    const kneeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), titaniumMat);
    kneeMesh.position.set(side * 0.15, -0.58, 0);
    mannequinGroup.add(kneeMesh);

    // Shin / Calf
    const shinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.42, 16), undersuitMat);
    shinMesh.position.set(side * 0.15, -0.80, 0);
    mannequinGroup.add(shinMesh);

    // Foot
    const footMesh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 0.22), undersuitMat);
    footMesh.position.set(side * 0.15, -1.04, 0.04);
    mannequinGroup.add(footMesh);
  });

  // -------------------------------------------------------------
  // STAGE 02: Chest Arc Reactor Unibeam Core
  // -------------------------------------------------------------
  chestCoreGroup = new THREE.Group();
  suitRoot.add(chestCoreGroup);

  const coreHousing = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 16, 32), titaniumMat);
  coreHousing.position.set(0, 0.45, 0.19);
  chestCoreGroup.add(coreHousing);

  const coreRingGold = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 16, 32), goldMat);
  coreRingGold.position.set(0, 0.45, 0.20);
  chestCoreGroup.add(coreRingGold);

  const coreCrystal = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 24), cyanCoreMat);
  coreCrystal.rotation.x = Math.PI / 2;
  coreCrystal.position.set(0, 0.45, 0.21);
  chestCoreGroup.add(coreCrystal);

  const coreAuraRing = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.09, 32), cyanAuraMat);
  coreAuraRing.position.set(0, 0.45, 0.205);
  chestCoreGroup.add(coreAuraRing);

  // -------------------------------------------------------------
  // STAGE 03: Internal Spinal Column & Rib Calipers
  // -------------------------------------------------------------
  spineRibGroup = new THREE.Group();
  suitRoot.add(spineRibGroup);

  // Vertebrae along back
  for (let i = 0; i < 5; i++) {
    const vert = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.05), titaniumMat);
    vert.position.set(0, 0.62 - i * 0.09, -0.16);
    spineRibGroup.add(vert);
  }

  // Rib Calipers wrapping around torso
  [-1, 1].forEach((side) => {
    for (let r = 0; r < 3; r++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.18 + r * 0.015, 0.014, 12, 24, Math.PI * 0.65), titaniumMat);
      rib.rotation.z = side > 0 ? -0.2 : Math.PI + 0.2;
      rib.rotation.y = side > 0 ? 0.35 : -0.35;
      rib.position.set(side * 0.04, 0.55 - r * 0.11, -0.03);
      spineRibGroup.add(rib);
    }
  });

  // -------------------------------------------------------------
  // STAGE 04: Abdominal Segmented Plates
  // -------------------------------------------------------------
  abdominalsGroup = new THREE.Group();
  suitRoot.add(abdominalsGroup);

  // Upper Abdominal Plate (Gold)
  const abUpperGold = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.06), goldMat);
  abUpperGold.position.set(0, 0.26, 0.16);
  abdominalsGroup.add(abUpperGold);

  // Mid Abdominal Plate (Crimson)
  const abMidRed = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.075, 0.055), crimsonMat);
  abMidRed.position.set(0, 0.17, 0.16);
  abdominalsGroup.add(abMidRed);

  // Lower Abdominal Chevron Plate (Gold)
  const abLowerGold = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.07, 0.05), goldMat);
  abLowerGold.position.set(0, 0.08, 0.15);
  abdominalsGroup.add(abLowerGold);

  // Lateral Oblique Plates
  [-1, 1].forEach((side) => {
    const oblique = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.20, 0.14), titaniumMat);
    oblique.position.set(side * 0.18, 0.18, 0.04);
    abdominalsGroup.add(oblique);
  });

  // -------------------------------------------------------------
  // STAGE 05: Hip & Pelvis Actuators
  // -------------------------------------------------------------
  pelvisGroup = new THREE.Group();
  suitRoot.add(pelvisGroup);

  // Pelvis Groin Armor (Crimson with Gold Accent)
  const groinArmor = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.18, 4), crimsonMat);
  groinArmor.rotation.y = Math.PI / 4;
  groinArmor.rotation.x = Math.PI;
  groinArmor.position.set(0, -0.06, 0.13);
  pelvisGroup.add(groinArmor);

  // Hip Ball Actuators & Piston Housings
  [-1, 1].forEach((side) => {
    const hipHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16), titaniumMat);
    hipHousing.rotation.z = Math.PI / 2;
    hipHousing.position.set(side * 0.19, -0.02, 0.05);
    pelvisGroup.add(hipHousing);

    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12), goldMat);
    pistonRod.position.set(side * 0.18, -0.12, 0.08);
    pelvisGroup.add(pistonRod);
  });

  // -------------------------------------------------------------
  // STAGE 06: Shoulder Sockets & Clavicle Collar
  // -------------------------------------------------------------
  shoulderCollarGroup = new THREE.Group();
  suitRoot.add(shoulderCollarGroup);

  // Collar Yoke (Gold)
  const collarYoke = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.024, 16, 24, Math.PI * 0.9), goldMat);
  collarYoke.rotation.x = Math.PI * 0.42;
  collarYoke.position.set(0, 0.68, 0.04);
  shoulderCollarGroup.add(collarYoke);

  // Heavy Shoulder Pauldrons (Left & Right)
  [-1, 1].forEach((side) => {
    const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16, 0, Math.PI, 0, Math.PI * 0.7), crimsonMat);
    pauldron.rotation.z = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    pauldron.position.set(side * 0.36, 0.66, 0);
    shoulderCollarGroup.add(pauldron);

    const pauldronGoldTrim = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.015, 12, 24, Math.PI), goldMat);
    pauldronGoldTrim.rotation.z = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    pauldronGoldTrim.position.set(side * 0.37, 0.66, 0.01);
    shoulderCollarGroup.add(pauldronGoldTrim);
  });

  // -------------------------------------------------------------
  // STAGE 07: Upper Arm Bicep / Tricep Sleeves
  // -------------------------------------------------------------
  bicepsGroup = new THREE.Group();
  suitRoot.add(bicepsGroup);

  [-1, 1].forEach((side) => {
    // Crimson Front Bicep Shell
    const bicepShell = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.22, 16, 1, false, 0, Math.PI * 1.2), crimsonMat);
    bicepShell.rotation.y = side > 0 ? -0.4 : 0.4;
    bicepShell.position.set(side * 0.38, 0.46, 0.02);
    bicepsGroup.add(bicepShell);

    // Gold Tricep Back Shell
    const tricepShell = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.20, 16, 1, false, Math.PI * 1.0, Math.PI), goldMat);
    tricepShell.rotation.y = side > 0 ? -0.4 : 0.4;
    tricepShell.position.set(side * 0.38, 0.45, -0.01);
    bicepsGroup.add(tricepShell);
  });

  // -------------------------------------------------------------
  // STAGE 08: Forearm Gauntlets & Wrist Locking Rings
  // -------------------------------------------------------------
  forearmsGroup = new THREE.Group();
  suitRoot.add(forearmsGroup);

  [-1, 1].forEach((side) => {
    // Contoured Gauntlet
    const gauntlet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.24, 16), crimsonMat);
    gauntlet.position.set(side * 0.42, 0.13, 0);
    forearmsGroup.add(gauntlet);

    // Gold Top Dorsal Plate
    const dorsalPlate = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.03), goldMat);
    dorsalPlate.position.set(side * 0.43, 0.14, 0.06);
    forearmsGroup.add(dorsalPlate);

    // Titanium Wrist Locking Cuff
    const wristCuff = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.015, 12, 24), titaniumMat);
    wristCuff.rotation.x = Math.PI / 2;
    wristCuff.position.set(side * 0.43, 0.01, 0);
    forearmsGroup.add(wristCuff);
  });

  // -------------------------------------------------------------
  // STAGE 09: Articulated Hands & Palm Repulsor Emitters
  // -------------------------------------------------------------
  handsGroup = new THREE.Group();
  suitRoot.add(handsGroup);

  [-1, 1].forEach((side) => {
    // Armored Hand Backplate
    const handPlate = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.03), crimsonMat);
    handPlate.position.set(side * 0.44, -0.06, 0.02);
    handsGroup.add(handPlate);

    // Gold Knuckle Guards
    const knuckles = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.02, 0.025), goldMat);
    knuckles.position.set(side * 0.44, -0.03, 0.03);
    handsGroup.add(knuckles);

    // Palm Repulsor Emitter (Cyan Glow)
    const palmEmitter = new THREE.Mesh(new THREE.CircleGeometry(0.025, 20), cyanCoreMat);
    palmEmitter.position.set(side * 0.44, -0.06, -0.025);
    palmEmitter.rotation.y = Math.PI;
    handsGroup.add(palmEmitter);
  });

  // -------------------------------------------------------------
  // STAGE 10: Upper Leg Thigh Armor & Hydraulic Pistons
  // -------------------------------------------------------------
  thighsGroup = new THREE.Group();
  suitRoot.add(thighsGroup);

  [-1, 1].forEach((side) => {
    // Contoured Crimson Thigh Shell
    const thighShell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.10, 0.38, 20), crimsonMat);
    thighShell.scale.set(1.15, 1, 1.2);
    thighShell.position.set(side * 0.15, -0.34, 0.02);
    thighsGroup.add(thighShell);

    // Brushed Gold Lateral Accents
    const goldAccent = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.08), goldMat);
    goldAccent.position.set(side * 0.22, -0.33, 0.02);
    thighsGroup.add(goldAccent);

    // Hydraulic Pistons along back
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.24, 12), titaniumMat);
    piston.position.set(side * 0.15, -0.36, -0.10);
    thighsGroup.add(piston);
  });

  // -------------------------------------------------------------
  // STAGE 11: Knee Cops, Shin Greaves & Calf Cowls
  // -------------------------------------------------------------
  shinGreavesGroup = new THREE.Group();
  suitRoot.add(shinGreavesGroup);

  [-1, 1].forEach((side) => {
    // Diamond Knee Cop (Gold)
    const kneeCop = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), goldMat);
    kneeCop.scale.set(1.2, 1.4, 0.8);
    kneeCop.position.set(side * 0.15, -0.57, 0.11);
    shinGreavesGroup.add(kneeCop);

    // Heavy Front Shin Greave (Crimson)
    const shinGreave = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.085, 0.38, 16, 1, false, -Math.PI * 0.5, Math.PI), crimsonMat);
    shinGreave.position.set(side * 0.15, -0.80, 0.02);
    shinGreavesGroup.add(shinGreave);

    // Rear Calf Cowl (Gold / Titanium)
    const calfCowl = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.34, 16, 1, false, Math.PI * 0.5, Math.PI), goldMat);
    calfCowl.position.set(side * 0.15, -0.79, -0.01);
    shinGreavesGroup.add(calfCowl);
  });

  // -------------------------------------------------------------
  // STAGE 12: Armored Combat Boots & Ankle Stabilizers
  // -------------------------------------------------------------
  bootsGroup = new THREE.Group();
  suitRoot.add(bootsGroup);

  [-1, 1].forEach((side) => {
    // Heavy Armored Boot (Crimson)
    const bootMain = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.10, 0.26), crimsonMat);
    bootMain.position.set(side * 0.15, -1.04, 0.04);
    bootsGroup.add(bootMain);

    // Brushed Gold Toe Cap
    const toeCap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.08), goldMat);
    toeCap.position.set(side * 0.15, -1.05, 0.15);
    bootsGroup.add(toeCap);

    // Treaded Titanium Soles
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.28), titaniumMat);
    sole.position.set(side * 0.15, -1.09, 0.04);
    bootsGroup.add(sole);

    // Ankle Hydraulic Stabilizers
    const ankleRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 12, 24), titaniumMat);
    ankleRing.rotation.x = Math.PI / 2;
    ankleRing.position.set(side * 0.15, -0.98, 0.02);
    bootsGroup.add(ankleRing);
  });

  // -------------------------------------------------------------
  // STAGE 13: Pectoral Breastplates & Back Thruster Cowls
  // -------------------------------------------------------------
  chestArmorGroup = new THREE.Group();
  suitRoot.add(chestArmorGroup);

  // Dual Contoured Pectoral Breastplates (Crimson with Gold Bevels)
  [-1, 1].forEach((side) => {
    const pecPlate = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.22, 0.07), crimsonMat);
    pecPlate.position.set(side * 0.12, 0.48, 0.18);
    pecPlate.rotation.y = side > 0 ? 0.22 : -0.22;
    chestArmorGroup.add(pecPlate);

    const pecGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.075), goldMat);
    pecGoldTrim.position.set(side * 0.12, 0.56, 0.185);
    pecGoldTrim.rotation.y = side > 0 ? 0.22 : -0.22;
    chestArmorGroup.add(pecGoldTrim);
  });

  // Back Thruster Flaps (Left & Right)
  [-1, 1].forEach((side) => {
    const thruster = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.06), titaniumMat);
    thruster.position.set(side * 0.11, 0.50, -0.18);
    thruster.rotation.y = side > 0 ? -0.15 : 0.15;
    chestArmorGroup.add(thruster);
  });

  // -------------------------------------------------------------
  // STAGE 14 & 15: Armored Helmet & Motorized Faceplate with Eye Flare
  // -------------------------------------------------------------
  helmetGroup = new THREE.Group();
  suitRoot.add(helmetGroup);

  // Outer Crimson Skull Dome
  const skullDome = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 24), crimsonMat);
  skullDome.scale.set(0.95, 1.2, 1.05);
  skullDome.position.set(0, 0.99, -0.01);
  helmetGroup.add(skullDome);

  // Gold Cheek & Jawline Cowls
  [-1, 1].forEach((side) => {
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.12), goldMat);
    jaw.position.set(side * 0.12, 0.90, 0.08);
    jaw.rotation.y = side > 0 ? 0.35 : -0.35;
    helmetGroup.add(jaw);
  });

  // Motorized Faceplate (Brushed Gold with Crimson Brow)
  faceplateMesh = new THREE.Group();
  faceplateMesh.position.set(0, 0.98, 0.12);
  helmetGroup.add(faceplateMesh);

  const faceplateGold = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.24, 0.06), goldMat);
  faceplateMesh.add(faceplateGold);

  const browRed = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.07), crimsonMat);
  browRed.position.set(0, 0.09, 0.01);
  faceplateMesh.add(browRed);

  // Glowing Eye Slits (Cyan-White)
  eyeGlowMesh = new THREE.Group();
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.02), cyanCoreMat);
    eye.position.set(side * 0.048, 0.03, 0.04);
    eye.rotation.z = side > 0 ? 0.15 : -0.15;
    eyeGlowMesh.add(eye);
  });
  eyeGlowMesh.visible = false;
  faceplateMesh.add(eyeGlowMesh);
}

/**
 * Build 3D Sparks System for mechanical docking impacts
 */
function buildSparksSystem() {
  const sparkCount = 60;
  sparkGeo = new THREE.BufferGeometry();
  sparkPositions = new Float32Array(sparkCount * 3);
  sparkVelocities = new Float32Array(sparkCount * 3);

  for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i * 3] = 0;
    sparkPositions[i * 3 + 1] = -100; // Offscreen
    sparkPositions[i * 3 + 2] = 0;

    sparkVelocities[i * 3] = (Math.random() - 0.5) * 4;
    sparkVelocities[i * 3 + 1] = Math.random() * 3 + 1;
    sparkVelocities[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: 0x00F5FF,
    size: 0.045,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  sparksMesh = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparksMesh);
}

function triggerSparkBurst(x, y, z) {
  if (!sparkPositions || !sparkVelocities) return;
  const count = sparkPositions.length / 3;
  for (let i = 0; i < count; i++) {
    sparkPositions[i * 3] = x + (Math.random() - 0.5) * 0.1;
    sparkPositions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.1;
    sparkPositions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.1;

    sparkVelocities[i * 3] = (Math.random() - 0.5) * 3.5;
    sparkVelocities[i * 3 + 1] = Math.random() * 2.8 + 0.8;
    sparkVelocities[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
  }
  sparkGeo.attributes.position.needsUpdate = true;
}

function updateSparks(dt) {
  if (!sparkPositions || !sparkVelocities || !sparkGeo) return;
  const count = sparkPositions.length / 3;
  let active = false;

  for (let i = 0; i < count; i++) {
    if (sparkPositions[i * 3 + 1] > -90) {
      active = true;
      sparkPositions[i * 3] += sparkVelocities[i * 3] * dt;
      sparkPositions[i * 3 + 1] += sparkVelocities[i * 3 + 1] * dt;
      sparkPositions[i * 3 + 2] += sparkVelocities[i * 3 + 2] * dt;

      // Gravity
      sparkVelocities[i * 3 + 1] -= 9.8 * dt;

      // Fade out below pedestal
      if (sparkPositions[i * 3 + 1] < -1.2) {
        sparkPositions[i * 3 + 1] = -100;
      }
    }
  }

  if (active) {
    sparkGeo.attributes.position.needsUpdate = true;
  }
}

/**
 * Dark Reflective Ground Pedestal
 */
function buildGroundPedestal() {
  const discGeo = new THREE.CylinderGeometry(0.9, 0.95, 0.05, 32);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x0C121D,
    roughness: 0.35,
    metalness: 0.8,
  });
  const pedestal = new THREE.Mesh(discGeo, discMat);
  pedestal.position.set(0, -1.14, 0);
  suitRoot.add(pedestal);

  // Glowing ring in pedestal
  const ringGeo = new THREE.TorusGeometry(0.85, 0.012, 16, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
  const glowRing = new THREE.Mesh(ringGeo, ringMat);
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.set(0, -1.11, 0);
  suitRoot.add(glowRing);
}

/**
 * Configure the 15-stage Assembly Choreography with GSAP ScrollTrigger
 */
function setupAssemblyChoreography() {
  if (isReducedMotionPreferred()) {
    // Show fully assembled suit immediately
    setAllComponentsFinal();
    updateStageHUD(14);
    return;
  }

  // Initial exploded/incoming offsets for rapid snapping
  setAllComponentsExploded();

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-creation',
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: true, // Immediate direct scroll synchronization (zero lag)
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const stageIndex = Math.min(Math.floor(p * 15), 14);
        updateStageHUD(stageIndex, p);
      },
    },
  });

  // Rapid 15-stage mechanical assembly progression (compressed, fast, snapping)
  // Stage 01: Mannequin in dark technical undersuit (0.00 -> 0.06)
  timeline.to(mannequinGroup.position, { y: 0, duration: 0.05 }, 0);

  // Stage 02: Chest Arc Reactor Unibeam Core locks in (0.06 -> 0.12)
  timeline
    .to(chestCoreGroup.position, { z: 0, duration: 0.06, ease: 'power3.in' }, 0.06)
    .to(chestCoreGroup.scale, { x: 1, y: 1, z: 1, duration: 0.06 }, 0.06)
    .call(() => {
      chestPointLight.intensity = 4.2;
      triggerSparkBurst(0, 0.45, 0.22);
    }, null, 0.12);

  // Stage 03: Spinal Column & Rib Calipers clamp (0.12 -> 0.19)
  timeline
    .to(spineRibGroup.position, { z: 0, duration: 0.07, ease: 'back.out(1.5)' }, 0.12)
    .call(() => triggerSparkBurst(0, 0.50, -0.15), null, 0.19);

  // Stage 04: Abdominal Segmented Plates slide in and lock (0.19 -> 0.26)
  timeline
    .to(abdominalsGroup.position, { z: 0, x: 0, duration: 0.07, ease: 'power2.out' }, 0.19)
    .call(() => triggerSparkBurst(0, 0.18, 0.16), null, 0.26);

  // Stage 05: Hip & Pelvis Actuators attach (0.26 -> 0.33)
  timeline
    .to(pelvisGroup.position, { y: 0, z: 0, duration: 0.07, ease: 'power3.out' }, 0.26)
    .call(() => triggerSparkBurst(0, -0.06, 0.12), null, 0.33);

  // Stage 06: Shoulder Sockets & Collar Cowl swoop down (0.33 -> 0.40)
  timeline
    .to(shoulderCollarGroup.position, { y: 0, z: 0, duration: 0.07, ease: 'power2.inOut' }, 0.33)
    .call(() => {
      triggerSparkBurst(-0.36, 0.66, 0);
      triggerSparkBurst(0.36, 0.66, 0);
    }, null, 0.40);

  // Stage 07: Upper Arm Bicep / Tricep Sleeves mount (0.40 -> 0.47)
  timeline
    .to(bicepsGroup.position, { x: 0, y: 0, duration: 0.07, ease: 'power2.out' }, 0.40)
    .call(() => triggerSparkBurst(0.38, 0.45, 0), null, 0.47);

  // Stage 08: Forearm Gauntlets & Wrist Locking Rings seal (0.47 -> 0.54)
  timeline
    .to(forearmsGroup.position, { y: 0, z: 0, duration: 0.07, ease: 'power3.out' }, 0.47)
    .call(() => triggerSparkBurst(-0.43, 0.10, 0.05), null, 0.54);

  // Stage 09: Articulated Hands & Palm Repulsor Emitters assemble (0.54 -> 0.61)
  timeline
    .to(handsGroup.position, { y: 0, z: 0, duration: 0.07, ease: 'back.out(2)' }, 0.54)
    .call(() => triggerSparkBurst(0.44, -0.06, 0), null, 0.61);

  // Stage 10: Upper Leg Thigh Armor & Pistons clamp (0.61 -> 0.68)
  timeline
    .to(thighsGroup.position, { x: 0, z: 0, duration: 0.07, ease: 'power2.inOut' }, 0.61)
    .call(() => triggerSparkBurst(0.15, -0.34, 0.05), null, 0.68);

  // Stage 11: Knee Cops, Shin Greaves & Calf Cowls wrap and seal (0.68 -> 0.75)
  timeline
    .to(shinGreavesGroup.position, { z: 0, y: 0, duration: 0.07, ease: 'power3.out' }, 0.68)
    .call(() => triggerSparkBurst(0.15, -0.75, 0.08), null, 0.75);

  // Stage 12: Armored Combat Boots & Ankle Stabilizers lock (0.75 -> 0.82)
  timeline
    .to(bootsGroup.position, { y: 0, duration: 0.07, ease: 'power4.out' }, 0.75)
    .call(() => {
      triggerSparkBurst(-0.15, -1.05, 0.1);
      triggerSparkBurst(0.15, -1.05, 0.1);
    }, null, 0.82);

  // Stage 13: Pectoral Breastplates & Back Thruster Cowls slam shut (0.82 -> 0.89)
  timeline
    .to(chestArmorGroup.position, { z: 0, duration: 0.07, ease: 'power4.inOut' }, 0.82)
    .call(() => triggerSparkBurst(0, 0.48, 0.19), null, 0.89);

  // Stage 14: Armored Helmet descends & Motorized Faceplate swings down and locks (0.89 -> 0.95)
  timeline
    .to(helmetGroup.position, { y: 0, duration: 0.06, ease: 'power2.out' }, 0.89)
    .to(faceplateMesh.position, { y: 0, z: 0.12, duration: 0.05, ease: 'power3.in' }, 0.90)
    .call(() => {
      triggerSparkBurst(0, 0.98, 0.15);
    }, null, 0.95);

  // Stage 15: Eye Flare & Chest Unibeam Pulse — Suit Fully Online (0.95 -> 1.0)
  timeline
    .call(() => {
      if (eyeGlowMesh) eyeGlowMesh.visible = true;
      if (chestPointLight) chestPointLight.intensity = 5.5;
    }, null, 0.96)
    .to(camera.position, { z: 4.15, y: 0.20, duration: 0.05, ease: 'power1.out' }, 0.96);
}

function setAllComponentsExploded() {
  if (chestCoreGroup) {
    chestCoreGroup.position.set(0, 0, 3.2);
    chestCoreGroup.scale.set(0.3, 0.3, 0.3);
  }
  if (spineRibGroup) spineRibGroup.position.set(0, 0, -2.8);
  if (abdominalsGroup) abdominalsGroup.position.set(0, 0, 2.5);
  if (pelvisGroup) pelvisGroup.position.set(0, -1.8, 1.2);
  if (shoulderCollarGroup) shoulderCollarGroup.position.set(0, 2.8, 0.8);
  if (bicepsGroup) bicepsGroup.position.set(0, 1.6, 1.4);
  if (forearmsGroup) forearmsGroup.position.set(0, -1.8, 1.8);
  if (handsGroup) handsGroup.position.set(0, -1.5, 1.2);
  if (thighsGroup) thighsGroup.position.set(0, 0, 2.4);
  if (shinGreavesGroup) shinGreavesGroup.position.set(0, -1.8, 2.2);
  if (bootsGroup) bootsGroup.position.set(0, -2.5, 0);
  if (chestArmorGroup) chestArmorGroup.position.set(0, 0, 2.2);
  if (helmetGroup) helmetGroup.position.set(0, 2.5, 0);
  if (faceplateMesh) faceplateMesh.position.set(0, 0.8, 1.5);
  if (eyeGlowMesh) eyeGlowMesh.visible = false;
  if (chestPointLight) chestPointLight.intensity = 0;
}

function setAllComponentsFinal() {
  if (chestCoreGroup) {
    chestCoreGroup.position.set(0, 0, 0);
    chestCoreGroup.scale.set(1, 1, 1);
  }
  if (spineRibGroup) spineRibGroup.position.set(0, 0, 0);
  if (abdominalsGroup) abdominalsGroup.position.set(0, 0, 0);
  if (pelvisGroup) pelvisGroup.position.set(0, 0, 0);
  if (shoulderCollarGroup) shoulderCollarGroup.position.set(0, 0, 0);
  if (bicepsGroup) bicepsGroup.position.set(0, 0, 0);
  if (forearmsGroup) forearmsGroup.position.set(0, 0, 0);
  if (handsGroup) handsGroup.position.set(0, 0, 0);
  if (thighsGroup) thighsGroup.position.set(0, 0, 0);
  if (shinGreavesGroup) shinGreavesGroup.position.set(0, 0, 0);
  if (bootsGroup) bootsGroup.position.set(0, 0, 0);
  if (chestArmorGroup) chestArmorGroup.position.set(0, 0, 0);
  if (helmetGroup) helmetGroup.position.set(0, 0, 0);
  if (faceplateMesh) faceplateMesh.position.set(0, 0, 0.12);
  if (eyeGlowMesh) eyeGlowMesh.visible = true;
  if (chestPointLight) chestPointLight.intensity = 5.0;
}

function updateStageHUD(stageIdx, progress = 0) {
  if (stageIndicatorEl) {
    stageIndicatorEl.textContent = STAGE_LABELS[stageIdx] || STAGE_LABELS[0];
  }
  if (progressFillEl) {
    progressFillEl.style.width = `${Math.round(progress * 100)}%`;
  }
}

export function destroyExosuit3D() {
  if (timeline) {
    if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    timeline.kill();
    timeline = null;
  }

  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  if (renderer) {
    renderer.dispose();
    renderer = null;
  }

  scene = null;
  camera = null;
}
