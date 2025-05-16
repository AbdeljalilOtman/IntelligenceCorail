import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import DashboardView from '../views/DashboardView.vue'
import SettingsView from '../views/SettingsView.vue'
import ChatView from '../views/ChatView.vue'
// import LoginView from '../views/LoginView.vue'
// import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: LoginView
  // },
  // {
  //   path: '/register',
  //   name: 'register',
  //   component: RegisterView
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router