<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Edit Todo</h1>
            <p class="text-gray-600">Edit todo yang sudah ada</p>
          </div>
          <router-link
            to="/todos"
            class="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
          >
            ← Kembali ke List
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-md">
        {{ error }}
      </div>

      <!-- Edit Form -->
      <div v-else-if="todo" class="bg-white rounded-lg shadow-sm border p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Judul Todo *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan judul todo"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan deskripsi todo (opsional)"
            ></textarea>
          </div>

          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.completed"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Todo selesai</span>
            </label>
          </div>

          <div v-if="message" :class="[
            'p-3 rounded-md text-sm',
            message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          ]">
            {{ message.text }}
          </div>

          <div class="flex justify-end space-x-3">
            <router-link
              to="/todos"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Batal
            </router-link>
            <button
              type="submit"
              :disabled="submitting || !form.title"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodosStore } from '../stores/todos'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const todosStore = useTodosStore()

const todo = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref(null)
const message = ref(null)

const form = reactive({
  title: '',
  description: '',
  completed: false
})

onMounted(async () => {
  const todoId = route.params.id
  
  try {
    // Fetch todo detail
    const response = await axios.get(`http://localhost:3000/api/todos/${todoId}`)
    todo.value = response.data
    
    // Populate form
    form.title = todo.value.title
    form.description = todo.value.description
    form.completed = todo.value.completed
  } catch (err) {
    error.value = 'Todo tidak ditemukan atau Anda tidak memiliki akses'
    console.error('Error fetching todo:', err)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (!form.title.trim()) {
    message.value = {
      success: false,
      text: 'Judul todo harus diisi'
    }
    return
  }

  submitting.value = true
  message.value = null

  try {
    const result = await todosStore.updateTodo(route.params.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      completed: form.completed
    })

    message.value = {
      success: result.success,
      text: result.message
    }

    if (result.success) {
      // Redirect to todos list after a short delay
      setTimeout(() => {
        router.push('/todos')
      }, 1000)
    }
  } catch (error) {
    message.value = {
      success: false,
      text: 'Terjadi kesalahan saat menyimpan perubahan'
    }
  } finally {
    submitting.value = false
  }
}
</script> 