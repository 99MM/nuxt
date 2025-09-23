<template>
  <div ref="canvasContainer" class="canvas-container" style="width:100vw; height:100vh;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvasContainer = ref(null)
let renderer, scene, camera, controls, animationId

onMounted(() => {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  // Camera
  camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
  )
  camera.position.set(3, 3, 5)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  canvasContainer.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 7.5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 20
  scene.add(directionalLight)

  // Floor
  const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1
  floor.receiveShadow = true
  scene.add(floor)

  // Snowman
  function createSnowball(radius, positionY) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32)
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = positionY
    mesh.castShadow = true
    return mesh
  }

  const bodyBall = createSnowball(0.8, -0.5)
  const headBall = createSnowball(0.5, 0.7)
  scene.add(bodyBall, headBall)

  function createFeature(radius, color, position) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32)
    const material = new THREE.MeshStandardMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(position.x, position.y, position.z)
    mesh.castShadow = true
    return mesh
  }

  const leftEye = createFeature(0.05, 0x000000, { x: -0.15, y: 0.9, z: 0.45 })
  const rightEye = createFeature(0.05, 0x000000, { x: 0.15, y: 0.9, z: 0.45 })
  const topButton = createFeature(0.07, 0x000000, { x: 0, y: -0.2, z: 0.65 })
  const bottomButton = createFeature(0.07, 0x000000, { x: 0, y: -0.5, z: 0.6 })

  const noseGeometry = new THREE.ConeGeometry(0.05, 0.2, 32)
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xff8c00 })
  const nose = new THREE.Mesh(noseGeometry, noseMaterial)
  nose.position.set(0, 0.8, 0.55)
  nose.rotation.x = Math.PI / 2
  nose.castShadow = true

  scene.add(leftEye, rightEye, nose, topButton, bottomButton)

  // Render loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
})
</script>
