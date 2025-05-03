<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="dashboard-header">
        <h1 class="page-title">Price Analysis Dashboard</h1>
        <div class="dashboard-actions">
          <button class="btn btn-outline" @click="downloadReport">
            <i class="fas fa-download"></i> Download Report
          </button>
          <button class="btn" @click="refreshInsights">
            <i class="fas fa-sync-alt"></i> Refresh Analysis
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Generating insights...</p>
      </div>

      <div v-else-if="noData" class="no-data">
        <h2>No Data Available</h2>
        <p>Please upload price data first to view insights.</p>
        <router-link to="/upload" class="btn">Upload Data</router-link>
      </div>

      <div v-else class="dashboard-content">
        <!-- Overview Section -->
        <div class="card dashboard-overview">
          <h2>Price Analysis Overview</h2>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-value">{{ productCount }}</div>
              <div class="stat-label">Products</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ retailerCount }}</div>
              <div class="stat-label">Retailers</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ avgPriceDiff.toFixed(1) }}%</div>
              <div class="stat-label">Avg Price Difference</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ lowestPriceRetailer }}</div>
              <div class="stat-label">Most Competitive</div>
            </div>
          </div>
        </div>

        <!-- Price Comparison Chart -->
        <div class="card">
          <h2>Price Comparison Across Retailers</h2>
          <div class="chart-container">
            <canvas ref="retailerChart"></canvas>
          </div>
          <div class="insight-text" v-html="insights.priceComparison"></div>
        </div>

        <!-- Product Price Distribution -->
        <div class="card">
          <h2>Product Price Distribution</h2>
          <div class="chart-container">
            <canvas ref="productChart"></canvas>
          </div>
          <div class="insight-text" v-html="insights.productAnalysis"></div>
        </div>

        <!-- Market Trends -->
        <div class="card">
          <h2>Market Trends & Predictions</h2>
          <div class="chart-container">
            <canvas ref="trendChart"></canvas>
          </div>
          <div class="insight-text" v-html="insights.marketTrends"></div>
        </div>

        <!-- Strategic Recommendations -->
        <div class="card">
          <h2>Strategic Recommendations</h2>
          <div class="recommendations">
            <div class="recommendation-item" v-for="(rec, index) in recommendations" :key="index">
              <div class="recommendation-icon">💡</div>
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
  padding: 2rem 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
}

.dashboard-overview {
  margin-bottom: 2rem;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background-color: #f9fafc;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
}

.chart-container {
  height: 300px;
  margin: 1.5rem 0;
}

.insight-text {
  margin-top: 1.5rem;
  color: var(--text-color);
  line-height: 1.6;
}

.insight-text strong {
  color: var(--dark-color);
}

.recommendations {
  margin-top: 1.5rem;
}

.recommendation-item {
  display: flex;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.recommendation-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.recommendation-icon {
  font-size: 1.8rem;
  margin-right: 1.5rem;
}

.recommendation-content h3 {
  margin-bottom: 0.5rem;
  color: var(--dark-color);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(67, 97, 238, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-data {
  text-align: center;
  padding: 4rem 0;
}

.no-data h2 {
  margin-bottom: 1rem;
}

.no-data p {
  margin-bottom: 2rem;
  color: var(--text-light);
}
</style>