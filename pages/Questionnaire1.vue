<template>
  <h1 class="text-3xl font-bold">問卷巢狀陣列</h1>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-4">
      <button @click="addQuestion()" class="px-4 py-2 bg-green-600 text-white rounded">
        ＋ 新增題目
      </button>
      <button @click="showGroupModal = true" class="px-4 py-2 bg-green-600 text-white rounded">
        🔧 維護選項群組
      </button>
    </div>

    <div v-for="(question, index) in questions" :key="question.id" class="bg-white p-4 rounded shadow space-y-2">
      <div class="flex items-center gap-3" @dragover.prevent @drop="onDrop(question.id, null)">
        <button @click="removeQuestion(question.id)" class="text-red-500">－</button>
        <input v-model="question.title" class="border px-2 py-1 w-1/3 rounded" placeholder="請輸入題目" />
        <input v-model="question.index" class="border px-2 py-1 w-16 text-center rounded" />
        <select v-model="question.type" class="border px-2 py-1 rounded">
          <option value="text-number">簡答題-數字</option>
          <option value="multiple">多選題</option>
          <option value="text-chinese">簡答題-中文</option>
        </select>
        <select v-model="question.optionGroup" @change="onOptionGroupChange(question.id)" class="border px-2 py-1 rounded">
          <option disabled value="">請選擇選項群組</option>
          <option v-for="group in optionGroups" :key="group.id" :value="group.id">
            {{ group.options.map(opt => opt.label).join(' / ') }}
          </option>
        </select>
        <button @click="addQuestion(question.id)" class="text-blue-600">＋子題</button>
      </div>

      <div class="ml-4 space-y-1">
        <div v-for="child in getChildren(question, null)" :key="child.id" draggable="true" @dragstart="onDragStart(child.id)" class="flex items-center gap-2">
          <span class="text-gray-500">↳</span>
          <input v-model="child.title" class="border px-2 py-1 rounded w-1/3" placeholder="子題目" />
          <input v-model="child.index" class="border px-2 py-1 w-16 text-center rounded" />
          <select v-model="child.type" class="border px-2 py-1 rounded">
            <option value="text-number">簡答題-數字</option>
            <option value="multiple">多選題</option>
            <option value="text-chinese">簡答題-中文</option>
          </select>
          <select v-model="child.optionGroup" class="border px-2 py-1 rounded">
            <option disabled value="">請選擇選項群組</option>
            <option v-for="group in optionGroups" :key="group.id" :value="group.id">
              {{ group.options.map(opt => opt.label).join(' / ') }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="getOptionGroupById(question.optionGroup)" class="ml-4 space-y-1">
        <div v-for="(opt, i) in getOptionGroupById(question.optionGroup).options" :key="i" @dragover.prevent @drop="onDrop(question.id, opt.label)">
          <div class="flex items-center gap-2">
            <span>- {{ opt.label }}</span>
            <button @click="addQuestion(question.id, opt.label)" class="text-blue-500">＋子題</button>
          </div>
          <div class="ml-6 space-y-1">
            <div v-for="child in getChildren(question, opt.label)" :key="child.id" draggable="true" @dragstart="onDragStart(child.id)" class="flex items-center gap-2">
              <span class="text-gray-500">↳</span>
              <input v-model="child.title" class="border px-2 py-1 rounded w-1/3" placeholder="子題目" />
              <input v-model="child.index" class="border px-2 py-1 w-16 text-center rounded" />
              <select v-model="child.type" class="border px-2 py-1 rounded">
                <option value="text-number">簡答題-數字</option>
                <option value="multiple">多選題</option>
                <option value="text-chinese">簡答題-中文</option>
              </select>
              <select v-model="child.optionGroup" class="border px-2 py-1 rounded">
                <option disabled value="">請選擇選項群組</option>
                <option v-for="group in optionGroups" :key="group.id" :value="group.id">
                  {{ group.options.map(opt => opt.label).join(' / ') }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showGroupModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">選項群組管理</h3>
        <ul class="space-y-2 mb-4">
          <li v-for="(group, i) in optionGroups" :key="group.id" class="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
            <span class="text-sm text-gray-700 truncate">
              {{ group.options.map(opt => opt.label).join(' / ') || '（空群組）' }}
            </span>
            <div class="space-x-2">
              <button class="text-sm text-blue-600" @click="editGroup(group)">✎ 編輯</button>
              <button class="text-sm text-red-500" @click="deleteGroup(i)">刪除</button>
            </div>
          </li>
        </ul>
        <button @click="newGroup" class="text-blue-600 text-sm mb-4">＋ 新增群組</button>
        <div v-if="editingGroup" class="border-t pt-4 mt-4">
          <div v-for="(opt, j) in editingGroup.options" :key="j" class="flex items-center gap-2 mb-2">
            <input v-model="opt.label" class="border px-2 py-1 w-full rounded" />
            <button class="text-red-500" @click="editingGroup.options.splice(j, 1)">刪除</button>
          </div>
          <button @click="editingGroup.options.push({ label: '' })" class="text-sm text-blue-600">＋ 新增選項</button>
          <div class="flex justify-end space-x-2 mt-4">
            <button @click="saveGroup" class="bg-blue-600 text-white px-4 py-1 rounded">儲存</button>
            <button @click="cancelEdit" class="bg-gray-300 px-4 py-1 rounded">取消</button>
          </div>
        </div>
        <div class="text-right mt-6">
          <button @click="closeGroupModal" class="text-gray-600">✖ 關閉</button>
        </div>
      </div>
    </div>

    <button @click="save" class="bg-blue-600 text-white px-4 py-2 rounded">儲存</button>
    <pre class="mt-4 bg-gray-100 p-4 rounded max-h-96 overflow-auto text-sm">
      {{ jsonOutput }}
    </pre>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const questions = reactive([
  {
    id: '1',
    title: '題目',
    index: '1',
    type: 'multiple',
    optionGroup: '1',
    parentOptionValue: null,
    child: [
      {
        id: '2',
        title: '子題目',
        index: '2',
        type: 'multiple',
        optionGroup: '1',
        parentOptionValue: null
      }
    ]
  }
])

const optionGroups = reactive([
  { id: '1', options: [{ label: '對' }, { label: '錯' }] },
  { id: '2', options: [{ label: '是' }, { label: '否' }] }
])

const showGroupModal = ref(false)
const editingGroup = ref(null)
const draggedId = ref(null)
const jsonOutput = ref('')

function addQuestion(parentId = null, parentOptionValue = null) {
  const newQuestion = {
    id: `${Date.now()}`,
    title: '',
    index: '1',
    type: 'text-number',
    optionGroup: '',
    parentOptionValue,
    child: []
  }

  if (!parentId) {
    questions.push(newQuestion)
  } else {
    const parent = questions.find(q => q.id === parentId)
    if (parent) {
      parent.child.push({ ...newQuestion, child: undefined })
    }
  }
}

function removeQuestion(id) {
  function recursiveRemove(list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) return list.splice(i, 1)
      if (list[i].child) recursiveRemove(list[i].child)
    }
  }
  recursiveRemove(questions)
}

function findAndRemoveQuestionById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list.splice(i, 1)[0]
    if (list[i].child) {
      const result = findAndRemoveQuestionById(list[i].child, id)
      if (result) return result
    }
  }
  return null
}

function onDragStart(id) {
  draggedId.value = id
}

function onDrop(parentId, parentOptionValue = null) {
  const draggedItem = findAndRemoveQuestionById(questions, draggedId.value)
  if (!draggedItem) return

  draggedItem.parentOptionValue = parentOptionValue

  if (!parentId) {
    questions.push(draggedItem)
  } else {
    const parent = questions.find(q => q.id === parentId)
    if (parent) parent.child.push(draggedItem)
  }
  draggedId.value = null
}

function getChildren(question, option = null) {
  return question.child?.filter(c => c.parentOptionValue === option) || []
}

function onOptionGroupChange(parentId) {
  const parent = questions.find(q => q.id === parentId)
  if (parent?.child) {
    parent.child.forEach(q => q.parentOptionValue = null)
  }
}

function getOptionGroupById(id) {
  return optionGroups.find(group => group.id === id)
}

function newGroup() {
  editingGroup.value = { id: '', options: [] }
}

function editGroup(group) {
  editingGroup.value = JSON.parse(JSON.stringify(group))
}

function saveGroup() {
  if (!editingGroup.value.options.length || editingGroup.value.options.some(o => !o.label.trim())) {
    alert('請填寫所有選項')
    return
  }
  if (!editingGroup.value.id) {
    editingGroup.value.id = `group${Date.now()}`
    optionGroups.push({ ...editingGroup.value })
  } else {
    const index = optionGroups.findIndex(g => g.id === editingGroup.value.id)
    if (index !== -1) optionGroups[index] = { ...editingGroup.value }
  }
  editingGroup.value = null
}

function deleteGroup(index) {
  if (confirm('確定要刪除這個選項群組？')) optionGroups.splice(index, 1)
}

function cancelEdit() {
  editingGroup.value = null
}

function closeGroupModal() {
  showGroupModal.value = false
  editingGroup.value = null
}

function save() {
  jsonOutput.value = JSON.stringify(questions, null, 2)
}

</script>
