<template>
  <div class="home">
    <section class="hero">
      <div class="hero-bg-shape"></div>
      <div class="container hero-container">
        <div class="hero-content" data-aos="fade-right">
          <h1>Transform Retail Price Data into Actionable Insights</h1>
          <p>Upload your price comparison data, connect to ChatGPT, and get AI-powered analysis, visualizations, and predictions.</p>
          <div class="hero-buttons">
            <router-link to="/upload" class="btn btn-primary">Get Started</router-link>
            <router-link to="/about" class="btn btn-outline">Learn More</router-link>
          </div>
        </div>
        <div class="hero-image" data-aos="fade-left">
          <img src="../assets/hero-image.svg" alt="Data Analysis Illustration">
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">How It Works</h2>
        <div class="features-grid">
          <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h3>Upload Price Data</h3>
            <p>Upload your PDF containing retail price data from different stores and products.</p>
          </div>
          <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9" y2="9"></line><line x1="15" y1="9" x2="15" y2="9"></line></svg>
            </div>
            <h3>Connect with AI</h3>
            <p>Use your ChatGPT API key to unlock powerful AI analysis capabilities.</p>
          </div>
          <div class="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
            </div>
            <h3>Visualize Trends</h3>
            <p>Get beautiful charts and visualizations showing price trends and comparisons.</p>
          </div>
          <div class="feature-card" data-aos="fade-up" data-aos-delay="400">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h3>Generate Insights</h3>
            <p>Receive actionable insights and recommendations for pricing strategy.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">What Our Users Say</h2>
        <div class="testimonial-grid">
          <div class="testimonial-card" data-aos="fade-up" data-aos-delay="100">
            <div class="testimonial-content">
              <p>"This tool has revolutionized how we analyze pricing data. We saved 15 hours a week on market analysis."</p>
            </div>
            <div class="testimonial-author">
              <div class="testimonial-avatar"></div>
              <div class="testimonial-info">
                <h4>Sarah Johnson</h4>
                <p>Retail Analytics Manager</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card" data-aos="fade-up" data-aos-delay="200">
            <div class="testimonial-content">
              <p>"The AI-powered insights have given us a competitive edge. We've increased margins by 12% in three months."</p>
            </div>
            <div class="testimonial-author">
              <div class="testimonial-avatar"></div>
              <div class="testimonial-info">
                <h4>Michael Chen</h4>
                <p>E-commerce Director</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card" data-aos="fade-up" data-aos-delay="300">
            <div class="testimonial-content">
              <p>"The visualizations make it easy to spot pricing trends that we would have otherwise missed."</p>
            </div>
            <div class="testimonial-author">
              <div class="testimonial-avatar"></div>
              <div class="testimonial-info">
                <h4>Emma Rodriguez</h4>
                <p>Data Analyst</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sample-data-section" v-if="showTestingTools">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">For Testing & Development</h2>
        <p class="section-description">Quickly load sample data to test the application features without uploading files.</p>
        <sample-data-loader />
      </div>
    </section>
  </div>
</template>

<script>
import SampleDataLoader from '@/components/SampleDataLoader.vue';

export default {
  name: 'HomeView',
  components: {
    SampleDataLoader
  },
  data() {
    return {
      showTestingTools: process.env.NODE_ENV === 'development'
    }
  },
  mounted() {
    // If you want to use AOS library for animations
    // Make sure to install it: npm install aos
    // And import it in main.js
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true
      });
    }
  }
}
</script>

<style scoped>
.hero {
  padding: 5rem 0;
  background-color: #f9fafc;
  position: relative;
  overflow: hidden;
}

.hero-bg-shape {
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  z-index: 0;
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 4rem;
  position: relative;
  z-index: 1;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  line-height: 1.2;
  background: linear-gradient(to right, #2c3e50, #4ca1af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-content p {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 161, 175, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(76, 161, 175, 0.4);
  transform: translateY(-1px);
}

.btn-outline {
  border: 2px solid #4ca1af;
  color: #4ca1af;
}

.btn-outline:hover {
  background-color: rgba(76, 161, 175, 0.1);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  transition: all 0.5s ease;
}

.hero-image:hover img {
  transform: translateY(-5px);
}

.features {
  padding: 6rem 0;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: #2c3e50;
  font-weight: 700;
  position: relative;
}

.section-title:after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.feature-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(135deg, rgba(76, 161, 175, 0.05), rgba(44, 62, 80, 0.05));
  transition: height 0.5s ease;
  z-index: 0;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.feature-card:hover:before {
  height: 100%;
}

.feature-icon {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  color: #4ca1af;
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.5rem;
  position: relative;
  z-index: 1;
}

.feature-card p {
  color: var(--text-light);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.testimonials {
  padding: 6rem 0;
  background-color: #f9fafc;
  position: relative;
  overflow: hidden;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.testimonial-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.testimonial-content p {
  font-style: italic;
  color: #555;
  line-height: 1.6;
  font-size: 1rem;
  position: relative;
}

.testimonial-content p:before {
  content: "\201C"; /* Unicode for opening double quote */
  font-size: 4rem;
  position: absolute;
  left: -10px;
  top: -20px;
  color: rgba(76, 161, 175, 0.1);
  z-index: 0;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.testimonial-info h4 {
  font-size: 1.1rem;
  margin: 0;
  color: #2c3e50;
}

.testimonial-info p {
  font-size: 0.9rem;
  margin: 0;
  color: #666;
}

.sample-data-section {
  padding: 4rem 0;
  background-color: #f9fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.section-description {
  text-align: center;
  color: #666;
  max-width: 600px;
  margin: 0 auto 2rem;
}

@media (max-width: 992px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }
  
  .hero-container {
    flex-direction: column-reverse;
    gap: 2rem;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-image {
    margin-bottom: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
  
  .features, .testimonials {
    padding: 4rem 0;
  }
}

@media (max-width: 576px) {
  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
  
  .testimonial-grid {
    grid-template-columns: 1fr;
  }
}
</style>
