import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        this.isAuthenticated = true
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true, message: response.data.message }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login gagal' 
        }
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', userData)
        return { success: true, message: response.data.message }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registrasi gagal' 
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      delete axios.defaults.headers.common['Authorization']
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  }
}) 