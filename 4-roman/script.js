// Initialize Three.js scene
let scene, camera, renderer, controls;
let hannibalModel;

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1420);
    scene.fog = new THREE.FogExp2(0x0a1420, 0.02);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, 
        document.querySelector('.model-container').clientWidth / 
        document.querySelector('.model-container').clientHeight, 
        0.1, 1000
    );
    camera.position.z = 5;
    camera.position.y = 1.5;
    
    // Create renderer
    const canvas = document.querySelector('#model-canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true,
        alpha: true
    });
    renderer.setSize(
        document.querySelector('.model-container').clientWidth, 
        document.querySelector('.model-container').clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xd4af37, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0x1a75bc, 0.6);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);
    
    const fillLight = new THREE.PointLight(0xffffff, 0.4);
    fillLight.position.set(0, 3, 0);
    scene.add(fillLight);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    
    // Create environment
    createEnvironment();
    
    // Load Hannibal model
    loadHannibalModel();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation loop
    animate();
}
//////////////////////////////////////////////////////////////////////////
// Load Hannibal model
function loadHannibalModel() {
    const loader = new THREE.GLTFLoader();
    loader.load('romes_colosseum.glb',
function (gltf) {
console.log("Model loaded successfully!", gltf);

hannibalModel = gltf.scene;

// 1. Adjust scale (try these values)
hannibalModel.scale.set(1.5, 1.5, 1.5); 

// 2. Center the model
hannibalModel.position.set(0, -1.5, 0);

// 3. Make sure it's visible from all angles
hannibalModel.rotation.y = Math.PI / 4; // 45 degree angle

// 4. Enable shadows for all parts
hannibalModel.traverse(function(node) {
    if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Improve material visibility
        if (node.material) {
            node.material.metalness = 0.2;
            node.material.roughness = 0.8;
        }
    }
});

scene.add(hannibalModel);
document.getElementById('loader').style.display = 'none';

// Debug: Log model position and size
const box = new THREE.Box3().setFromObject(hannibalModel);
const size = box.getSize(new THREE.Vector3());
console.log("Model dimensions:", size);
console.log("Model position:", hannibalModel.position);
},
function (xhr) {
console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error) {
console.error('Error loading model:', error);
createHannibalPlaceholder();
}
);
    
    
}


// Create a placeholder for Hannibal if model fails to load
function createHannibalPlaceholder() {
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        metalness: 0.2,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.5;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xF1C27D,
        metalness: 0.1,
        roughness: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.8;
    group.add(head);
    
    // Helmet
    const helmetGeometry = new THREE.ConeGeometry(0.7, 0.8, 8);
    const helmetMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2
    });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.y = 3.2;
    helmet.rotation.x = Math.PI;
    group.add(helmet);
    
    // Crest
    const crestGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.02);
    const crestMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
    const crest = new THREE.Mesh(crestGeometry, crestMaterial);
    crest.position.y = 3.7;
    crest.position.z = 0.4;
    group.add(crest);
    
    // Position the group
    group.position.y = -1;
    group.rotation.y = Math.PI / 6;
    scene.add(group);
    
    hannibalModel = group;
}

// Create environment
function createEnvironment() {
    // Ground
    const groundGeometry = new THREE.CircleGeometry(15, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x5d4037,
        roughness: 0.9,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Ground pattern
    const patternGeometry = new THREE.RingGeometry(2, 15, 32);
    const patternMaterial = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        side: THREE.DoubleSide,
        opacity: 0.2,
        transparent: true
    });
    const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
    pattern.rotation.x = -Math.PI / 2;
    pattern.position.y = -1.4;
    scene.add(pattern);
    
 
    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        sizeAttenuation: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(40);
        const z = THREE.MathUtils.randFloatSpread(100);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = document.querySelector('.model-container').clientWidth / 
                    document.querySelector('.model-container').clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        document.querySelector('.model-container').clientWidth, 
        document.querySelector('.model-container').clientHeight
    );
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate model slowly
    if (hannibalModel) {
        hannibalModel.rotation.y += 0.002;
    }
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Initialize the scene when the page loads
window.onload = init;
