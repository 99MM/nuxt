<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

onMounted(() => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  // 相機
  const camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
  )
  camera.position.set(0, 2, 5)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
  directionalLight.position.set(5, 10, 7.5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 地板 (接收陰影)
  const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.5
  floor.receiveShadow = true
  scene.add(floor)

  // 材質
  const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
  const grayMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa })
  const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
  const hornMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 })

  // 羊身體
  const body = new THREE.Group()
  for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(Math.random() * 0.2 + 0.3, 16, 16),
        whiteMaterial
    )
    sphere.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 2
    )
    sphere.castShadow = true
    body.add(sphere)
  }
  scene.add(body)

  // 頭部
  const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      grayMaterial
  )
  head.position.set(0, 0.8, 1)
  head.castShadow = true
  scene.add(head)

  // 角
  const leftHorn = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.1, 16, 100, Math.PI),
      hornMaterial
  )
  leftHorn.position.set(-0.5, 1, 0.8)
  leftHorn.rotation.set(Math.PI / 2, Math.PI / 2, 0)
  leftHorn.castShadow = true
  scene.add(leftHorn)

  const rightHorn = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.1, 16, 100, Math.PI),
      hornMaterial
  )
  rightHorn.position.set(0.5, 1, 0.8)
  rightHorn.rotation.set(Math.PI / 2, Math.PI / 2, 0)
  rightHorn.castShadow = true
  scene.add(rightHorn)

  // 腿
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 32)
  const legs = [
    [-0.5, -1, 0.5],
    [0.5, -1, 0.5],
    [-0.5, -1, -0.5],
    [0.5, -1, -0.5]
  ]
  legs.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, grayMaterial)
    leg.position.set(...pos)
    leg.castShadow = true
    scene.add(leg)
  })

  // 耳朵
  const earGeo = new THREE.SphereGeometry(0.2, 32, 32)
  const leftEar = new THREE.Mesh(earGeo, grayMaterial)
  leftEar.position.set(-0.5, 0.9, 1.1)
  leftEar.castShadow = true
  scene.add(leftEar)
  const rightEar = new THREE.Mesh(earGeo, grayMaterial)
  rightEar.position.set(0.5, 0.9, 1.1)
  rightEar.castShadow = true
  scene.add(rightEar)

  // 眼睛
  const eyeGeo = new THREE.SphereGeometry(0.05, 32, 32)
  const leftEye = new THREE.Mesh(eyeGeo, blackMaterial)
  leftEye.position.set(-0.2, 1, 1.4)
  leftEye.castShadow = true
  scene.add(leftEye)
  const rightEye = new THREE.Mesh(eyeGeo, blackMaterial)
  rightEye.position.set(0.2, 1, 1.4)
  rightEye.castShadow = true
  scene.add(rightEye)

  // 尾巴
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32), whiteMaterial)
  tail.position.set(0, -0.2, -1)
  tail.castShadow = true
  scene.add(tail)

  // Render loop
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // RWD
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
