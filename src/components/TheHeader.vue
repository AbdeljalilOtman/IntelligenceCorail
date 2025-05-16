<template>
  <header class="header">
    <div class="container header-container">
      <div class="logo">
        <router-link to="/">
          <h1>Intelligence corail<span>AI</span></h1>
        </router-link>
      </div>
      <nav class="nav" :class="{ 'nav-active': mobileMenuOpen }">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/upload">Upload Data</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/chat">Chat Analysis</router-link></li>
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
      <div class="mobile-toggle" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      isLoggedIn: false,
      mobileMenuOpen: false
    }
  },
  methods: {
    logout() {
      // Logout logic
      this.isLoggedIn = false;
      localStorage.removeItem('auth_token');
      this.$router.push('/login');
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
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
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  width: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark-color);
  letter-spacing: -0.5px;
  position: relative;
}

.logo span {
  color: var(--primary-color);
  font-weight: 800;
  position: relative;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav li {
  position: relative;
}

.nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  position: relative;
}

.nav a:hover {
  color: var(--primary-color);
}

.nav a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 3px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav a:hover::after,
.nav a.router-link-active::after {
  width: 100%;
}

.auth {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background: rgba(var(--primary-color-rgb), 0.1);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  cursor: pointer;
}

.mobile-toggle span {
  display: block;
  width: 28px;
  height: 3px;
  background-color: var(--dark-color);
  border-radius: 3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0.8rem 1rem;
  }
  
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .nav-active {
    height: auto;
    padding: 1rem 0;
  }
  
  .nav ul {
    flex-direction: column;
    gap: 0;
    padding: 0 2rem;
  }
  
  .nav li {
    margin: 0.8rem 0;
  }
  
  .mobile-toggle {
    display: flex;
  }
  
  .auth {
    display: none;
  }
}

@media (min-width: 769px) {
  .nav {
    display: block !important;
    height: auto !important;
  }
}
</style>