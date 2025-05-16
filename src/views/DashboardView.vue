<template>
  <div class="dashboard-page">
    <div class="dashboard-bg-shape"></div>
    <div class="container">
      <div class="dashboard-header" data-aos="fade-down">
        <h1 class="page-title">Price Analysis Dashboard</h1>
        <div class="dashboard-actions">
          <router-link to="/chat" class="btn btn-primary chat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Ask Custom Questions
          </router-link>
          <button class="btn btn-outline" @click="downloadReport">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 
            Download Report
          </button>
          <button class="btn btn-outline" @click="refreshInsights">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> 
            Refresh Analysis
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-container" data-aos="fade-up">
        <div class="loading-spinner"></div>
        <p>Generating insights...</p>
      </div>

      <div v-else-if="noData" class="no-data" data-aos="fade-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h2>No Data Available</h2>
        <p>Please upload price data first to view insights.</p>
        <router-link to="/upload" class="btn btn-primary">Upload Data</router-link>
      </div>

      <div v-else class="dashboard-content">
        <!-- Overview Section -->
        <div class="card dashboard-overview" data-aos="fade-up" data-aos-delay="100">
          <h2>Price Analysis Overview</h2>
          <div class="overview-stats">
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="150">
              <div class="stat-value">{{ productCount }}</div>
              <div class="stat-label">Products</div>
            </div>
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="200">
              <div class="stat-value">{{ retailerCount }}</div>
              <div class="stat-label">Retailers</div>
            </div>
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="250">
              <div class="stat-value">{{ avgPriceDiff.toFixed(1) }}%</div>
              <div class="stat-label">Avg Price Difference</div>
            </div>
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="300">
              <div class="stat-value">{{ lowestPriceRetailer }}</div>
              <div class="stat-label">Most Competitive</div>
            </div>
          </div>
        </div>

        <!-- Price Comparison Chart -->
        <div class="card" data-aos="fade-up" data-aos-delay="150">
          <h2>Price Comparison Across Retailers</h2>
          <div class="chart-container">
            <canvas ref="retailerChart"></canvas>
          </div>
          <div class="insight-text" v-html="insights.priceComparison"></div>
        </div>

        <!-- Product Price Distribution -->
        <div class="card" data-aos="fade-up" data-aos-delay="200">
          <h2>Product Price Distribution</h2>
          <div class="chart-container">
            <canvas ref="productChart"></canvas>
          </div>
          <div class="insight-text" v-html="insights.productAnalysis"></div>
        </div>

        <!-- Market Trends -->
        <div class="card" data-aos="fade-up" data-aos-delay="250">
          <h2>Market Trends & Predictions</h2>
          <div class="chart-container">
            <canvas ref="trendChart"></canvas>
          </div>
          <div class="insight-text" v-html="insights.marketTrends"></div>
        </div>

        <!-- Strategic Recommendations -->
        <div class="card" data-aos="fade-up" data-aos-delay="300">
          <h2>Strategic Recommendations</h2>
          <div class="recommendations">
            <div class="recommendation-item" v-for="(rec, index) in recommendations" :key="index" 
                data-aos="fade-right" :data-aos-delay="350 + (index * 50)">
              <div class="recommendation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              </div>
              <div class="recommendation-content">
                <h3>{{ rec.title }}</h3>
                <p>{{ rec.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'DashboardView',
  data() {
    return {
      loading: false,
      noData: false,
      insights: {
        priceComparison: '',
        productAnalysis: '',
        marketTrends: ''
      },
      recommendations: [],
      productCount: 0,
      retailerCount: 0,
      avgPriceDiff: 0,
      lowestPriceRetailer: '',
      charts: {
        retailerChart: null,
        productChart: null,
        trendChart: null
      }
    }
  },
  mounted() {
    this.loadInsights();
  },
  methods: {
    loadInsights() {
      // Check if insights are available in sessionStorage
      const storedInsights = sessionStorage.getItem('insights');
      
      if (!storedInsights) {
        this.noData = true;
        return;
      }
      
      try {
        const data = JSON.parse(storedInsights);
        this.processInsights(data);
        this.noData = false;
        
        // Initialize charts after data is processed
        this.$nextTick(() => {
          this.initCharts(data);
        });
      } catch (error) {
        console.error('Error loading insights:', error);
        this.noData = true;
      }
    },
    processInsights(data) {
      // Extract insights from data
      this.insights = {
        priceComparison: data.priceComparison || 'No price comparison insights available.',
        productAnalysis: data.productAnalysis || 'No product analysis available.',
        marketTrends: data.marketTrends || 'No market trend data available.'
      };
      
      // Extract recommendations
      this.recommendations = data.recommendations || [];
      
      // Extract stats
      this.productCount = data.stats?.productCount || 0;
      this.retailerCount = data.stats?.retailerCount || 0;
      this.avgPriceDiff = data.stats?.avgPriceDiff || 0;
      this.lowestPriceRetailer = data.stats?.lowestPriceRetailer || 'N/A';
    },
    initCharts(data) {
      // Initialize retailer comparison chart
      if (this.$refs.retailerChart && data.charts?.retailerData) {
        this.initRetailerChart(data.charts.retailerData);
      }
      
      // Initialize product price chart
      if (this.$refs.productChart && data.charts?.productData) {
        this.initProductChart(data.charts.productData);
      }
      
      // Initialize trend chart
      if (this.$refs.trendChart && data.charts?.trendData) {
        this.initTrendChart(data.charts.trendData);
      }
    },
    initRetailerChart(data) {
      const ctx = this.$refs.retailerChart.getContext('2d');
      
      this.charts.retailerChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Average Price (€)',
            data: data.prices,
            backgroundColor: 'rgba(67, 97, 238, 0.7)',
            borderColor: 'rgba(67, 97, 238, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    },
    initProductChart(data) {
      const ctx = this.$refs.productChart.getContext('2d');
      
      this.charts.productChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: data.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: this.getColor(index, 0.7),
            borderColor: this.getColor(index, 1),
            pointRadius: 5,
            pointHoverRadius: 7
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Average Price (€)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price Difference (%)'
              }
            }
          }
        }
      });
    },
    initTrendChart(data) {
      const ctx = this.$refs.trendChart.getContext('2d');
      
      this.charts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: data.datasets.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: this.getColor(index, 0.1),
            borderColor: this.getColor(index, 1),
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Projected Price (€)'
              }
            }
          }
        }
      });
    },
    getColor(index, alpha) {
      const colors = [
        `rgba(67, 97, 238, ${alpha})`,
        `rgba(76, 201, 240, ${alpha})`,
        `rgba(63, 55, 201, ${alpha})`,
        `rgba(114, 9, 183, ${alpha})`,
        `rgba(247, 37, 133, ${alpha})`,
        `rgba(76, 175, 80, ${alpha})`,
        `rgba(255, 152, 0, ${alpha})`,
        `rgba(233, 30, 99, ${alpha})`
      ];
      
      return colors[index % colors.length];
    },
    refreshInsights() {
      this.loading = true;
      
      // In a real application, this would call the backend to regenerate insights
      setTimeout(() => {
        this.loadInsights();
        this.loading = false;
      }, 2000);
    },
    downloadReport() {
      // In a real application, this would generate and download a PDF report
      alert('Report download feature would be implemented here.');
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  padding: 3rem 0;
  position: relative;
  background-color: #f9fafc;
  min-height: calc(100vh - 160px); /* Account for header and footer */
  overflow-x: hidden;
}

.dashboard-bg-shape {
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #2c3e50, #4ca1af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
}

.page-title:after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  margin-top: 0.5rem;
  border-radius: 2px;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
}

.chat-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  margin-right: auto; /* Pushes other buttons to the right */
}

.chat-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.btn svg {
  transition: transform 0.3s ease;
}

.btn:hover svg {
  transform: translateY(-1px);
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
  background: transparent;
}

.btn-outline:hover {
  background-color: rgba(76, 161, 175, 0.1);
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
}

.card h2:after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  margin-top: 0.5rem;
  border-radius: 2px;
}

.dashboard-overview {
  margin-bottom: 2.5rem;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background-color: #f9fafc;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.stat-item:before {
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

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-item:hover:before {
  height: 100%;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #2c3e50, #4ca1af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.stat-label {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.chart-container {
  height: 350px;
  margin: 2rem 0;
  position: relative;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fcfdff;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.insight-text {
  margin-top: 1.5rem;
  color: #555;
  line-height: 1.8;
  padding: 0.5rem 1rem;
  border-left: 4px solid #4ca1af;
  background-color: rgba(76, 161, 175, 0.05);
  border-radius: 0 8px 8px 0;
}

.insight-text strong {
  color: #2c3e50;
  font-weight: 600;
}

.recommendations {
  margin-top: 1.5rem;
}

.recommendation-item {
  display: flex;
  margin-bottom: 1.8rem;
  padding-bottom: 1.8rem;
  border-bottom: 1px solid #eee;
  transition: all 0.3s ease;
}

.recommendation-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.recommendation-item:hover {
  transform: translateX(5px);
}

.recommendation-icon {
  margin-right: 1.5rem;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
}

.recommendation-content h3 {
  margin-bottom: 0.8rem;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
}

.recommendation-content p {
  color: #555;
  line-height: 1.6;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(76, 161, 175, 0.1);
  border-radius: 50%;
  border-top-color: #4ca1af;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  font-size: 1.2rem;
  color: #555;
}

.no-data {
  text-align: center;
  padding: 6rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-data svg {
  color: #4ca1af;
  margin-bottom: 1.5rem;
}

.no-data h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.no-data p {
  margin-bottom: 2rem;
  color: #666;
  font-size: 1.1rem;
  max-width: 500px;
}

@media (max-width: 992px) {
  .dashboard-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .page-title:after {
    margin-left: auto;
    margin-right: auto;
  }
  
  .card h2 {
    text-align: center;
  }
  
  .card h2:after {
    margin-left: auto;
    margin-right: auto;
  }
  
  .stat-value {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .card {
    padding: 1.5rem;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .stat-item {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .dashboard-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .recommendation-item {
    flex-direction: column;
  }
  
  .recommendation-icon {
    margin-bottom: 1rem;
    margin-right: 0;
  }
}
</style>