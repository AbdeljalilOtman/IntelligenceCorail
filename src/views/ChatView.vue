<template>
  <div class="chat-page">
    <div class="page-bg-shape"></div>
    <div class="container">
      <h1 class="page-title" data-aos="fade-down">Custom Data Analysis</h1>
      
      <div class="chat-container" data-aos="fade-up">
        <div class="card">
          <div class="data-summary" v-if="hasData">
            <h2>Your Uploaded Data</h2>
            <div class="data-stats">
              <div class="stat-badge">
                <span class="stat-value">{{ dataStats.productCount }}</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-badge">
                <span class="stat-value">{{ dataStats.retailerCount }}</span>
                <span class="stat-label">Retailers</span>
              </div>
              <div class="stat-badge">
                <span class="stat-value">{{ dataStats.categoryCount }}</span>
                <span class="stat-label">Categories</span>
              </div>
            </div>
            <p class="data-hint">Ask custom questions about your price data to get personalized insights.</p>
          </div>

          <div v-if="!hasData" class="no-data">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h3>No Data Available</h3>
            <p>You need to upload price data first before you can chat with the AI.</p>
            <router-link to="/upload" class="btn btn-primary">Upload Data</router-link>
          </div>

          <div v-else class="chat-box">
            <div class="chat-messages" ref="chatMessages">
              <div class="message system">
                <div class="message-content">
                  <p>Hello! I'm your AI assistant for price data analysis. What would you like to know about your uploaded data?</p>
                </div>
              </div>

              <div v-for="(message, index) in messages" 
                  :key="index" 
                  :class="['message', message.role]"
                  data-aos="fade-up"
                  :data-aos-delay="index * 100">
                <div class="message-avatar">
                  <svg v-if="message.role === 'user'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div class="message-content">
                  <p v-html="formatMessage(message.content)"></p>
                </div>
              </div>

              <div v-if="isLoading" class="message assistant loading">
                <div class="message-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="chat-input">
              <textarea 
                ref="promptInput"
                v-model="prompt" 
                @keydown.enter.prevent="sendPrompt"
                placeholder="Ask a question about your price data..." 
                :disabled="isLoading">
              </textarea>
              <button 
                @click="sendPrompt" 
                class="btn btn-primary send-btn"
                :disabled="isLoading || !prompt.trim()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
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
  name: 'ChatView',
  data() {
    return {
      hasData: false,
      dataStats: {
        productCount: 0,
        retailerCount: 0,
        categoryCount: 0
      },
      messages: [],
      prompt: '',
      isLoading: false,
      apiKey: '',
      useServerKey: false
    }
  },
  mounted() {
    this.checkForData();
    this.loadApiKey();
  },
  methods: {
    checkForData() {
      const insights = sessionStorage.getItem('insights');
      if (insights) {
        this.hasData = true;
        const data = JSON.parse(insights);
        
        // Extract data stats
        if (data.stats) {
          this.dataStats.productCount = data.stats.productCount || 0;
          this.dataStats.retailerCount = data.stats.retailerCount || 0;
        }

        // Count unique categories from charts if available
        if (data.charts && data.charts.productData) {
          this.dataStats.categoryCount = data.charts.productData.length || 0;
        }
      }
    },
    loadApiKey() {
      const apiKey = localStorage.getItem('apiKey');
      if (apiKey) {
        this.apiKey = apiKey;
      }
    },
    
    async sendPrompt() {
      if (!this.prompt.trim() || this.isLoading) return;
      
      // Add user message
      this.messages.push({
        role: 'user',
        content: this.prompt
      });
      
      // Clear input
      const promptText = this.prompt;
      this.prompt = '';
      
      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      this.isLoading = true;
      
      try {
        // Get insights data from session storage
        const insights = JSON.parse(sessionStorage.getItem('insights'));
        
        // Send prompt to backend
        const response = await axios.post('/api/chat', {
          prompt: promptText,
          apiKey: this.apiKey,
          useServerKey: !this.apiKey || this.apiKey.trim() === '',
          data: insights.rawData || [] // Use raw data if available
        });
        
        if (response.data.success) {
          // Add AI response
          this.messages.push({
            role: 'assistant',
            content: response.data.response
          });
        } else {
          throw new Error(response.data.message || 'Failed to get response');
        }
      } catch (error) {
        console.error('Chat error:', error);
        
        let errorMessage = 'Sorry, I encountered an error while processing your request.';
        
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Add error message
        this.messages.push({
          role: 'assistant',
          content: errorMessage
        });
      } finally {
        this.isLoading = false;
        
        // Scroll to bottom again after adding response
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    },
    formatMessage(message) {
      // Replace newlines with <br>
      let formatted = message.replace(/\n/g, '<br>');
      
      // Format code blocks
      formatted = formatted.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre><code class="$1">$2</code></pre>');
      
      // Format bold text
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Format italic text
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return formatted;
    }
  }
}
</script>

<style scoped>
.chat-page {
  width: 100%;
  min-height: calc(100vh - 160px);
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

.chat-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.data-summary {
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.data-summary h2 {
  font-size: 1.6rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.data-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-badge {
  background: linear-gradient(135deg, rgba(76, 161, 175, 0.1), rgba(44, 62, 80, 0.1));
  border-radius: 8px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 110px;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.data-hint {
  color: #666;
  font-style: italic;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #666;
}

.no-data svg {
  color: #4ca1af;
  margin-bottom: 1.5rem;
}

.no-data h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.no-data p {
  margin-bottom: 1.5rem;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.5rem;
  margin-bottom: 1rem;
  max-height: calc(600px - 80px);
}

.message {
  display: flex;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.user .message-avatar {
  background: linear-gradient(135deg, #4ca1af, #2c3e50);
  color: white;
}

.assistant .message-avatar {
  background: linear-gradient(135deg, #FFB347, #FFCC33);
  color: white;
}

.system .message-avatar {
  background: #e0e0e0;
  color: #666;
}

.message-content {
  background-color: #f9fafc;
  padding: 1rem;
  border-radius: 12px;
  max-width: calc(100% - 60px);
}

.user .message-content {
  background: linear-gradient(135deg, rgba(76, 161, 175, 0.1), rgba(44, 62, 80, 0.1));
}

.assistant .message-content {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.message-content p {
  margin: 0;
  line-height: 1.6;
}

/* Code formatting styles */
.message-content pre {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  border: 1px solid #eaeef3;
}

.message-content code {
  font-family: monospace;
}

.chat-input {
  display: flex;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chat-input textarea {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem;
  resize: none;
  height: 50px;
  font-family: inherit;
  font-size: 1rem;
  background-color: transparent;
}

.send-btn {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 8px;
}

.send-btn svg {
  width: 20px;
  height: 20px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
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

/* Loading animation */
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  float: left;
  margin: 0 1px;
  background-color: #4ca1af;
  display: block;
  border-radius: 50%;
  opacity: 0.4;
}

.typing-indicator span:nth-of-type(1) {
  animation: 1s blink infinite 0.3333s;
}

.typing-indicator span:nth-of-type(2) {
  animation: 1s blink infinite 0.6666s;
}

.typing-indicator span:nth-of-type(3) {
  animation: 1s blink infinite 0.9999s;
}

@keyframes blink {
  50% { opacity: 1; }
}

/* Responsive styles */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .chat-box {
    height: 500px;
  }
  
  .chat-messages {
    max-height: calc(500px - 80px);
  }
}

@media (max-width: 576px) {
  .card {
    padding: 1.5rem 1rem;
  }
  
  .data-stats {
    justify-content: center;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
  }
  
  .message-content {
    max-width: calc(100% - 45px);
  }
}
</style>