<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

onMounted(() => {
  let scene, camera, renderer, cube

  // === 場景 ===
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  // === 相機 ===
  camera = new THREE.PerspectiveCamera(
      45,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      100
  )
  camera.position.set(5, 5, 5)
  camera.lookAt(0, 0, 0)

  // === 渲染器 ===
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  // === 控制器 ===
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // === 光源 ===
  // 主光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  scene.add(directionalLight)

  // 環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  // === 地板（接收陰影） ===
  const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.5
  floor.receiveShadow = true
  scene.add(floor)

  // === 立方體 ===
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
  cube = new THREE.Mesh(geometry, material)
  cube.castShadow = true
  cube.position.y = 0.5
  scene.add(cube)

  // === 動畫循環 ===
  function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  // === 窗口大小調整 ===
  window.addEventListener('resize', () => {
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  })
})
</script>

<template>
  <div ref="container" class="w-screen h-screen"></div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
</style>
