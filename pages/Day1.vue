<template>
  <section>
    <h1 class="title-bar">
      <button class="nav-button" @click="adjustDay(-1)">‹</button>
      <input type="date" class="date-input" v-model="dateInput" @change="onDateChange"/>
      <button class="nav-button" @click="adjustDay(1)">›</button>
    </h1>

    <div style="padding: 15px">
      <div
          v-for="(group, idx) in items"
          :key="idx"
          class="item"
          :style="{ backgroundColor: getRandomColor(0.3) }"
      >
        <div class="title">{{ group.key }}</div>
        <div class="Content">
          <div
              class="detail"
              v-for="(itemPrice, index) in group.value"
              :key="index"
              :style="{ backgroundColor: itemPrice.color }"
          >
            {{ itemPrice.title }}：${{ itemPrice.price }}
          </div>
        </div>
      </div>
    </div>


  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {format, parse} from 'fecha'
import _ from 'lodash'

// 顯示格式
const displayFormat = 'YYYY-MM-DD'

// 狀態
const user_id = 4
const dateInput = ref(format(new Date(), displayFormat))

// 假資料
const rawItems = [
  {
    id: 1,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 4,
    user_id: 3,
    price: 300,
    owner_id: 1,
    owner_name: '名稱名稱名稱名稱'
  },
  {
    id: 2,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 1,
    user_id: 4,
    price: 300,
    owner_id: 1,
    owner_name: '名稱名稱名稱名稱'
  },
  {
    id: 3,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 2,
    user_id: 4,
    price: 300,
    owner_id: 2,
    owner_name: '名稱名稱'
  },
  {
    id: 4,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 3,
    user_id: 4,
    price: 300,
    owner_id: 3,
    owner_name: '名稱'
  },
  {
    id: 5,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 4,
    user_id: 1,
    price: 300,
    owner_id: 3,
    owner_name: '名稱'
  },
  {
    id: 6,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 4,
    user_id: 2,
    price: 300,
    owner_id: 3,
    owner_name: '名稱'
  },
  {
    id: 7,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 4,
    user_id: 5,
    price: 300,
    owner_id: 3,
    owner_name: '名稱'
  },
  {
    id: 8,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 4,
    user_id: 5,
    price: 300,
    owner_id: 4,
    owner_name: '名稱名稱名稱'
  },
  {
    id: 9,
    title: '項目名稱',
    date: '2021-11-25',
    item_user_id: 4,
    user_id: 7,
    price: 300,
    owner_id: 3,
    owner_name: '名稱名稱'
  }
]

const items = ref([])

onMounted(() => {
  const ary_re = []
  const ary_pay = []

  rawItems.forEach((obj) => {
    if (obj.user_id === user_id) {
      obj.color = 'darkseagreen'
      ary_pay.push(obj)
    } else {
      obj.color = 'lightseagreen'
      ary_re.push(obj)
    }
  })

  const sortedPay = _.orderBy(ary_pay, ['item_user_id'], ['asc'])
  const sortedRe = _.orderBy(ary_re, ['user_id'], ['asc'])

  const grouped = _.groupBy([...sortedRe, ...sortedPay], 'owner_name')
  items.value = Object.keys(grouped).map(key => ({key, value: grouped[key]}))
})

// 工具方法
function adjustDay(offset) {
  const current = parse(dateInput.value, displayFormat)
  current.setDate(current.getDate() + offset)
  dateInput.value = format(current, displayFormat)
}

function onDateChange() {
  // 可以加上 dateInput 變更時要處理的邏輯
}

function getRandomColor(alpha) {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgba(${r},${g},${b},${alpha})`
}
</script>

<style scoped lang="scss">

.title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: #2f4f4f;
  color: white;
  margin: 0;
  padding: 12px 20px;
  border-bottom: 2px solid #1f335f;

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-color: #4f6d7a;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #678d99;
    }
  }

  .date-input {
    font-size: 18px;
    padding: 8px 12px;
    border-radius: 10px;
    border: none;
    outline: none;
    background-color: #ffffff;
    color: #333;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  }

}

section {
  text-align: center;
  border: 2px solid #2f4f4f;
  min-height: 500px;
}

.item {
  overflow: hidden;
  border-radius: 4px;
  margin: 12px 0;
  background: #f5f5f5;

  .title {
    font-size: 22px;
    padding: 10px;
    background-color: #1f335f;
    color: white;
  }

  .detail {
    margin: 5px;
    padding: 0 2px;
    color: #fff;
  }
}

.Content {
  padding: 20px;
}
</style>
