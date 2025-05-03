<template>
    <div class="settings-page">
      <div class="container">
        <h1 class="page-title">Settings</h1>
        
        <div class="settings-container">
          <div class="card api-settings">
            <h2>API Settings</h2>
            <div class="form-group">
              <label for="apiKey">ChatGPT API Key</label>
              <div class="api-input">
                <input 
                  :type="showApiKey ? 'text' : 'password'" 
                  id="apiKey" 
                  v-model="apiKey" 
                  placeholder="sk-..."
                  class="form-control"
                >
                <button class="btn-icon" @click="showApiKey = !showApiKey">
                  <i :class="showApiKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <small>Your API key is securely stored in your browser and never sent to our servers.</small>
            </div>
            
            <div class="form-group">
              <label for="apiModel">ChatGPT Model</label>
              <select id="apiModel" v-model="apiModel" class="form-control">
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            
            <button class="btn" @click="saveApiSettings">Save API Settings</button>
          </div>
          
          <div class="card">
            <h2>Analysis Settings</h2>
            
            <div class="form-group">
              <label>Default Analysis Options</label>
              <div class="checkbox-group">
                <label>
                  <input type="checkbox" v-model="analysisOptions.priceComparison">
                  Price Comparison
                </label>
                <label>
                  <input type="checkbox" v-model="analysisOptions.marketTrends">
                  Market Trends
                </label>
                <label>
                  <input type="checkbox" v-model="analysisOptions.predictions">
                  Future Predictions
                </label>
                <label>
                  <input type="checkbox" v-model="analysisOptions.recommendations">
                  Strategic Recommendations
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label for="chartType">Default Chart Type</label>
              <select id="chartType" v-model="chartType" class="form-control">
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="radar">Radar Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>
            
            <button class="btn" @click="saveAnalysisSettings">Save Analysis Settings</button>
          </div>
          
          <div class="card">
            <h2>Account Settings</h2>
            
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" v-model="username" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" class="form-control">
            </div>
            
            <button class="btn" @click="saveAccountSettings">Save Account Settings</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SettingsView',
    data() {
      return {
        apiKey: '',
        showApiKey: false,
        apiModel: 'gpt-4',
        analysisOptions: {
          priceComparison: true,
          marketTrends: true,
          predictions: false,
          recommendations: true
        },
        chartType: 'bar',
        username: 'User',
        email: 'user@example.com'
      }
    },
    mounted() {
      // Load settings from localStorage
      this.loadSettings();
    },
    methods: {
      loadSettings() {
        // In a real app, this would load from localStorage or server
        const savedApiKey = localStorage.getItem('apiKey');
        if (savedApiKey) {
          this.apiKey = savedApiKey;
        }
        
        const savedApiModel = localStorage.getItem('apiModel');
        if (savedApiModel) {
          this.apiModel = savedApiModel;
        }
        
        const savedAnalysisOptions = localStorage.getItem('analysisOptions');
        if (savedAnalysisOptions) {
          this.analysisOptions = JSON.parse(savedAnalysisOptions);
        }
        
        const savedChartType = localStorage.getItem('chartType');
        if (savedChartType) {
          this.chartType = savedChartType;
        }
      },
      saveApiSettings() {
        // Save API settings to localStorage
        localStorage.setItem('apiKey', this.apiKey);
        localStorage.setItem('apiModel', this.apiModel);
        
        this.$toast.success('API settings saved successfully!');
      },
      saveAnalysisSettings() {
        // Save analysis settings to localStorage
        localStorage.setItem('analysisOptions', JSON.stringify(this.analysisOptions));
        localStorage.setItem('chartType', this.chartType);
        
        this.$toast.success('Analysis settings saved successfully!');
      },
      saveAccountSettings() {
        // In a real app, this would update the user's account information
        this.$toast.success('Account settings saved successfully!');
      }
    }
  }
  </script>
  
  <style scoped>
  .settings-page {
    padding: 2rem 0;
  }
  
  .settings-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .settings-container .card {
    margin-bottom: 2rem;
  }
  
  .settings-container h2 {
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: 1rem;
  }
  
  .form-group small {
    display: block;
    color: var(--text-light);
    margin-top: 0.25rem;
    font-size: 0.85rem;
  }
  
  .api-input {
    display: flex;
    align-items: center;
  }
  
  .api-input .form-control {
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  .btn-icon {
    padding: 0.75rem;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-left: none;
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    cursor: pointer;
  }
  
  .checkbox-group {
    margin-top: 0.5rem;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    font-weight: normal;
    margin-bottom: 0.75rem;
  }
  
  .checkbox-group input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  </style>