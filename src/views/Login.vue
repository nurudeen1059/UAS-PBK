<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Login</h1>
        <p class="text-gray-600">Masuk ke akun Anda</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan password"
          />
        </div>

        <div v-if="message" :class="[
          'p-3 rounded-md text-sm',
          message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        ]">
          {{ message.text }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Belum punya akun?
          <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
            Daftar di sini
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const message = ref(null)

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  message.value = null

  try {
    const result = await authStore.login(form)
    message.value = {
      success: result.success,
      text: result.message
    }

    if (result.success) {
      // Tambah delay 1 detik untuk animasi loading
      setTimeout(() => {
        router.push('/todos')
      }, 1000)
    }
  } catch (error) {
    message.value = {
      success: false,
      text: 'Terjadi kesalahan saat login'
    }
  } finally {
    loading.value = false
  }
}
</script> 