import './style.css';
import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  // ----- SIZE FROM CONTAINER (RIGHT HALF ONLY) -----
  const sizes = {
    width: container.clientWidth,
    height: container.clientHeight,
  };

  // ----- SCENE SETUP -----
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.02);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // ----- PARTICLE CLOUD -----
  const particleCount = 3500;
  const rMax = 3.8;

  const posArray = new Float32Array(particleCount * 3);
  const randomArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const r = rMax * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    posArray[i * 3] = x;
    posArray[i * 3 + 1] = y;
    posArray[i * 3 + 2] = z;

    randomArray[i * 3] = Math.random() - 0.5;
    randomArray[i * 3 + 1] = Math.random() - 0.5;
    randomArray[i * 3 + 2] = Math.random() - 0.5;
  }

  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeo.setAttribute('aRandom', new THREE.BufferAttribute(randomArray, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xff0000,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMat);

  // Move slightly to the left inside the red panel
  const baseX = 1.2;
  particleSystem.position.x = baseX;

  scene.add(particleSystem);

  // ----- ANIMATION -----
  const clock = new THREE.Clock();
  let mouseX = 0;
  let mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Gentle rotation
    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.z += 0.0005;

    // Mouse parallax
    particleSystem.rotation.x = mouseY * 0.1;
    particleSystem.rotation.y += mouseX * 0.01;

    // Slight position shift with mouse
    particleSystem.position.x = baseX + mouseX * 0.4;

    renderer.render(scene, camera);
  }

  animate();

  // ----- RESIZE HANDLER -----
  window.addEventListener('resize', () => {
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});
