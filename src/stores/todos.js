import { defineStore } from 'pinia'
import axios from 'axios'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [],
    loading: false,
    error: null,
    filter: 'all' // 'all', 'active', 'completed'
  }),

  getters: {
    filteredTodos: (state) => {
      switch (state.filter) {
        case 'active':
          return state.todos.filter(todo => !todo.completed)
        case 'completed':
          return state.todos.filter(todo => todo.completed)
        default:
          return state.todos
      }
    },
    
    todosCount: (state) => state.todos.length,
    activeTodosCount: (state) => state.todos.filter(todo => !todo.completed).length,
    completedTodosCount: (state) => state.todos.filter(todo => todo.completed).length
  },

  actions: {
    async fetchTodos() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('http://localhost:3000/api/todos')
        this.todos = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal mengambil todos'
        console.error('Error fetching todos:', error)
      } finally {
        this.loading = false
      }
    },

    async addTodo(todoData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:3000/api/todos', todoData)
        this.todos.push(response.data)
        return { success: true, message: 'Todo berhasil ditambahkan' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menambahkan todo'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateTodo(id, todoData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put(`http://localhost:3000/api/todos/${id}`, todoData)
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
          this.todos[index] = response.data
        }
        return { success: true, message: 'Todo berhasil diperbarui' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal memperbarui todo'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteTodo(id) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`http://localhost:3000/api/todos/${id}`)
        this.todos = this.todos.filter(todo => todo.id !== id)
        return { success: true, message: 'Todo berhasil dihapus' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menghapus todo'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        await this.updateTodo(id, { completed: !todo.completed })
      }
    },

    setFilter(filter) {
      this.filter = filter
    },

    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}) 