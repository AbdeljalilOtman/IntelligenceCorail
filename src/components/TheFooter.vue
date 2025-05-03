<template>
  <footer class="footer">
    <div class="footer-divider-top">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V92.83C219.45,95.85,261.61,75.41,321.39,56.44Z" fill="#f8f9fa"></path>
      </svg>
    </div>
    <div class="container footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <h2>Intelligence corail<span>AI</span></h2>
          <p>Advanced analytics for intelligent decisions</p>
        </div>
        <div class="footer-nav">
          <button class="nav-button" @click="navigateTo('home')">
            <i class="fas fa-home"></i> Home
          </button>
          <button class="nav-button" @click="navigateTo('upload')">
            <i class="fas fa-upload"></i> Upload
          </button>
          <button class="nav-button" @click="navigateTo('dashboard')">
            <i class="fas fa-chart-bar"></i> Dashboard
          </button>
          <button class="nav-button" @click="navigateTo('settings')">
            <i class="fas fa-cog"></i> Settings
          </button>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-content">
        <p class="copyright">&copy; {{ currentYear }} Intelligence corailAI. All rights reserved.</p>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="social-link" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="#" class="social-link" aria-label="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="#" class="social-link" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
        </div>
        <div class="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
  </footer>
</template>
  
<script>
export default {
  name: 'TheFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    navigateTo(routeName) {
      // Only navigate if we're not already on that route
      if (this.$router.currentRoute.value.name !== routeName) {
        this.$router.push({ name: routeName });
      }
    }
  }
}
</script>
  
<style scoped>
.footer {
  position: relative;
  margin-top: auto;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  padding: 2rem 0 1rem;
  color: var(--text-color);
  width: 100%;
}

.footer-divider-top {
  position: absolute;
  top: -60px;
  left: 0;
  width: 100%;
  height: 60px;
  line-height: 0;
  overflow: hidden;
}

.footer-divider-top svg {
  position: relative;
  display: block;
  width: calc(120% + 1.3px);
  height: 100%;
  transform: rotateY(180deg);
}

.footer-divider-top path {
  fill-opacity: 0.9;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-brand {
  flex: 1;
  min-width: 250px;
}

.footer-brand h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: var(--dark-color);
}

.footer-brand span {
  color: var(--primary-color);
  font-weight: 800;
}

.footer-brand p {
  color: var(--text-light);
  font-size: 0.9rem;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}

.nav-button {
  background-color: transparent;
  border: none;
  color: var(--text-color);
  padding: 0.4rem 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.nav-button:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-button:active {
  transform: translateY(0);
}

.footer-divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent);
  margin: 0.3rem 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: var(--text-light);
  font-size: 0.85rem;
}

.social-links {
  display: flex;
  gap: 0.8rem;
}

.social-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--dark-color);
  background-color: #f0f0f0;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.footer-links {
  display: flex;
  gap: 1.2rem;
}
  
.footer-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  position: relative;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}
  
.footer-links a:hover {
  color: var(--primary-color);
}

.footer-links a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-nav {
    padding-bottom: 0.5rem;
  }

  .footer-divider-top {
    top: -40px;
    height: 40px;
  }

  .nav-button {
    font-size: 0.85rem;
  }
}
</style>