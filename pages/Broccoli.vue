<template>
  <canvas ref="canvasRef" width="400" height="400" class="mx-auto mt-10" />
</template>

<script setup>
import { onMounted, ref } from 'vue'

const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  let progress = 0

  // 🎨 背景漸層（天空 ➜ 草地）
  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#b3e5fc') // 天空藍
    gradient.addColorStop(0.6, '#dcedc8') // 草地綠
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function drawStem() {
    ctx.fillStyle = "#88c057"; // 溫和的綠色，符合插圖風格
    ctx.beginPath();
    ctx.moveTo(160, 250); // 左側底部

    // 左側主幹曲線往上
    ctx.bezierCurveTo(150, 220, 160, 180, 180, 150); // 左邊主幹輪廓

    // 分支 1
    ctx.lineTo(170, 140);
    ctx.bezierCurveTo(160, 130, 165, 120, 180, 125);
    ctx.lineTo(185, 140);

    // 分支 2
    ctx.lineTo(180, 130);
    ctx.bezierCurveTo(190, 120, 195, 115, 205, 125);
    ctx.lineTo(210, 140);

    // 分支 3
    ctx.lineTo(205, 130);
    ctx.bezierCurveTo(215, 115, 225, 120, 225, 135);
    ctx.lineTo(220, 145);

    // 主幹右側曲線往下
    ctx.bezierCurveTo(240, 180, 250, 220, 240, 250); // 右邊主幹輪廓

    // 底部連接
    ctx.bezierCurveTo(230, 260, 170, 260, 160, 250);

    ctx.closePath();
    ctx.fill();
  }


  // 🌱 花椰菜梗（加陰影）
  // function drawStem() {
  //   ctx.save()
  //   ctx.fillStyle = "#6b8e23"
  //   ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  //   ctx.shadowBlur = 10
  //   ctx.shadowOffsetX = 2
  //   ctx.shadowOffsetY = 4
  //
  //   ctx.beginPath()
  //   ctx.moveTo(180, 200)
  //   ctx.lineTo(180, 300)
  //   ctx.lineTo(220, 300)
  //   ctx.lineTo(220, 200)
  //   ctx.closePath()
  //   ctx.fill()
  //   ctx.restore()
  // }

  //🌼 花球（每個小球加柔和陰影）
  function drawCloud(x, y, r, color) {
    ctx.save()
    ctx.fillStyle = color
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const theta = (i / 5) * Math.PI * 2
      ctx.arc(x + Math.cos(theta) * r, y + Math.sin(theta) * r, r, 0, Math.PI * 2)
    }
    ctx.fill()
    ctx.restore()
  }

  function drawFlorets() {
    if (progress > 0.1) drawCloud(160, 210, 20, '#228B22')
    if (progress > 0.2) drawCloud(200, 190, 25, '#2e8b57')
    if (progress > 0.3) drawCloud(240, 210, 20, '#228B22')
    if (progress > 0.4) drawCloud(180, 170, 15, '#2e8b57')
    if (progress > 0.5) drawCloud(220, 170, 15, '#2e8b57')
  }

  function drawBroccoli() {
    drawBackground()
    drawStem()
    drawFlorets()
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (progress < 1) progress += 0.01
    drawBroccoli()
    if (progress < 1) requestAnimationFrame(animate)
  }

  animate()
})
</script>

<style scoped>
canvas {
  border: 1px solid #ddd;
  border-radius: 12px;
}
</style>
