<template>
  <div class="min-h-screen font-sans text-gray-800 bg-green-50">
    <!-- 頁首 -->
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo 區：先用色塊佔位 -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 "><img src="/images/logo3.png"></div>
          <h1 class="text-2xl font-bold text-green-700">羅山羊枇杷</h1>
        </div>
      </div>
    </header>

    <!-- Hero 區：色塊背景取代圖片 -->
    <section class="w-full h-[34rem] flex items-center justify-center"
             :style="{ backgroundImage: 'url(/images/hero3.jpg)',backgroundSize: 'cover' , backgroundPosition: 'center 60%' }">
      <h2 class="text-green-900 text-3xl md:text-5xl font-bold drop-shadow">
        自然熟成的甜美滋味
      </h2>
    </section>

    <!-- 農園介紹 -->
    <section class="container mx-auto px-4 py-10">
      <h3 class="text-2xl font-semibold text-green-800 mb-4">關於我們(羅氏山羊路枇杷)</h3>
      <p class="text-gray-700 leading-relaxed">
        我們的枇杷，種植在國姓鄉海拔700公尺的山坡。屬於茂木品種，家父於民國70年左右開始栽種，經營至今。樹齡已達三四十年之久。所產枇杷無論甜度、肉質、風味皆屬上品。
        往年均經由貨運公司送往台北果菜市場，交由水果行批發販售，三四十年來頗受好評。有鑑於目前宅配公司的方便性。
        於近年開始嘗試藉由宅配通路行銷，期望各地喜歡枇杷的朋友也有機會品嚐到優質的枇杷！我們枇杷從現在開始已漸漸進入盛產期，預計將在四月中旬結束。喜歡吃枇杷的朋友可別錯過囉！
      </p>
    </section>

    <!-- 訂購方式 -->
    <section class="bg-white py-10">
      <div class="container mx-auto px-4">
        <h3 class="text-2xl font-semibold text-green-800 mb-4">訂購方式</h3>
        <p class="text-lg">📞 請撥打：<a href="tel:0912345678" class="text-green-600 underline">0912-345-678</a></p>
      </div>
    </section>

    <!-- 圖片展示區 -->
    <section class="container mx-auto px-4 py-10">
      <h3 class="text-2xl font-semibold text-green-800 mb-4">精選照片</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div class="bg-gray-200 h-48 rounded-lg shadow-inner flex items-center justify-center text-gray-500">photo1
        </div>
        <div class="bg-gray-200 h-48 rounded-lg shadow-inner flex items-center justify-center text-gray-500">photo2
        </div>
        <div class="bg-gray-200 h-48 rounded-lg shadow-inner flex items-center justify-center text-gray-500">photo3
        </div>
      </div>
    </section>

    <!-- 枇杷動畫區塊 -->
    <section class="bg-white py-10">
      <div class="container mx-auto px-4">
        <h3 class="text-2xl font-semibold text-green-800 mb-4">枇杷的成長過程 🍃</h3>
        <canvas ref="canvasRef" width="400" height="300" class="canvas"></canvas>
      </div>
    </section>

    <!-- 地圖區 -->
    <section class="bg-green-100 py-10">
      <div class="container mx-auto px-4">
        <h3 class="text-2xl font-semibold text-green-800 mb-4">交通位置</h3>
        <div class="w-full h-64 rounded-lg overflow-hidden shadow-md">
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d911.7156699348775!2d120.87460027567978!3d23.92991622103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDU1JzQ3LjciTiAxMjDCsDUyJzMyLjkiRQ!5e0!3m2!1szh-TW!2stw!4v1745300327058!5m2!1szh-TW!2stw"
              width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy">
          </iframe>
        </div>
      </div>
    </section>

    <!-- 頁尾 -->
    <footer class="bg-white py-6 mt-10 text-center text-sm text-gray-500">
      © 2025 羅山羊枇杷 | 甜在心頭，自然傳承
    </footer>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'

const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  const drawBranch = () => {
    ctx.strokeStyle = '#8B5E3C'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(200, 300)
    ctx.bezierCurveTo(200, 250, 190, 230, 200, 200)
    ctx.stroke()
  }

  const drawLeaves = () => {
    ctx.fillStyle = '#4CAF50'
    ctx.beginPath()
    ctx.moveTo(200, 200)
    ctx.bezierCurveTo(160, 190, 170, 160, 200, 170)
    ctx.bezierCurveTo(230, 160, 240, 190, 200, 200)
    ctx.fill()
  }

  const drawFlower = () => {
    const baseX = 200
    const baseY = 170

    for (let i = -10; i <= 10; i += 10) {
      // 畫多朵花
      const x = baseX + i
      const y = baseY + Math.random() * 5

      // 畫花瓣（皺皺的白色橢圓）
      ctx.fillStyle = '#fdfaf5'
      for (let j = 0; j < 5; j++) {
        const angle = (j * 2 * Math.PI) / 5 + Math.random() * 0.2
        const px = x + Math.cos(angle) * 8
        const py = y + Math.sin(angle) * 8
        ctx.beginPath()
        ctx.ellipse(px, py, 5 + Math.random() * 1.5, 8 + Math.random() * 1.5, angle, 0, 2 * Math.PI)
        ctx.fill()
      }

      // 中間黃色花蕊點點
      ctx.fillStyle = '#ffcc33'
      for (let k = 0; k < 10; k++) {
        const offsetX = Math.random() * 4 - 2
        const offsetY = Math.random() * 4 - 2
        ctx.beginPath()
        ctx.arc(x + offsetX, y + offsetY, 1.2, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }

  const drawFruit = () => {
    ctx.fillStyle = '#ffa726'
    ctx.beginPath()
    ctx.ellipse(200, 165, 12, 18, 0, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.beginPath()
    ctx.ellipse(205, 160, 4, 6, -0.3, 0, 2 * Math.PI)
    ctx.fill()
  }

  const stages = [drawBranch, drawLeaves, drawFlower, drawFruit]
  let stage = 0

  const drawNext = () => {
    if (stage < stages.length) {
      stages[stage]()
      stage++
      setTimeout(drawNext, 1000)
    }
  }

  // 背景
  ctx.fillStyle = '#f3fbe9'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  drawNext()
})
</script>

<style scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

canvas {
  background-color: #f3fbe9;
  border: 1px solid #d1eecb;
  border-radius: 8px;
  box-shadow: 0 2px 5px #0002;
}
</style>
