<template>
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <router-link to="/">
            <h1>Intelligence corail<span>AI</span></h1>
          </router-link>
        </div>
        <nav class="nav">
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/upload">Upload Data</router-link></li>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/settings">Settings</router-link></li>
          </ul>
        </nav>
        <div class="auth">
          <template v-if="isLoggedIn">
            <button class="btn btn-outline" @click="logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline">Login</router-link>
            <router-link to="/register" class="btn">Register</router-link>
          </template>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'TheHeader',
    data() {
      return {
        isLoggedIn: false
      }
    },
    methods: {
      logout() {
        // Logout logic
        this.isLoggedIn = false;
        this.$router.push('/login');
      }
    },
    mounted() {
      // Check login status
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.isLoggedIn = true;
      }
    }
  }
  </script>
  
  <style scoped>
  .header {
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  .logo h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
  }
  
  .logo span {
    color: var(--primary-color);
  }
  
  .nav ul {
    display: flex;
    list-style: none;
  }
  
  .nav li {
    margin: 0 1rem;
  }
  
  .nav a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: var(--transition);
  }
  
  .nav a:hover, .nav a.router-link-active {
    color: var(--primary-color);
  }
  
  .auth {
    display: flex;
    gap: 0.5rem;
  }
  </style>