import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked_japanese_garden.jpg')
// const bakedTexture = textureLoader.load('baked_portal_scene.jpg')
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

/**
 * Materials
 */
// Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({ 
    map: bakedTexture
})

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc })
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xe6ccff })

/**
 * Model
 */
gltfLoader.load(
    'japanese_garden1.glb',
    // 'portal2_baked.glb',
    (gltf) =>
    {
        const bakedMesh = gltf.scene.children.find( (child) => child.name === 'japaneseGarden' )
        const poleLightMesh1 = gltf.scene.children.find( (child) => child.name === 'lantermsEmission' )
        const portalLightMesh = gltf.scene.children.find( (child) => child.name === 'portalEmission' )
        // const bakedMesh = gltf.scene.children.find( (child) => child.name === 'portalMerged' )
        // const poleLightMesh1 = gltf.scene.children.find( (child) => child.name === 'poleLightEmission1' )
        // const poleLightMesh2 = gltf.scene.children.find( (child) => child.name === 'poleLightEmission2' )
        // const portalLightMesh = gltf.scene.children.find( (child) => child.name === 'portalLightEmission' )

        bakedMesh.material = bakedMaterial
        poleLightMesh1.material = poleLightMaterial
        // poleLightMesh2.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial

        scene.add(gltf.scene)
        
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 10
controls.minDistance = 1
controls.enablePan = false
controls.maxPolarAngle = Math.PI * 0.49
controls.minAzimuthAngle = - Math.PI * 0.58
controls.maxAzimuthAngle = Math.PI * 0.58

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()