<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 font-sans">
    <div class="max-w-6xl mx-auto">

      <!-- 遊戲標題 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">🎯 團隊交流記憶配對遊戲</h1>
        <p class="text-white/90 text-lg">翻開卡片找配對，完成後回答破冰問題！</p>
      </div>

      <!-- 遊戲統計 -->
      <div class="flex justify-center gap-8 mb-6">
        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          <div class="text-2xl font-bold">{{ moves }}</div>
          <div class="text-sm">移動次數</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          <div class="text-2xl font-bold">{{ matches }}/6</div>
          <div class="text-sm">配對成功</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          <div class="text-2xl font-bold">{{ timer }}</div>
          <div class="text-sm">遊戲時間</div>
        </div>
      </div>

      <!-- 遊戲區域 -->
      <div class="grid grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
        <div v-for="(card, index) in cards" :key="index"
             class="card h-24 w-full relative cursor-pointer"
             :class="{ flipped: flippedCards.includes(index), matched: matchedCards.includes(index) }"
             @click="flipCard(index)">
          <div class="card-inner h-full transition-transform duration-500 transform-style-preserve-3d">
            <div
                class="card-front bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg flex items-center justify-center text-white text-2xl font-bold">
              ?
            </div>
            <div class="card-back bg-white shadow-lg flex items-center justify-center text-4xl">
              {{ card }}
            </div>
          </div>
        </div>
      </div>

      <!-- 重新開始按鈕 -->
      <div class="text-center mb-8">
        <button @click="resetGame"
                class="bg-white text-purple-600 font-semibold px-8 py-3 rounded-full hover:bg-purple-50 transition-colors shadow-lg">
          🔄 重新開始
        </button>
      </div>

      <!-- 破冰問題區 -->
      <div v-if="gameCompleted" class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
        <h2 class="text-2xl font-bold text-white mb-4 text-center">🎉 恭喜完成！現在來回答破冰問題吧</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(q, i) in selectedQuestions" :key="i"
               class="question-card text-white p-4 rounded-lg shadow-lg">
            <div class="font-semibold mb-2">問題 {{ i + 1 }}</div>
            <div class="text-sm">{{ q }}</div>
          </div>
        </div>
      </div>

      <!-- 遊戲設定區 -->
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-white mb-6 text-center">🎮 遊戲自訂設定</h2>
        <div class="text-center mt-6">
          <button @click="applySettings"
                  class="bg-yellow-400 text-purple-800 font-semibold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors shadow-lg">
            ✨ 套用設定並重新開始
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'

// 遊戲狀態
const cards = ref([])
const flippedCards = ref([])
const matchedCards = ref([])
const moves = ref(0)
const matches = ref(0)
const timer = ref('00:00')
const gameCompleted = ref(false)
let startTime = null
let timerInterval = null

// 表情符號集合
const emojiSets = ['😊', '😢', '😡', '😍', '🤔', '😴']

// 破冰問題集合
const questionSets = [
  "哪個表情符號最能描述你今天早上的狀態？",
  "你因為培養出哪個工作技能而覺得很驕傲？",
  "如果用一個表情符號來形容你的工作風格，會是哪一個？",
  "你最喜歡的放鬆方式是什麼？",
  "你在團隊中扮演什麼角色？",
  "你最欣賞同事身上的哪個特質？"
]
const selectedQuestions = ref([])

const initGame = () => {
  const doubled = [...emojiSets, ...emojiSets]
  cards.value = doubled.sort(() => Math.random() - 0.5)
  flippedCards.value = []
  matchedCards.value = []
  moves.value = 0
  matches.value = 0
  gameCompleted.value = false
  selectedQuestions.value = []
  startTimer()
}

const flipCard = (index) => {
  if (flippedCards.value.includes(index) || flippedCards.value.length >= 2 || gameCompleted.value) return

  flippedCards.value.push(index)

  if (flippedCards.value.length === 2) {
    moves.value++
    checkMatch()
  }
}

const checkMatch = () => {
  const [first, second] = flippedCards.value
  if (cards.value[first] === cards.value[second]) {
    matchedCards.value.push(first, second)
    setTimeout(() => {
      flippedCards.value = []
      matches.value = matchedCards.value.length / 2
      if (matches.value === 6) completeGame()
    }, 500)
  } else {
    setTimeout(() => {
      flippedCards.value = []
    }, 1000)
  }
}

const startTimer = () => {
  startTime = Date.now()
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const min = String(Math.floor(elapsed / 60)).padStart(2, '0')
    const sec = String(elapsed % 60).padStart(2, '0')
    timer.value = `${min}:${sec}`
  }, 1000)
}

const completeGame = () => {
  gameCompleted.value = true
  clearInterval(timerInterval)
  selectedQuestions.value = questionSets.sort(() => Math.random() - 0.5).slice(0, 6)
}

const resetGame = () => {
  clearInterval(timerInterval)
  initGame()
}

const applySettings = () => {
  resetGame()
}

onMounted(() => {
  initGame()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap');

body {
  font-family: 'Noto Sans TC', sans-serif;
}

.card {
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back {
  transform: rotateY(180deg);
}

.matched {
  opacity: 0.6;
  pointer-events: none;
}

.pulse {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.question-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.question-card:hover {
  transform: translateY(-4px);
}
</style>
