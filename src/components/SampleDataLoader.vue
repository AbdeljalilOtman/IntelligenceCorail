<template>
  <div class="sample-data-loader">
    <button class="btn btn-primary" @click="loadSampleData">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
      Load Sample Data
    </button>
    <div v-if="loading" class="sample-data-loading">
      <div class="spinner"></div>
      <span>Loading sample data...</span>
    </div>
    <div v-if="success" class="sample-data-success">
      Data loaded successfully! You can now use the Chat or Dashboard.
    </div>
    <div v-if="error" class="sample-data-error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import sampleData from '../../sample-data.json';

export default {
  name: 'SampleDataLoader',
  data() {
    return {
      loading: false,
      success: false,
      error: null
    }
  },
  methods: {
    async loadSampleData() {
      this.loading = true;
      this.success = false;
      this.error = null;
      
      try {
        // Store insights and raw data in sessionStorage
        const insights = {
          rawData: sampleData,
          stats: {
            productCount: 5,
            retailerCount: 3,
            avgPriceDiff: 5.3,
            lowestPriceRetailer: "LECLERC"
          },
          priceComparison: "Sample price comparison insights for testing.",
          productAnalysis: "Sample product analysis for testing.",
          marketTrends: "Sample market trends for testing.",
          recommendations: [
            {
              title: "1. Focus on Competitive Pricing",
              description: "LECLERC consistently offers lower prices across categories. Consider adjusting pricing strategies to remain competitive."
            },
            {
              title: "2. Optimize Dairy Category Margins",
              description: "Dairy products show significant price variations. Consider optimizing pricing in this category."
            },
            {
              title: "3. Promote Value in Snack Items",
              description: "Snack items have the highest price differences. Highlighting value options could attract price-sensitive customers."
            }
          ]
        };
        
        sessionStorage.setItem('insights', JSON.stringify(insights));
        sessionStorage.setItem('rawData', JSON.stringify(sampleData));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        this.success = true;
      } catch (error) {
        console.error('Error loading sample data:', error);
        this.error = 'Failed to load sample data. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.sample-data-loader {
  padding: 1.5rem;
  background: linear-gradient(to right, rgba(76, 161, 175, 0.1), rgba(44, 62, 80, 0.1));
  border-radius: 12px;
  text-align: center;
  margin: 2rem auto;
  max-width: 500px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
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

.sample-data-loading, .sample-data-success, .sample-data-error {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
}

.sample-data-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(76, 161, 175, 0.3);
  border-top-color: #4ca1af;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sample-data-success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.sample-data-error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}
</style>
