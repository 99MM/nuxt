<template>
  <div
      :class="[type === 'white' ? 'white-key' : 'black-key', isPressed ? 'pressed' : '']"
      :style="{ left: `${left}px` }"
      @mousedown="onPress"
      @mouseup="onRelease"
      @mouseleave="onRelease"
      @touchstart.prevent="onPress"
      @touchend.prevent="onRelease"
  >
    <span v-if="type === 'white'" class="note-label">{{ note }}</span>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {usePiano} from '~/composables/piano/usePiano'

const props = defineProps<{
  note: string
  type: 'white' | 'black'
  left: number
}>()

const isPressed = ref(false)
const {playNoteStart, playNoteStop} = usePiano()

const onPress = () => {
  try {
    isPressed.value = true
    playNoteStart(props.note)
  } catch (e) {
    console.error('playNote 發生錯誤:', e)
  }
}

const onRelease = () => {
  isPressed.value = false
  playNoteStop(props.note)
}

</script>

<style scoped>
.white-key {
  width: 40px;
  height: 200px;
  background: white;
  border: 1px solid #ccc;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  transition: all 0.1s ease;
}

.white-key.pressed {
  background: #e0e0e0;
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.black-key {
  width: 25px;
  height: 120px;
  background: black;
  position: absolute;
  top: 0;
  z-index: 2;
  user-select: none;
  cursor: pointer;
  transition: all 0.1s ease;
}

.black-key.pressed {
  background: #444;
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.note-label {
  font-size: 12px;
  padding-bottom: 5px;
  color: #666;
}
</style>
