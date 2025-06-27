<template>
  <div
      class="relative"
      :style="{ width: `${keysPerOctave * (octaves.length) * keyWidth}px`, height: '200px' }"
  >
    <!-- 白鍵 -->
    <div class="flex">
      <PianoKey
          v-for="(note, index) in allWhiteKeys"
          :key="note"
          :note="note"
          :type="'white'"
          :left="0"
      />
    </div>

    <!-- 黑鍵 -->
    <PianoKey
        v-for="item in allBlackKeys"
        :key="item.note"
        :note="item.note"
        :type="'black'"
        :left="getBlackKeyLeft(item.leftOf)"
    />
  </div>
</template>

<script setup lang="ts">
const keyWidth = 40
const blackKeyOffset = 12
const octaves = [2, 3, 4, 5, 6]
const keysPerOctave = 7

// C~B 的白鍵名稱
const whiteKeyNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// 黑鍵：對應的左邊白鍵
const blackKeyDefs = [
  {note: 'C#', leftOf: 'D'},
  {note: 'D#', leftOf: 'E'},
  {note: 'F#', leftOf: 'G'},
  {note: 'G#', leftOf: 'A'},
  {note: 'A#', leftOf: 'B'}
]

// 自動產生所有白鍵
const allWhiteKeys = octaves.flatMap(oct =>
    whiteKeyNotes.map(note => `${note}${oct}`)
)

// 所有黑鍵定義
const allBlackKeys = octaves.flatMap(oct =>
    blackKeyDefs.map(({note, leftOf}) => ({
      note: `${note}${oct}`,
      leftOf: `${leftOf}${oct}`
    }))
)

// 計算黑鍵位置
const getBlackKeyLeft = (leftOfNote: string): number => {
  const index = allWhiteKeys.indexOf(leftOfNote)
  return index * keyWidth - blackKeyOffset
}
</script>