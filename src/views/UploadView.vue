<template>
  <div class="upload-page">
    <div class="page-bg-shape"></div>
    <div class="container">
      <h1 class="page-title" data-aos="fade-down">Upload Price Data</h1>

      <div class="upload-container" data-aos="fade-up" data-aos-delay="100">
        <div class="steps">
          <div class="step" :class="{ 'active': step >= 1 }">
            <div class="step-number">1</div>
            <div class="step-text">Upload PDF</div>
          </div>
          <div class="step-connector" :class="{ 'active-connector': step >= 2 }"></div>
          <div class="step" :class="{ 'active': step >= 2 }">
            <div class="step-number">2</div>
            <div class="step-text">Verify Data</div>
          </div>
          <div class="step-connector" :class="{ 'active-connector': step >= 3 }"></div>
          <div class="step" :class="{ 'active': step >= 3 }">
            <div class="step-number">3</div>
            <div class="step-text">Generate Insights</div>
          </div>
        </div>

        <div class="card">
          <!-- Step 1: Upload File -->
          <div v-if="step === 1" class="upload-step" data-aos="fade-up">
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
                <div class="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <p>Drag and drop your PDF file here</p>
                <p>or</p>
                <button class="btn btn-primary" @click="$refs.fileInput.click()">Browse Files</button>
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
          <div v-if="step === 2" class="verify-step" data-aos="fade-up">
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
              <button class="btn btn-primary" @click="step = 3">Confirm and Continue</button>
            </div>
          </div>

          <!-- Step 3: ChatGPT API Key -->
          <div v-if="step === 3" class="api-step" data-aos="fade-up">
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
              <button class="btn btn-primary" @click="generateInsights" :disabled="!apiKey">
                <span v-if="isLoading">Processing...</span>
                <span v-else>Generate Insights</span>
              </button>
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
  width: 100%;
  min-height: calc(100vh - 160px); /* Account for header and footer */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  background-color: #f9fafc;
  padding: 3rem 0;
}

.page-bg-shape {
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
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.page-title {
  text-align: center;
  margin-bottom: 3rem;
  width: 100%;
  font-size: 3rem;
  font-weight: 700;
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
  margin: 1rem auto 0;
  border-radius: 2px;
}

.upload-container {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  transition: all 0.3s ease;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step.active .step-number {
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  transform: scale(1.1);
  box-shadow: 0 6px 10px rgba(76, 161, 175, 0.3);
}

.step-connector {
  flex: 1;
  height: 3px;
  background-color: #e0e0e0;
  margin: 0 10px;
  transition: all 0.5s ease;
}

.step-connector.active-connector {
  background: linear-gradient(to right, #4ca1af, #2c3e50);
}

.step-text {
  font-size: 1rem;
  color: var(--text-light);
  transition: all 0.3s ease;
}

.step.active .step-text {
  color: #4ca1af;
  font-weight: 600;
}

.dropzone {
  width: 100%;
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin: 2rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.01);
  position: relative;
  overflow: hidden;
}

.dropzone:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(135deg, rgba(76, 161, 175, 0.03), rgba(44, 62, 80, 0.03));
  transition: height 0.5s ease;
  z-index: 0;
}

.dropzone:hover:before {
  height: 100%;
}

.dropzone-active {
  border-color: #4ca1af;
  background-color: rgba(76, 161, 175, 0.05);
  box-shadow: 0 4px 20px rgba(76, 161, 175, 0.15);
  transform: translateY(-2px);
}

.dropzone-content {
  position: relative;
  z-index: 1;
}

.upload-icon {
  margin-bottom: 1.5rem;
  color: #4ca1af;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  border: none;
  font-size: 1rem;
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

.btn-primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-outline {
  border: 2px solid #4ca1af;
  color: #4ca1af;
  background: transparent;
}

.btn-outline:hover {
  background-color: rgba(76, 161, 175, 0.1);
}

.error-message {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid #f44336;
}

.format-info {
  margin-top: 2.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.format-info h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.format-info code {
  display: block;
  background-color: #f5f7fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  border: 1px solid #eaeef3;
}

.data-table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border: none;
}

.data-table th, .data-table td {
  border: 1px solid #eaeef3;
  padding: 1rem;
  text-align: left;
}

.data-table th {
  background: linear-gradient(to right, #f9fafc, #ffffff);
  font-weight: 600;
  color: #2c3e50;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9fafc;
}

.data-table tbody tr:hover {
  background-color: rgba(76, 161, 175, 0.05);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9fafc;
}

.form-control:focus {
  border-color: #4ca1af;
  box-shadow: 0 0 0 2px rgba(76, 161, 175, 0.2);
  outline: none;
}

.form-group small {
  display: block;
  color: #666;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.insight-options {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f9fafc;
  border-radius: 8px;
  border: 1px solid #eaeef3;
}

.insight-options h3 {
  color: #2c3e50;
  margin-bottom: 1.2rem;
  font-size: 1.3rem;
}

.checkbox-group {
  margin-top: 1rem;
}

.checkbox-group label {
  display: block;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 4px;
}

.checkbox-group label:hover {
  background-color: rgba(76, 161, 175, 0.05);
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.8rem;
  accent-color: #4ca1af;
  width: 18px;
  height: 18px;
}

/* Make sure tables and content are responsive */
@media (max-width: 992px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .upload-page {
    padding: 2rem 0;
  }
  
  .container {
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .card {
    padding: 1.5rem;
  }
  
  .steps {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .step-connector {
    width: 2px;
    height: 20px;
    margin: 0;
  }
  
  .dropzone {
    padding: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .actions .btn {
    width: 100%;
  }
  
  .btn {
    text-align: center;
  }
}
</style>