<template>
    <footer class="footer">
      <div class="container footer-container">
        <p>&copy; {{ currentYear }} PriceInsightAI. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
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
    }
  }
  </script>
  
  <style scoped>
  .footer {
    margin-top: auto;
    background-color: white;
    border-top: 1px solid #eaeaea;
    padding: 1.5rem 0;
  }
  
  .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .footer-links a {
    color: var(--text-light);
    text-decoration: none;
    transition: var(--transition);
  }
  
  .footer-links a:hover {
    color: var(--primary-color);
  }
  </style>