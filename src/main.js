import './style.css';  // <-- Add this line

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.01); 
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    const segments = 60;
    const segmentDepth = 1.5;
    const tunnelWidth = 8;
    const tunnelHeight = 4.5;

    const tunnelMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.25,
        wireframe: false
    });

    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xff3333,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    const tunnelGeo = new THREE.BoxGeometry(tunnelWidth, tunnelHeight, segmentDepth);

    for (let i = 0; i < segments; i++) {
        const zPos = -i * segmentDepth;
        
        const segment = new THREE.Mesh(tunnelGeo, tunnelMat);
        segment.position.set(0, 0, zPos);
        tunnelGroup.add(segment);

        const wire = new THREE.Mesh(tunnelGeo, wireMat);
        wire.position.set(0, 0, zPos);
        tunnelGroup.add(wire);
    }

    const figureGeo = new THREE.CapsuleGeometry(0.2, 0.8, 4, 8);
    const figureMat = new THREE.MeshBasicMaterial({ color: 0x330000 }); 
    const figure = new THREE.Mesh(figureGeo, figureMat);
    figure.position.set(0, -1.5, -6);
    scene.add(figure);

    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 500;
        mouseY = (event.clientY - windowHalfY) / 500;
    });

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        const speed = 0.3;
        tunnelGroup.children.forEach(child => {
            child.position.z += speed;
            if (child.position.z > 7) {
                child.position.z -= segments * segmentDepth;
            }
        });

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, -20);

        const pulse = 0.25 + Math.sin(time * 2) * 0.08;
        tunnelMat.opacity = pulse;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
});

