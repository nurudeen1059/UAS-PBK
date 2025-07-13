<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">ToDo List</h1>
            <p class="text-gray-600">Selamat datang, {{ authStore.getUser?.username }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/todos/add"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Tambah Todo
            </router-link>
            <button
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter Tabs -->
      <div class="mb-6">
        <div class="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="setFilter(filter.value)"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              todosStore.filter === filter.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
            <span class="ml-1 text-xs">
              ({{ getFilterCount(filter.value) }})
            </span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="todosStore.error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ todosStore.error }}
      </div>

      <!-- Loading State -->
      <div v-if="todosStore.loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Todo List -->
      <div v-else-if="todosStore.filteredTodos.length > 0" class="space-y-4">
        <div
          v-for="todo in todosStore.filteredTodos"
          :key="todo.id"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo.id)"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div class="flex-1">
                <h3 
                  :class="[
                    'text-lg font-medium',
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  ]"
                >
                  {{ todo.title }}
                </h3>
                <p 
                  :class="[
                    'text-gray-600 mt-1',
                    todo.completed ? 'line-through' : ''
                  ]"
                >
                  {{ todo.description }}
                </p>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Dibuat: {{ formatDate(todo.createdAt) }}</span>
                  <span v-if="todo.updatedAt !== todo.createdAt">
                    Diperbarui: {{ formatDate(todo.updatedAt) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <router-link
                :to="`/todos/${todo.id}`"
                class="text-blue-600 hover:text-blue-700 px-2 py-1 rounded text-sm"
              >
                Detail
              </router-link>
              <router-link
                :to="`/todos/${todo.id}/edit`"
                class="text-green-600 hover:text-green-700 px-2 py-1 rounded text-sm"
              >
                Edit
              </router-link>
              <button
                @click="deleteTodo(todo.id)"
                class="text-red-600 hover:text-red-700 px-2 py-1 rounded text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ getEmptyStateMessage() }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ getEmptyStateDescription() }}
        </p>
        <router-link
          to="/todos/add"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Tambah Todo Pertama
        </router-link>
      </div>

      <!-- Clear Completed Button -->
      <div v-if="todosStore.completedTodosCount > 0" class="mt-6 text-center">
        <button
          @click="clearCompleted"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Hapus yang Selesai ({{ todosStore.completedTodosCount }})
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTodosStore } from '../stores/todos'

const router = useRouter()
const authStore = useAuthStore()
const todosStore = useTodosStore()

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Selesai', value: 'completed' }
]

onMounted(() => {
  todosStore.fetchTodos()
})

const setFilter = (filter) => {
  todosStore.setFilter(filter)
}

const getFilterCount = (filterValue) => {
  switch (filterValue) {
    case 'active':
      return todosStore.activeTodosCount
    case 'completed':
      return todosStore.completedTodosCount
    default:
      return todosStore.todosCount
  }
}

const toggleTodo = async (id) => {
  await todosStore.toggleTodo(id)
}

const deleteTodo = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus todo ini?')) {
    await todosStore.deleteTodo(id)
  }
}

const clearCompleted = async () => {
  if (confirm('Apakah Anda yakin ingin menghapus semua todo yang selesai?')) {
    todosStore.clearCompleted()
  }
}

const handleLogout = () => {
  // Verifikasi pertama
  const firstConfirm = confirm('Apakah Anda yakin ingin keluar dari aplikasi?')
  
  if (firstConfirm) {
    // Verifikasi kedua
    const secondConfirm = confirm('Anda akan keluar dari aplikasi. Lanjutkan?')
    
    if (secondConfirm) {
      authStore.logout()
      router.push('/')
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEmptyStateMessage = () => {
  switch (todosStore.filter) {
    case 'active':
      return 'Tidak ada todo aktif'
    case 'completed':
      return 'Tidak ada todo selesai'
    default:
      return 'Belum ada todo'
  }
}

const getEmptyStateDescription = () => {
  switch (todosStore.filter) {
    case 'active':
      return 'Semua todo Anda sudah selesai!'
    case 'completed':
      return 'Belum ada todo yang selesai'
    default:
      return 'Mulai dengan menambahkan todo pertama Anda'
  }
}
</script> 