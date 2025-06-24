<template>
  <div class="date-picker-container">
    <div class="fake-input" @click="toggleCalendar">
      {{ selectedDate ? selectedDate : '選擇日期' }}
    </div>
    <div v-if="showCalendar" class="calendar-popup">
      <div class="calendar-header">
        <button @click="prevMonth">←</button>
        <span @click="toggleYearPicker">
          {{ currentYear }}年 {{ currentMonth + 1 }}月
        </span>
        <button @click="nextMonth">→</button>
      </div>

      <!-- 年份選擇器 (在月曆內顯示) -->
      <div v-if="showYearPicker" class="year-selector">
        <button @click="changeYear(-1)">上一年</button>
        <button @click="changeYear(1)">下一年</button>
      </div>

      <table>
        <thead>
        <tr>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(week, i) in calendar" :key="i">
          <td v-for="date in week" :key="date.date"
              :class="{ today: isToday(date.date), selected: isSelected(date.date) }"
              @click="selectDate(date.date)">
            {{ date.text }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useDateUtils} from '@/composables/useDateUtils'

const {
  weekDays,
  getWeekNumber,
  getFirstDayOfMonth,
  getMonthMatrix
} = useDateUtils()


const now = new Date()
console.log('本月第一天是星期幾：', getFirstDayOfMonth(now))
console.log('本週是第幾週：', getWeekNumber(now))
console.log('日曆格子矩陣：', getMonthMatrix(now))


const showCalendar = ref(false)
const selectedDate = ref('')
const today = new Date()

const days = weekDays

const showYearPicker = ref(false) // 控制年份選擇器顯示
const currentMonth = ref(today.getMonth()) // 當前月份
const currentYear = ref(today.getFullYear()) // 當前年份

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const isToday = (date) => {
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

const isSelected = (date) => {
  return selectedDate.value === date
}

const selectDate = (date) => {
  selectedDate.value = date
  showCalendar.value = false
}

// 切換月份
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

// 切換年份
const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value
}

const changeYear = (increment) => {
  currentYear.value += increment
}

// 生成日曆
const calendar = computed(() => {
  const start = new Date(currentYear.value, currentMonth.value, 1)
  const end = new Date(currentYear.value, currentMonth.value + 1, 0)

  const startDay = start.getDay()
  const totalDays = end.getDate()

  const result = []
  let week = []



  // 填充空白
  for (let i = 0; i < startDay; i++) {
    week.push({text: '', date: null})
  }

  for (let i = 1; i <= totalDays; i++) {
    const dateStr = new Date(currentYear.value, currentMonth.value, i).toISOString().split('T')[0]
    week.push({text: i, date: dateStr})
    if (week.length === 7) {
      result.push(week)
      week = []
    }
  }

  if (week.length > 0) result.push(week)

  return result
})
</script>

<style scoped lang="scss">
.date-picker-container {
  position: relative;
  width: 250px;
  font-family: 'Segoe UI', sans-serif;
}

.fake-input {
  background: #2f4f4f;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
}

.calendar-popup {
  position: absolute;
  top: 50px;
  left: 0;
  background: #fff;
  border-radius: 5px;
  padding: 10px;

  color: #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  width: 220px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header button {
  background-color: #2f4f4f;
  border: none;
  color: #fff;
  padding: 6px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.calendar-header button:hover {
  background-color: #3b5d5d;
}

.calendar-header span {
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.year-selector {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.year-selector button {
  background-color: #2f4f4f;
  border: none;
  color: #fff;
  padding: 6px;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 5px;
  font-size: 12px;
}

.year-selector button:hover {
  background-color: #3b5d5d;
}

.calendar-popup table {
  width: 100%;
  border-collapse: collapse;
}

.calendar-popup td {
  width: 14%;
  text-align: center;
  padding: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.calendar-popup td:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #2f4f4f;
  color: white;
}

.today {
  border: 1px solid #0ff;
}
</style>
