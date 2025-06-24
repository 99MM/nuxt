<template>
  <h1 class="text-3xl font-bold">OOXX輪盤</h1>
  <div class="flex flex-col items-center space-y-4">
    <!-- 畫布 -->
    <canvas ref="canvas" :width="size" :height="size" class="border rounded-full"/>
    <!-- 選項輸入區 -->
    <textarea
        v-model="inputText"
        placeholder="請輸入選項，每行一個"
        rows="15"
        class="w-64 p-2 border rounded resize-none"
    />
    <!-- 扣下扳機按鈕 -->
    <button
        @click="spin"
        class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        :disabled="isSpinning"
    >
      GOGO
    </button>

    <!-- 結果訊息 -->
    <p class="text-xl font-semibold">{{ resultMessage }}</p>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'

// 畫布與基本設定
const size = 500
const canvas = ref(null)
let ctx = null

// 使用者輸入
const inputText = ref('A\nB\nC\nD\nE')

// 狀態變數
const isSpinning = ref(false)
const resultMessage = ref('')

// 選項與顏色（動態生成）
const options = ref([])
const colors = ref([])

// 角度計算用
let angle = 0
let sectorSize = 0
let baseRotation = 0

// 重新產生選項與顏色
const updateOptions = () => {
  const lines = inputText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '')

  options.value = lines
  colors.value = lines.map(() => `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`)
  sectorSize = 2 * Math.PI / options.value.length
  baseRotation = -Math.PI / 2 - sectorSize / 2
  angle = baseRotation

  drawWheel()
}

// 繪製轉盤
const drawWheel = () => {
  const radius = size / 2
  ctx.clearRect(0, 0, size, size)

  for (let i = 0; i < options.value.length; i++) {
    const startAngle = angle + i * sectorSize
    const endAngle = angle + (i + 1) * sectorSize

    ctx.beginPath()
    ctx.moveTo(radius, radius)
    ctx.arc(radius, radius, radius, startAngle, endAngle)
    ctx.fillStyle = colors.value[i]
    ctx.fill()
    ctx.stroke()

    const textAngle = (startAngle + endAngle) / 2
    const textX = radius + Math.cos(textAngle) * (radius * 0.6)
    const textY = radius + Math.sin(textAngle) * (radius * 0.6)
    ctx.save()
    ctx.translate(textX, textY)
    ctx.rotate(textAngle)
    ctx.fillStyle = 'black'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.value[i], 0, 0)
    ctx.restore()
  }

  // 畫中心圓
  ctx.beginPath()
  ctx.arc(radius, radius, 10, 0, 2 * Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()

  // 畫上方指針
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(radius - 10, 20)
  ctx.lineTo(radius + 10, 20)
  ctx.closePath()
  ctx.fillStyle = '#000'
  ctx.fill()
}

// 執行旋轉動畫
const spin = () => {
  if (isSpinning.value || options.value.length === 0) return

  isSpinning.value = true
  resultMessage.value = ''

  const spinAngle = Math.PI * 10 + Math.random() * (2 * Math.PI)
  const duration = 2000
  const startTime = performance.now()

  const animate = (time) => {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    angle = baseRotation + spinAngle * ease

    drawWheel()

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      const effectiveAngle = ((-Math.PI / 2 - angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
      const selectedIndex = Math.floor(effectiveAngle / sectorSize)
      resultMessage.value = `你抽中了：${options.value[selectedIndex]}`
      isSpinning.value = false
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  updateOptions()
})

// 每次輸入選項時即更新畫面
watch(inputText, updateOptions)

</script>
