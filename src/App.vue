<template>
  <div class="app-container">
    <div class="header-wrapper">
      <the-header />
    </div>
    <div class="main-content">
      <div class="container content-container">
        <transition name="page" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
    <div class="footer-wrapper">
      <the-footer />
    </div>
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  --accent-color: #4cc9f0;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  --dark-color: #333;
  --light-color: #f4f4f8;
  --text-color: #333;
  --text-light: #717171;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--light-color);
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
  width: 100%;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header-wrapper, .footer-wrapper {
  width: 100%;
  position: relative;
  z-index: 10;
}

.main-content {
  flex: 1;
  width: 100%;
  position: relative;
}

.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
}

.card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Page Transition Animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>