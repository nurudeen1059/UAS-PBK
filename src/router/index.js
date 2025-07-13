import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/todos',
    name: 'Todos',
    component: () => import('../views/Todos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/todos/add',
    name: 'AddTodo',
    component: () => import('../views/AddTodo.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/todos/:id/edit',
    name: 'EditTodo',
    component: () => import('../views/EditTodo.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/todos/:id',
    name: 'TodoDetail',
    component: () => import('../views/TodoDetail.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state
  authStore.initializeAuth()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/')
  } else if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next('/todos')
  } else {
    next()
  }
})

export default router 