<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Register</h1>
        <p class="text-gray-600">Buat akun baru</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
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
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan email"
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
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan password (min. 6 karakter)"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Konfirmasi password"
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
          :disabled="loading || !isFormValid"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Loading...' : 'Register' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Sudah punya akun?
          <router-link to="/" class="text-blue-600 hover:text-blue-700 font-medium">
            Login di sini
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const message = ref(null)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return form.username && 
         form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         form.password.length >= 6
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    message.value = {
      success: false,
      text: 'Mohon lengkapi semua field dan pastikan password cocok'
    }
    return
  }

  loading.value = true
  message.value = null

  try {
    const result = await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password
    })
    
    message.value = {
      success: result.success,
      text: result.message
    }

    if (result.success) {
      // Reset form
      form.username = ''
      form.email = ''
      form.password = ''
      form.confirmPassword = ''
    }
  } catch (error) {
    message.value = {
      success: false,
      text: 'Terjadi kesalahan saat registrasi'
    }
  } finally {
    loading.value = false
  }
}
</script> 