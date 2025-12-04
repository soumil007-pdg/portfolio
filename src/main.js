import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505); 
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8; 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // MARBLE BUST
    const marbleMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, roughness: 0.4, metalness: 0.1 
    });

    const loader = new GLTFLoader();
    loader.load('/bust.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) { child.material = marbleMat; child.castShadow = true; child.receiveShadow = true; }
        });
        const box = new THREE.Box3().setFromObject(model);
        const scale = 5 / box.getSize(new THREE.Vector3()).length();
        model.scale.set(scale, scale, scale);
        model.position.y = -2;
        scene.add(model);
    }, undefined, () => {
        // Fallback
        scene.add(new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 100, 16), marbleMat));
    });

    // LIGHTING
    const mainSpot = new THREE.SpotLight(0xff0000, 40);
    mainSpot.position.set(0, 2, 12);
    mainSpot.angle = Math.PI / 6; mainSpot.penumbra = 0.5; mainSpot.castShadow = true;
    scene.add(mainSpot);
    scene.add(mainSpot.target);

    const rimLight = new THREE.SpotLight(0x00ffff, 5);
    rimLight.position.set(-10, 5, -5);
    scene.add(rimLight);

    // ANIMATION
    let mouseX = 0; let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
    });

    function animate() {
        requestAnimationFrame(animate);
        mainSpot.position.x += (mouseX * 5 - mainSpot.position.x) * 0.1;
        mainSpot.position.y += (-mouseY * 5 - mainSpot.position.y) * 0.1;
        mainSpot.lookAt(0,0,0);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});