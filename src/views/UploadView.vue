<template>
  <div class="upload-page">
    <div class="container">
      <h1 class="page-title">Upload Price Data</h1>

      <div class="upload-container">
        <div class="steps">
          <div class="step" :class="{ 'active': step >= 1 }">
            <div class="step-number">1</div>
            <div class="step-text">Upload PDF</div>
          </div>
          <div class="step-connector"></div>
          <div class="step" :class="{ 'active': step >= 2 }">
            <div class="step-number">2</div>
            <div class="step-text">Verify Data</div>
          </div>
          <div class="step-connector"></div>
          <div class="step" :class="{ 'active': step >= 3 }">
            <div class="step-number">3</div>
            <div class="step-text">Generate Insights</div>
          </div>
        </div>

        <div class="card">
          <!-- Step 1: Upload File -->
          <div v-if="step === 1" class="upload-step">
            <h2>Upload Your Price Data PDF</h2>
            <p>Please upload a PDF file containing price data in the required format.</p>
            
            <div 
              class="dropzone" 
              :class="{ 'dropzone-active': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect" 
                accept="application/pdf" 
                style="display: none"
              >
              <div class="dropzone-content">
                <div class="upload-icon">📄</div>
                <p>Drag and drop your PDF file here</p>
                <p>or</p>
                <button class="btn" @click="$refs.fileInput.click()">Browse Files</button>
              </div>
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="format-info">
              <h3>Expected Format:</h3>
              <p>Your PDF should contain price data in the following format:</p>
              <code>
                Rayon Produit gencode Enseigne Nb de prix Prix moyen € Écart de prix %
              </code>
              <p>For example:</p>
              <code>
                EPICERIE HENAFF Paté Porc Boite 78g x1 0000030000117 AUCHAN 37 1.28 4.1%
              </code>
            </div>
          </div>

          <!-- Step 2: Verify Data -->
          <div v-if="step === 2" class="verify-step">
            <h2>Verify Extracted Data</h2>
            <p>Please review the extracted data before proceeding with analysis.</p>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Product</th>
                    <th>Barcode</th>
                    <th>Store</th>
                    <th>Price Count</th>
                    <th>Avg Price (€)</th>
                    <th>Price Diff (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in extractedData" :key="index">
                    <td>{{ item.category }}</td>
                    <td>{{ item.product }}</td>
                    <td>{{ item.barcode }}</td>
                    <td>{{ item.retailer }}</td>
                    <td>{{ item.priceCount }}</td>
                    <td>{{ item.averagePrice.toFixed(2) }}</td>
                    <td>{{ item.priceDifference }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="actions">
              <button class="btn btn-outline" @click="step = 1">Back</button>
              <button class="btn" @click="step = 3">Confirm and Continue</button>
            </div>
          </div>

          <!-- Step 3: ChatGPT API Key -->
          <div v-if="step === 3" class="api-step">
            <h2>Connect to ChatGPT</h2>
            <p>Enter your ChatGPT API key to generate insights from your data.</p>

            <div class="form-group">
              <label for="apiKey">ChatGPT API Key</label>
              <input 
                type="password" 
                id="apiKey" 
                v-model="apiKey" 
                placeholder="sk-..."
                class="form-control"
              >
              <small>Your API key is never stored on our servers and is only used for this session.</small>
            </div>

            <div class="insight-options">
              <h3>Choose Analysis Options:</h3>
              <div class="checkbox-group">
                <label>
                  <input type="checkbox" v-model="analysisOptions.priceComparison">
                  Price Comparison Across Retailers
                </label>
                <label>
                  <input type="checkbox" v-model="analysisOptions.marketTrends">
                  Market Trends & Patterns
                </label>
                <label>
                  <input type="checkbox" v-model="analysisOptions.predictions">
                  Future Price Predictions
                </label>
                <label>
                  <input type="checkbox" v-model="analysisOptions.recommendations">
                  Strategic Recommendations
                </label>
              </div>
            </div>

            <div class="actions">
              <button class="btn btn-outline" @click="step = 2">Back</button>
              <button class="btn" @click="generateInsights" :disabled="!apiKey">Generate Insights</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UploadView',
  data() {
    return {
      step: 1,
      isDragging: false,
      selectedFile: null,
      errorMessage: '',
      extractedData: [],
      apiKey: '',
      analysisOptions: {
        priceComparison: true,
        marketTrends: true,
        predictions: false,
        recommendations: true
      },
      isLoading: false
    }
  },
  methods: {
    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        this.handleFile(file);
      } else {
        this.errorMessage = 'Please upload a PDF file.';
      }
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.handleFile(file);
      }
    },
    handleFile(file) {
      this.selectedFile = file;
      this.errorMessage = '';
      this.uploadFile();
    },
    async uploadFile() {
      if (!this.selectedFile) {
        return;
      }

      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          this.extractedData = response.data.data;
          this.step = 2;
        } else {
          this.errorMessage = response.data.message || 'Failed to process file.';
        }
      } catch (error) {
        this.errorMessage = 'Error uploading file. Please try again.';
        console.error('Upload error:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async generateInsights() {
      if (!this.apiKey) {
        return;
      }

      this.isLoading = true;
      
      try {
        const response = await axios.post('/api/insights', {
          data: this.extractedData,
          apiKey: this.apiKey,
          options: this.analysisOptions
        });

        if (response.data.success) {
          // Store the insights in sessionStorage
          sessionStorage.setItem('insights', JSON.stringify(response.data.insights));
          this.$router.push('/dashboard');
        } else {
          this.errorMessage = response.data.message || 'Failed to generate insights.';
        }
      } catch (error) {
        this.errorMessage = 'Error generating insights. Please check your API key and try again.';
        console.error('API error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.upload-page {
  padding: 2rem 0;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
}

.upload-container {
  max-width: 900px;
  margin: 0 auto;
}

.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.step.active .step-number {
  background-color: var(--primary-color);
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 10px;
}

.step-text {
  font-size: 0.9rem;
  color: var(--text-light);
}

.step.active .step-text {
  color: var(--primary-color);
  font-weight: 500;
}

.dropzone {
  border: 2px dashed #ccc;
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  text-align: center;
  margin: 2rem 0;
  cursor: pointer;
  transition: var(--transition);
}

.dropzone-active {
  border-color: var(--primary-color);
  background-color: rgba(67, 97, 238, 0.05);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  background-color: #ffebee;
  color: var(--error-color);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  margin: 1rem 0;
}

.format-info {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.format-info code {
  display: block;
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
}

.data-table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  border: 1px solid #eee;
  padding: 0.75rem;
  text-align: left;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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

.insight-options {
  margin: 1.5rem 0;
}

.checkbox-group {
  margin-top: 1rem;
}

.checkbox-group label {
  display: block;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>