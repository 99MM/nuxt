<template>
  <button @click="downloadPdf" class="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    匯出網頁內容 PDF
  </button>
  <div class="min-h-screen text-gray-800 px-6 py-10" id="pdfrange">
    <section>
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold mb-2">我的第一個網頁</h1>
        <p class="text-lg text-gray-600">這是一個用 Nuxt 3 建立的簡單網頁</p>
      </header>
      <div class="max-w-lg mx-auto">
        <h1 class="text-3xl font-bold mb-6">第一頁標題</h1>
        <p class="mb-4">
          這裡放一些段落文字，字數適中讓這區域大約填滿一頁高度。
          可以用這種方式將長文章分段，方便分頁。
        </p>
        <p>
          加入圖片或其他內容都可以，讓每一頁看起來大格且舒適。
        </p>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
        <p class="mb-4">
          這裡放一些段落文字，字數適中讓這區域大約填滿一頁高度。
          可以用這種方式將長文章分段，方便分頁。
        </p>
        <p>
          加入圖片或其他內容都可以，讓每一頁看起來大格且舒適。
        </p>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
        <p class="mb-4">
          這裡放一些段落文字，字數適中讓這區域大約填滿一頁高度。
          可以用這種方式將長文章分段，方便分頁。
        </p>
        <p>
          加入圖片或其他內容都可以，讓每一頁看起來大格且舒適。
        </p>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
        <p class="mb-4">
          這裡放一些段落文字，字數適中讓這區域大約填滿一頁高度。
          可以用這種方式將長文章分段，方便分頁。
        </p>
        <p>
          加入圖片或其他內容都可以，讓每一頁看起來大格且舒適。
        </p>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
        <p class="mb-4">
          這裡放一些段落文字，字數適中讓這區域大約填滿一頁高度。
          可以用這種方式將長文章分段，方便分頁。
        </p>
        <p>
          加入圖片或其他內容都可以，讓每一頁看起來大格且舒適。
        </p>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
        <p class="mb-4">
          這裡放一些段落文字，字數適中讓這區域大約填滿一頁高度。
          可以用這種方式將長文章分段，方便分頁。
        </p>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
        <img src="https://picsum.photos/600/300" alt="示意圖片" class="mt-6 rounded shadow "/>
      </div>

      <div class="max-w-lg mx-auto mt-20">
        <h2 class="text-2xl font-semibold mb-6">第二頁標題</h2>
        <p class="mb-4">
          這裡是第二頁的內容，盡量填滿頁面高度，這樣換頁才自然。
        </p>
        <p>多一點文字內容讓畫面有足夠高度產生換頁。</p>
        <img src="https://picsum.photos/600/300?2" alt="示意圖片" class="mt-6 rounded shadow"/>
      </div>

    </section>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

let html2canvas = null
let jsPDF = null
const contentRef = ref(null)

onMounted(async () => {
  if (process.client) {
    html2canvas = (await import('html2canvas')).default
    jsPDF = (await import('jspdf')).default
  }
})

const downloadPdf = async () => {
  if (!html2canvas || !jsPDF) return

  const content = contentRef.value
  const canvas = await html2canvas(document.getElementById('pdfrange'), {
    allowTaint: true,
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0)
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  const imgProps = pdf.getImageProperties(imgData)
  const imgWidth = pdfWidth
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdfHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
  }

  pdf.save('webpage.pdf')
}
</script>

<style scoped>
/* 無需設定寬度限制 */
</style>
