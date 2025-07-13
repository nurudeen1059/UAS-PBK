<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tambah Todo</h1>
            <p class="text-gray-600">Buat todo baru</p>
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
      <div class="bg-white rounded-lg shadow-sm border p-6">
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
              :disabled="loading || !form.title"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan Todo' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTodosStore } from '../stores/todos'

const router = useRouter()
const todosStore = useTodosStore()
const loading = ref(false)
const message = ref(null)

const form = reactive({
  title: '',
  description: ''
})

const handleSubmit = async () => {
  if (!form.title.trim()) {
    message.value = {
      success: false,
      text: 'Judul todo harus diisi'
    }
    return
  }

  loading.value = true
  message.value = null

  try {
    const result = await todosStore.addTodo({
      title: form.title.trim(),
      description: form.description.trim()
    })

    message.value = {
      success: result.success,
      text: result.message
    }

    if (result.success) {
      // Reset form
      form.title = ''
      form.description = ''
      
      // Redirect to todos list after a short delay
      setTimeout(() => {
        router.push('/todos')
      }, 1000)
    }
  } catch (error) {
    message.value = {
      success: false,
      text: 'Terjadi kesalahan saat menyimpan todo'
    }
  } finally {
    loading.value = false
  }
}
</script> 