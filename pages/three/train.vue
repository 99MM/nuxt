<script setup>
import {onMounted, ref} from 'vue'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

onMounted(() => {
  // 基本場景
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
  )
  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement)

  // 燈光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // 建立火車 Group
  const trainGroup = new THREE.Group()

  // 車身
  const trainBody = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.5, 1),
      new THREE.MeshStandardMaterial({color: 0x008000})
  )
  trainBody.position.set(0, 0.25, 0)
  trainGroup.add(trainBody)

  // 車廂
  const trainCabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.8),
      new THREE.MeshStandardMaterial({color: 0x0000ff})
  )
  trainCabin.position.set(-0.6, 0.55, 0)
  trainGroup.add(trainCabin)

  // 煙囪
  const chimney = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32),
      new THREE.MeshStandardMaterial({color: 0x333333})
  )
  chimney.position.set(0.8, 0.5, 0)
  trainGroup.add(chimney)

  // 車輪
  const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32)
  const wheelMaterial = new THREE.MeshStandardMaterial({color: 0x000000})
  for (let i = -0.9; i <= 0.9; i += 1.8) {
    for (let j = -0.4; j <= 0.4; j += 0.8) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(i, 0, j)
      trainGroup.add(wheel)
    }
  }
  scene.add(trainGroup)

  // 鐵軌
  const track = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.1, 16, 100),
      new THREE.MeshStandardMaterial({color: 0x808080})
  )
  track.rotation.x = Math.PI / 2
  scene.add(track)

  // 相機位置
  camera.position.z = 10
  controls.update()

  // 火車移動變數
  let angle = 0
  const speed = 0.02

  // 動畫迴圈
  function animate() {
    requestAnimationFrame(animate)

    angle += speed
    trainGroup.position.x = 5 * Math.cos(angle)
    trainGroup.position.z = 5 * Math.sin(angle)
    trainGroup.rotation.y = -angle

    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  // 視窗 resize
  window.addEventListener('resize', () => {
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  })
})
</script>

<template>
  <div ref="container" class="w-screen h-screen"/>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
</style>
