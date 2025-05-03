<template>
  <div class="home">
    <section class="hero">
      <div class="container hero-container">
        <div class="hero-content">
          <h1>Transform Retail Price Data into Actionable Insights</h1>
          <p>Upload your price comparison data, connect to ChatGPT, and get AI-powered analysis, visualizations, and predictions.</p>
          <div class="hero-buttons">
            <router-link to="/upload" class="btn">Get Started</router-link>
            <router-link to="/about" class="btn btn-outline">Learn More</router-link>
          </div>
        </div>
        <div class="hero-image">
          <img src="../assets/hero-image.svg" alt="Data Analysis Illustration">
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Upload Price Data</h3>
            <p>Upload your PDF containing retail price data from different stores and products.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>Connect with AI</h3>
            <p>Use your ChatGPT API key to unlock powerful AI analysis capabilities.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Visualize Trends</h3>
            <p>Get beautiful charts and visualizations showing price trends and comparisons.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <h3>Generate Insights</h3>
            <p>Receive actionable insights and recommendations for pricing strategy.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.hero {
  padding: 3rem 0;
  background-color: #f9fafc;
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
}

.hero-content p {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

.features {
  padding: 4rem 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: var(--dark-color);
}

.feature-card p {
  color: var(--text-light);
}
</style>
