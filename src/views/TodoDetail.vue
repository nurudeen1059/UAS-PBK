<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Detail Todo</h1>
            <p class="text-gray-600">Lihat detail todo</p>
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

      <!-- Todo Detail -->
      <div v-else-if="todo" class="bg-white rounded-lg shadow-sm border p-6">
        <div class="space-y-6">
          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                todo.completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ todo.completed ? 'Selesai' : 'Aktif' }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <router-link
                :to="`/todos/${todo.id}/edit`"
                class="text-green-600 hover:text-green-700 px-3 py-1 rounded text-sm border border-green-300 hover:bg-green-50"
              >
                Edit
              </router-link>
              <button
                @click="deleteTodo"
                class="text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm border border-red-300 hover:bg-red-50"
              >
                Hapus
              </button>
            </div>
          </div>

          <!-- Title -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ todo.title }}
            </h2>
          </div>

          <!-- Description -->
          <div v-if="todo.description">
            <h3 class="text-lg font-medium text-gray-700 mb-2">Deskripsi</h3>
            <p class="text-gray-600 whitespace-pre-wrap">{{ todo.description }}</p>
          </div>

          <!-- Timestamps -->
          <div class="border-t pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium text-gray-700">Dibuat:</span>
                <p>{{ formatDate(todo.createdAt) }}</p>
              </div>
              <div v-if="todo.updatedAt !== todo.createdAt">
                <span class="font-medium text-gray-700">Terakhir diperbarui:</span>
                <p>{{ formatDate(todo.updatedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="border-t pt-6">
            <div class="flex items-center justify-between">
              <button
                @click="toggleStatus"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium',
                  todo.completed
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                ]"
              >
                {{ todo.completed ? 'Tandai Belum Selesai' : 'Tandai Selesai' }}
              </button>
              
              <router-link
                to="/todos"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
              >
                Kembali ke List
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodosStore } from '../stores/todos'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const todosStore = useTodosStore()

const todo = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const todoId = route.params.id
  
  try {
    // Fetch todo detail
    const response = await axios.get(`http://localhost:3000/api/todos/${todoId}`)
    todo.value = response.data
  } catch (err) {
    error.value = 'Todo tidak ditemukan atau Anda tidak memiliki akses'
    console.error('Error fetching todo:', err)
  } finally {
    loading.value = false
  }
})

const toggleStatus = async () => {
  if (!todo.value) return
  
  try {
    await todosStore.updateTodo(todo.value.id, {
      completed: !todo.value.completed
    })
    
    // Update local state
    todo.value.completed = !todo.value.completed
  } catch (error) {
    console.error('Error toggling todo status:', error)
  }
}

const deleteTodo = async () => {
  if (!todo.value) return
  
  if (confirm('Apakah Anda yakin ingin menghapus todo ini?')) {
    try {
      await todosStore.deleteTodo(todo.value.id)
      router.push('/todos')
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 