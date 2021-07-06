import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import leavesVertexShader from './shaders/leaves/vertex.glsl'
import leavesFragmentShader from './shaders/leaves/fragment.glsl'

// console.log(portalVertexShader)
// console.log(portalFragmentShader)

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})
gui.closed = true;

const debugObject = {}


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

// const customUniforms = {
//     uTime: { value: 0 }
// }
const leaves1Material = new THREE.ShaderMaterial({ 
    uniforms: {
        uTime: { value: 0 },

        uLeavesAmplitude: { value: 0.1 },
        uLeavesFrequency: { value: new THREE.Vector2(2.0, 1.5) },

        uLeavesSpeed: { value: 0.5 },
        uLeavesTexture: {
            value: bakedTexture
        }
        
    },
    vertexShader: leavesVertexShader,
    fragmentShader: leavesFragmentShader
})

// leaves1Material.onBeforeCompile = (shader) => {

//     shader.uniforms.uTime = customUniforms.uTime

//     shader.vertexShader = shader.vertexShader.replace(
//         '#include <common>', 
//         `  
//             #include <common>

//         `
//         )
//     shader.vertexShader = shader.vertexShader.replace(
//         '#include <begin_vertex>', 
//         `  
//             #include <begin_vertex>

//         `
//         )
    
// }

const leaves2Material = new THREE.ShaderMaterial({ 
    uniforms: {
        uTime: { value: 0 },

        uLeavesAmplitude: { value: 0.1 },
        uLeavesFrequency: { value: new THREE.Vector2(2.0, 1.5) },

        uLeavesSpeed: { value: 0.65 },
        uLeavesTexture: {
            value: bakedTexture
        }
        
    },
    vertexShader: leavesVertexShader,
    fragmentShader: leavesFragmentShader
})

const leavesFolder = gui.addFolder("Tree Leaves")
leavesFolder.add(leaves1Material.uniforms.uLeavesAmplitude, 'value').min(0).max(1).step(0.001).name('Leaves Amplitude 1')
leavesFolder.add(leaves1Material.uniforms.uLeavesFrequency.value, 'x').min(0).max(4).step(0.01).name('Leaves FrequencyX 1')
leavesFolder.add(leaves1Material.uniforms.uLeavesFrequency.value, 'y').min(0).max(4).step(0.01).name('Leaves FrequencyY 1')
leavesFolder.add(leaves1Material.uniforms.uLeavesSpeed, 'value').min(0).max(4).step(0.01).name('Leaves Speed 1')
leavesFolder.add(leaves2Material.uniforms.uLeavesAmplitude, 'value').min(0).max(1).step(0.001).name('Leaves Amplitude 2')
leavesFolder.add(leaves2Material.uniforms.uLeavesFrequency.value, 'x').min(0).max(4).step(0.01).name('Leaves Freq X 2')
leavesFolder.add(leaves2Material.uniforms.uLeavesFrequency.value, 'y').min(0).max(4).step(0.01).name('Leaves Freq Y 2')
leavesFolder.add(leaves2Material.uniforms.uLeavesSpeed, 'value').min(0).max(4).step(0.01).name('Leaves Speed 2')
leavesFolder.open()

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc })
// const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xe6ccff })

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({ 
    uniforms: 
    {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(0x00f0ff)},
        uColorEnd: { value: new THREE.Color(0xb400ff)}
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader
})

debugObject.portalColorStart = '#00f0ff'
debugObject.portalColorEnd = '#b400ff'

const portalColorsFolder = gui.addFolder("Portal Colors")
portalColorsFolder
    .addColor(debugObject, 'portalColorStart')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })

portalColorsFolder
    .addColor(debugObject, 'portalColorEnd')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })
portalColorsFolder.open()

// *********** Water material **********
debugObject.waterDepthColor = '#003cff'
debugObject.waterSurfaceColor = '#00e1ff'

const waterMaterial = new THREE.ShaderMaterial({ 
    uniforms: 
    {
        uTime: { value: 0 },

        uWavesAmplitude: { value: 0.06 },
        uWavesFrequency: { value: new THREE.Vector2(4.0, 0.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElev: { value: 0.07 },
        uSmallWavesFreq: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.6 },
        uSmallWavesIterations: { value: 2 },

        uDepthColor: { value: new THREE.Color(debugObject.waterDepthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.waterSurfaceColor)},
        uColorOffset: { value: 0.25 },
        uColorMultiplier: { value: 2 }
    },
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    // wireframe: true
})

const wavesFolder = gui.addFolder("Waves")
wavesFolder.add(waterMaterial.uniforms.uWavesAmplitude, 'value').min(0).max(1).step(0.001).name('uWavesAmplitude')
wavesFolder.add(waterMaterial.uniforms.uWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uWavesFrequencyX')
wavesFolder.add(waterMaterial.uniforms.uWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uWavesFrequencyY')
wavesFolder.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.01).name('uBigWaveSpeed')
wavesFolder.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
wavesFolder.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(4).step(0.001).name('uColorMultiplier')
gui.addColor(debugObject, 'waterDepthColor')
    .name('waterDepthColor')
    .onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.waterDepthColor)
    })
    

gui.addColor(debugObject, 'waterSurfaceColor')
    .onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.waterSurfaceColor)
    })
wavesFolder.open()


const smallWavesFolder = gui.addFolder("Small Waves")
smallWavesFolder.add(waterMaterial.uniforms.uSmallWavesElev, 'value').min(0).max(1).step(0.001).name('uSmallWavesElev')
smallWavesFolder.add(waterMaterial.uniforms.uSmallWavesFreq, 'value').min(0).max(30).step(0.001).name('uSmallWavesFreq')
smallWavesFolder.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
smallWavesFolder.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(8).step(1).name('uSmallWavesIterations')
smallWavesFolder.open()





/**
 * Model
 */
gltfLoader.load(
    'japanese_garden5.glb',
    (gltf) =>
    {
        const bakedMesh = gltf.scene.children.find( (child) => child.name === 'japaneseGarden' )
        const poleLightMesh1 = gltf.scene.children.find( (child) => child.name === 'lantermsEmission' )
        const portalLightMesh = gltf.scene.children.find( (child) => child.name === 'portalEmission' )
        const waterMesh = gltf.scene.children.find( (child) => child.name === 'water' )
        const leavesMesh1 = gltf.scene.children.find( (child) => child.name === 'leaves1' )
        const leavesMesh2 = gltf.scene.children.find( (child) => child.name === 'leaves2' )
        // const bakedMesh = gltf.scene.children.find( (child) => child.name === 'portalMerged' )
        // const poleLightMesh1 = gltf.scene.children.find( (child) => child.name === 'poleLightEmission1' )
        // const poleLightMesh2 = gltf.scene.children.find( (child) => child.name === 'poleLightEmission2' )
        // const portalLightMesh = gltf.scene.children.find( (child) => child.name === 'portalLightEmission' )

        bakedMesh.material = bakedMaterial
        poleLightMesh1.material = poleLightMaterial
        // poleLightMesh2.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial

        waterMesh.material = waterMaterial

        leavesMesh1.material = leaves1Material
        leavesMesh2.material = leaves2Material
        
        scene.add(gltf.scene)
        
    }
)


/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 10
    positionArray[i * 3 + 1] = Math.random() * 4
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10

    scaleArray[i] = Math.random()
}
console.log(scaleArray)

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uTime: { value: 0 },
        uPixelRatio: { 
            value: Math.min(window.devicePixelRatio, 2),
        },
        uSize: { value: 250 }
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})
const fireflyFolder = gui.addFolder("Fireflies size")
fireflyFolder.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')
fireflyFolder.open()

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)



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
camera.position.x = 10
camera.position.y = 4
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 20
controls.minDistance = 1
controls.enablePan = false
controls.maxPolarAngle = Math.PI * 0.49
// controls.minAzimuthAngle = - Math.PI * 0.58
// controls.maxAzimuthAngle = Math.PI * 0.58

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

    // Update materials
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime
    waterMaterial.uniforms.uTime.value = elapsedTime
    leaves1Material.uniforms.uTime.value = elapsedTime
    leaves2Material.uniforms.uTime.value = elapsedTime

    // customUniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()