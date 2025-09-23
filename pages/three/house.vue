<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const container = ref(null)

onMounted(() => {
  // 場景 & 相機 & 渲染器
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
  )
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  // 燈光
  scene.add(new THREE.AmbientLight(0xffffff, 0.7))
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
  directionalLight.position.set(5, 10, 7.5).normalize()
  scene.add(directionalLight)

  // 材質
  const woodMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 })
  const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 })
  const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
  const grassMaterial = new THREE.MeshPhongMaterial({ color: 0x006800 })
  const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x87ceeb })

  // 木屋
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 3), woodMaterial)
  scene.add(cabin)

  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 2.5, 4, 4, 1), roofMaterial)
  roof.rotation.y = Math.PI / 4
  roof.position.set(0, 3.25, 0)
  scene.add(roof)

  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 1.8, 0.1), doorMaterial)
  door.position.set(0, -0.35, 1.55)
  scene.add(door)

  const leftWindow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), windowMaterial)
  leftWindow.position.set(-1.5, 0.5, 1.55)
  scene.add(leftWindow)

  const rightWindow = leftWindow.clone()
  rightWindow.position.set(1.5, 0.5, 1.55)
  scene.add(rightWindow)

  // 草地
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), grassMaterial)
  grass.rotation.x = -Math.PI / 2
  grass.position.set(0, -1.2, 0)
  scene.add(grass)

  // 樹
  function createTree(x, z) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 8), woodMaterial)
    trunk.position.set(x, -1, z)
    scene.add(trunk)

    const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshPhongMaterial({ color: 0x002a00 }))
    leaves.position.set(x, 0, z)
    scene.add(leaves)
  }
  createTree(-3, 2)
  createTree(2, -2)
  createTree(3, 3)

  // 軌道
  const track = new THREE.Mesh(new THREE.TorusGeometry(8, 0.1, 16, 100), new THREE.MeshStandardMaterial({ color: 0x808080 }))
  track.rotation.x = Math.PI / 2
  scene.add(track)

  // 星球（用 canvas 紋理）
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 512
  canvas.height = 512
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, '#1d3f72')
  gradient.addColorStop(0.4, '#4a89e0')
  gradient.addColorStop(0.6, '#72c2f0')
  gradient.addColorStop(1, '#a2d8f8')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 82, 82),
      new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas), bumpScale: 0.05, metalness: 0.3, roughness: 0.7 })
  )
  scene.add(planet)

  // 不規則的凸出物
  const irregularShape = new THREE.Shape()
  const radius = 2
  const numPoints = 60
  for (let i = 0; i < numPoints; i++) {
    const a = (i / numPoints) * Math.PI * 2
    const r = radius + (Math.random() * 0.5 - 0.25)
    const x = r * Math.cos(a)
    const y = r * Math.sin(a)
    i === 0 ? irregularShape.moveTo(x, y) : irregularShape.lineTo(x, y)
  }
  irregularShape.closePath()
  const irregular = new THREE.Mesh(new THREE.ExtrudeGeometry(irregularShape, { depth: 1, bevelEnabled: false }), new THREE.MeshNormalMaterial())
  irregular.position.set(-3, 0, -5)
  scene.add(irregular)

  // 粒子
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  const particles = new THREE.BufferGeometry()
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  scene.add(new THREE.Points(particles, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 })))

  // 雲
  const cloudGroup = new THREE.Group()
  for (let i = 0; i < 20; i++) {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 0.5 + 0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }))
    sphere.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
    sphere.scale.set(Math.random() * 1.2 + 0.8, Math.random() * 1.2 + 0.8, Math.random() * 1.2 + 0.8)
    cloudGroup.add(sphere)
  }
  cloudGroup.position.set(0, 8, 0)
  scene.add(cloudGroup)

  // glb 模型
  const loader = new GLTFLoader()
  let model
  loader.load('/nuxt/glb/1.glb', (gltf) => {
    model = gltf.scene
    model.scale.set(3, 3, 3)
    scene.add(model)
  })

  // 模型隨機移動
  const speedRange = 0.1
  let moveCounter = 30
  const rotationSpeed = 0.01
  const randomDirection = new THREE.Vector3((Math.random() - 0.5) * speedRange, 0.1, (Math.random() - 0.5) * speedRange)

  // 相機 & 控制
  camera.position.set(0, 2, 7)
  const controls = new OrbitControls(camera, renderer.domElement)

  // 動畫
  let angle = 0
  const speed = 0.02
  function animate() {
    requestAnimationFrame(animate)

    angle += speed
    planet.position.x = 8 * Math.cos(angle)
    planet.position.z = 8 * Math.sin(angle)
    planet.rotation.y = -angle

    if (model) {
      model.position.add(randomDirection)
      model.rotation.x += rotationSpeed
      model.rotation.y += rotationSpeed
      model.rotation.z += rotationSpeed
      moveCounter--
      if (moveCounter < 0) {
        randomDirection.set((Math.random() - 0.5) * speedRange, 0, (Math.random() - 0.5) * speedRange)
        moveCounter = 30
      }
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // resize
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
  <div ref="container" class="w-screen h-screen"></div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
</style>
