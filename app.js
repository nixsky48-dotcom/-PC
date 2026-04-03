// app.js

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Navbar Scroll Effect */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    /* 2. Scroll Animation (Intersection Observer) */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    /* 3. Drag & Drop Demo Interaction */
    const dropZone = document.getElementById('drop-zone');
    const demoResult = document.getElementById('demo-result');
    const progressContainer = document.getElementById('progress-container');
    const placeholderText = document.getElementById('placeholder-text');

    // Handle Drag Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('border-brand-purple', 'bg-brand-purple/10');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('border-brand-purple', 'bg-brand-purple/10');
        }, false);
    });

    // Handle Drop
    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => {
        // Mock file input trigger
        simulateUpload();
    });

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        if (files.length > 0) {
            simulateUpload();
        }
    }

    function simulateUpload() {
        // Reset UI
        placeholderText.classList.add('hidden');
        demoResult.classList.add('hidden');
        progressContainer.classList.remove('hidden');
        progressContainer.classList.add('flex');

        // Simulate 2 seconds of AI processing
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressContainer.classList.remove('flex');
            demoResult.classList.remove('hidden');
            demoResult.innerHTML = '<div class="text-center"><p class="text-green-400 font-bold mb-2">✨ 3D 변환 완료!</p><p class="text-sm text-gray-300">실제 서비스에서는 여기에 생성된 3D 모델이 나타납니다.</p></div>';
            demoResult.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'animate-pulse');
        }, 2500);
    }

    /* 4. Three.js - 3D Object Rendering in Hero Section */
    initThreeJS();
});

function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Transparent background
    scene.background = null; 

    // Camera setup to fit the container
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; // Move camera back

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create a cool 3D shape (Icosahedron - techy vibe)
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    // Wireframe tech material
    const material = new THREE.MeshStandardMaterial({
        color: 0xa855f7, // Brand purple
        wireframe: true,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Add Inner solid shape for layered effect
    const innerGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b82f6, // Brand blue
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const innerShape = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerShape);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Auto rotation
        shape.rotation.x += 0.005;
        shape.rotation.y += 0.008;

        innerShape.rotation.x -= 0.003;
        innerShape.rotation.y -= 0.004;

        // Interactive mouse rotation (smooth ease)
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
        scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
