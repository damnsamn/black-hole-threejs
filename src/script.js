import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const config = {};

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


/**
 * Objects
 */

config.innerRadius = 1;
config.outerRadius = 5;
config.middleRadius = 2;
config.size = 0.02;
config.count = 10000;

const avg = (array) => {
    let total = 0;

    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }

    return total / array.length;
}

const random = (min = 0, max = 1) => {
    return min + Math.random() * max;
}

const randomAvg = (min = 0, max = 1, count = 3) => {
    let arr = [];
    for (let i = 0; i < count; i++)
        arr[i] = Math.random() * (max - min) + min;

    return avg(arr);
}

// const calculatePosition = () => {
//     const randomOuter = config.middleRadius + Math.random() * config.outerRadius;
//     const randomMiddle = config.innerRadius + randomOuter;
//     const randomInner = config.innerRadius + randomMiddle;

//     return randomInner;
// }


let geometry = null;
let material = null;
let points = null;
let sphereG = null;
let sphereM = null;
let sphere = null;

const generateBlackHole = () => {
    // Destroy old galaxy
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
        sphereG.dispose()
        sphereM.dispose()
        scene.remove(sphere)
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;

        const rX = randomAvg() * 2 - 1;
        const rY = randomAvg() * 2 - 1;
        const rZ = randomAvg() * 2 - 1;
        const unitVector = new THREE.Vector3(rX, rY, rZ).normalize();
        // const angleX = Math.random() * Math.PI * 2;
        // const angleY = Math.random() * Math.PI * 2;
        // const angleZ = Math.random() * Math.PI * 2;

        const distance = random(config.innerRadius, random(config.innerRadius, random(config.middleRadius, config.outerRadius)));
        // const distance = random(config.innerRadius, random(config.innerRadius, random(config.middleRadius, config.outerRadius)))
        // const distance1 = random(config.innerRadius, random(config.innerRadius, random(config.middleRadius, config.outerRadius)))
        // const distance2 = random(config.innerRadius, random(config.innerRadius, random(config.middleRadius, config.outerRadius)))
        // const distance3 = random(config.innerRadius, random(config.innerRadius, random(config.middleRadius, config.outerRadius)))

        positions[i3] = unitVector.x * distance // x
        positions[i3 + 1] = unitVector.y * distance // y
        positions[i3 + 2] = unitVector.z * distance // z

    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    material = new THREE.PointsMaterial({
        size: config.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })
    points = new THREE.Points(geometry, material);
    scene.add(points);


    sphereG = new THREE.SphereBufferGeometry(config.innerRadius,16,16);
    sphereM = new THREE.MeshStandardMaterial({
        color: 0x000000
    });

    sphere = new THREE.Mesh(sphereG, sphereM)
    scene.add(sphere);

}

gui.add(config, "innerRadius").min(0.25).max(2).step(0.05).onChange(generateBlackHole)
gui.add(config, "outerRadius").min(0.5).max(10).step(0.05).onChange(generateBlackHole)
gui.add(config, "middleRadius").min(0.25).max(10).step(0.05).onChange(generateBlackHole)
gui.add(config, "size").min(0.01).max(0.05).step(0.005).onChange(generateBlackHole)
gui.add(config, "count").min(1000).max(100000).step(100).onChange(generateBlackHole)

generateBlackHole();


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Listeners
 */

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()