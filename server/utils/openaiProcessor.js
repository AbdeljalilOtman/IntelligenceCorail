import OpenAI from "openai";

/**
 * Generate insights from price data using OpenAI
 * @param {Array} data - Price comparison data
 * @param {string} apiKey - OpenAI API key
 * @param {Object} options - Analysis options
 * @returns {Object} - Generated insights
 */
export async function generateInsightsWithOpenAI(data, apiKey, options) {
  try {
    // Initialize OpenAI client with provided API key
    const openai = new OpenAI({
      apiKey: apiKey
    });
    
    // Prepare data summary to reduce token usage - use more aggressive summarization
    const dataSummary = summarizeDataMinimal(data);
    
    // Prepare a more concise prompt based on selected options
    const prompt = buildConcisePrompt(dataSummary, options);
    
    // Make API call to OpenAI - use cheaper model and limit tokens
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use cheaper model instead of gpt-4o
      messages: [
        { 
          role: "system", 
          content: "You are a retail data analyst. Provide concise insights with key numbers when possible."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.5,
      max_tokens: 800 // Reduced from 2000 to save tokens
    });
    
    // Process and structure the response
    return structureInsights(response.choices[0].message.content, options);
    
  } catch (error) {
    console.error('Error generating insights with OpenAI:', error);
    
    // Special handling for quota/rate limit errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return generateFallbackInsights(data, options);
    }
    
    throw new Error('Failed to generate insights with OpenAI');
  }
}

/**
 * Generate chat response based on user prompt and data
 * @param {string} prompt - User's question
 * @param {Array} data - Price comparison data
 * @param {string} apiKey - OpenAI API key
 * @returns {string} - AI response to user query
 */
export async function generateChatResponse(prompt, data, apiKey) {
  try {
    // Initialize OpenAI client with provided API key
    const openai = new OpenAI({
      apiKey: apiKey
    });
    
    // Prepare data summary to reduce token usage - use more aggressive summarization
    const dataSummary = summarizeDataMinimal(data);
    
    // Make API call to OpenAI - use cheaper model and limit tokens
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use cheaper model instead of gpt-4o
      messages: [
        { 
          role: "system", 
          content: `You analyze retail price data to answer questions concisely.
          Here's the data summary:
          ${JSON.stringify(dataSummary)}`
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 500 // Reduced from 1000 to save tokens
    });
    
    return response.choices[0].message.content;
    
  } catch (error) {
    console.error('Error generating chat response with OpenAI:', error);
    
    // Special handling for quota/rate limit errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return generateFallbackChatResponse(prompt, data);
    }
    
    throw new Error('Failed to generate chat response with OpenAI');
  }
}

/**
 * Create a minimal summary of the data to reduce token usage
 * @param {Array} data - Full price comparison data
 * @returns {Object} - Highly summarized data
 */
function summarizeDataMinimal(data) {
  // Extract unique categories, retailers, and product count
  const categories = [...new Set(data.map(item => item.category))];
  const retailers = [...new Set(data.map(item => item.retailer))];
  const productCodes = [...new Set(data.map(item => item.barcode))];
  
  // Calculate basic stats per retailer
  const retailerStats = {};
  retailers.forEach(retailer => {
    const retailerItems = data.filter(item => item.retailer === retailer);
    const avgPrice = retailerItems.reduce((sum, item) => sum + item.averagePrice, 0) / retailerItems.length;
    
    retailerStats[retailer] = {
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      itemCount: retailerItems.length
    };
  });
  
  // Calculate basic stats per category
  const categoryStats = {};
  categories.forEach(cat => {
    const catItems = data.filter(item => item.category === cat);
    const avgPrice = catItems.reduce((sum, item) => sum + item.averagePrice, 0) / catItems.length;
    
    categoryStats[cat] = {
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      itemCount: catItems.length
    };
  });
  
  return {
    summary: {
      retailerCount: retailers.length,
      categoryCount: categories.length,
      productCount: productCodes.length,
      totalEntries: data.length
    },
    retailers: retailerStats,
    categories: categoryStats
  };
}

/**
 * Build a concise prompt for OpenAI based on analysis options
 * @param {Object} dataSummary - Minimally summarized data
 * @param {Object} options - Analysis options
 * @returns {string} - Generated prompt
 */
function buildConcisePrompt(dataSummary, options) {
  let prompt = `Analyze this retail price data summary:\n\n`;
  prompt += `Retailers: ${Object.keys(dataSummary.retailers).join(', ')}\n`;
  prompt += `Categories: ${Object.keys(dataSummary.categories).join(', ')}\n`;
  prompt += `Products: ${dataSummary.summary.productCount}\n\n`;
  
  prompt += `Retailer stats: ${JSON.stringify(dataSummary.retailers)}\n`;
  prompt += `Category stats: ${JSON.stringify(dataSummary.categories)}\n\n`;
  
  prompt += `Provide BRIEF insights in JSON format with these sections:\n`;
  
  // Add specific analysis requests based on options
  const requestedSections = [];
  if (options.priceComparison) requestedSections.push('"priceComparison": Brief retailer price comparison');
  if (options.marketTrends) requestedSections.push('"marketTrends": Brief pattern/trend identification');
  if (options.predictions) requestedSections.push('"predictions": Brief price movement predictions');
  if (options.recommendations) requestedSections.push('"recommendations": Array of objects with "title" & "description" (max 3)');
  requestedSections.push('"productAnalysis": Brief product pricing analysis');
  
  prompt += requestedSections.join(', ') + '\n\n';
  prompt += `Keep all sections VERY BRIEF to minimize token usage.`;
  
  return prompt;
}

/**
 * Generate fallback insights when API quota is exceeded
 * @param {Array} data - Price comparison data
 * @param {Object} options - Analysis options
 * @returns {Object} - Basic insights generated without OpenAI
 */
function generateFallbackInsights(data, options) {
  // Calculate basic insights manually
  const retailers = [...new Set(data.map(item => item.retailer))];
  const categories = [...new Set(data.map(item => item.category))];
  
  // Find lowest price retailer
  const retailerAvgPrices = {};
  retailers.forEach(retailer => {
    const items = data.filter(item => item.retailer === retailer);
    retailerAvgPrices[retailer] = items.reduce((sum, item) => sum + item.averagePrice, 0) / items.length;
  });
  
  const lowestPriceRetailer = Object.entries(retailerAvgPrices)
    .sort((a, b) => a[1] - b[1])[0][0];
  
  // Basic insights
  const insights = {};
  
  if (options.priceComparison) {
    insights.priceComparison = `Based on the data, ${lowestPriceRetailer} appears to have the most competitive pricing overall.`;
  }
  
  if (options.marketTrends) {
    insights.marketTrends = `Data shows price variations across different retailers and product categories.`;
  }
  
  if (options.predictions) {
    insights.predictions = `Without historical data, detailed predictions cannot be made. Consider collecting price data over time for trend analysis.`;
  }
  
  if (options.recommendations) {
    insights.recommendations = [
      {
        title: "Compare Prices",
        description: `Compare prices at ${lowestPriceRetailer} with other retailers to find the best deals.`
      },
      {
        title: "Track Price Changes",
        description: "Monitor prices over time to identify when to make purchases."
      }
    ];
  }
  
  insights.productAnalysis = `Data includes products across ${categories.length} categories with varying price points. Consider detailed analysis by category.`;
  
  return insights;
}

/**
 * Generate fallback chat response when API quota is exceeded
 * @param {string} prompt - User's question
 * @param {Array} data - Price comparison data
 * @returns {string} - Basic response generated without OpenAI
 */
function generateFallbackChatResponse(prompt, data) {
  // Extract basic information from the data
  const retailers = [...new Set(data.map(item => item.retailer))];
  const categories = [...new Set(data.map(item => item.category))];
  const products = [...new Set(data.map(item => item.product))];
  
  return `I'm sorry, but I'm currently unable to process your request through the AI service due to usage limits.

Here's some basic information about your data:
- Your data contains ${data.length} entries
- Retailers: ${retailers.join(', ')}
- Product categories: ${categories.join(', ')}
- Number of unique products: ${products.length}

For more detailed analysis, please try again later or contact support.`;
}

/**
 * Structure the raw insight text from OpenAI into organized sections
 * @param {string} insightText - Raw insight text from OpenAI
 * @param {Object} options - Analysis options that were requested
 * @returns {Object} - Structured insights
 */
function structureInsights(insightText, options) {
  let structuredInsights = {};
  
  try {
    // Try to parse if response is directly in JSON format
    structuredInsights = JSON.parse(insightText);
  } catch (e) {
    // If not JSON, extract sections manually
    const sections = {
      priceComparison: extractSection(insightText, "Price Comparison", "Market Trends"),
      marketTrends: extractSection(insightText, "Market Trends", "Predictions"),
      predictions: extractSection(insightText, "Predictions", "Recommendations"),
      recommendations: parseRecommendations(extractSection(insightText, "Recommendations", "Product Analysis")),
      productAnalysis: extractSection(insightText, "Product Analysis", null)
    };
    
    // Add only the requested sections
    Object.keys(options).forEach(key => {
      if (options[key] && sections[key]) {
        structuredInsights[key] = sections[key];
      }
    });
    
    // Always include product analysis
    structuredInsights.productAnalysis = sections.productAnalysis;
  }
  
  return structuredInsights;
}

/**
 * Extract a section from the raw insight text
 * @param {string} text - Full insight text
 * @param {string} startMarker - Section start heading
 * @param {string} endMarker - Section end heading (start of next section)
 * @returns {string} - Extracted section text
 */
function extractSection(text, startMarker, endMarker) {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return "";
  
  let endIndex;
  if (endMarker && text.indexOf(endMarker) !== -1) {
    endIndex = text.indexOf(endMarker);
  } else {
    endIndex = text.length;
  }
  
  return text.substring(startIndex + startMarker.length, endIndex).trim();
}

/**
 * Parse recommendations text into structured format
 * @param {string} recommendationsText - Raw recommendations text
 * @returns {Array} - Structured recommendations
 */
function parseRecommendations(recommendationsText) {
  if (!recommendationsText) return [];
  
  const recommendations = [];
  const regex = /(\d+\.\s.*?):\s(.*?)(?=\d+\.|$)/gs;
  
  let match;
  while ((match = regex.exec(recommendationsText))) {
    if (match.length >= 3) {
      recommendations.push({
        title: match[1].trim(),
        description: match[2].trim()
      });
    }
  }
  
  return recommendations;
}
