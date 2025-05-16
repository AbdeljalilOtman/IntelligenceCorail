import express from 'express';
import { generateInsightsWithOpenAI } from '../utils/openaiProcessor.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Route for generating insights
router.post('/', async (req, res) => {
  try {
    const { data, apiKey, options, useServerKey } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided or invalid data format'
      });
    }

    // Determine which API key to use
    let keyToUse = apiKey;
    
    // Use server API key if requested or if no key is provided
    if (useServerKey || !apiKey) {
      keyToUse = process.env.OPENAI_API_KEY;
      
      // Validate server API key
      if (!keyToUse || !keyToUse.startsWith('sk-')) {
        return res.status(500).json({
          success: false,
          message: 'Server API key is invalid or not configured. Please provide your own API key.'
        });
      }
    } else if (!apiKey.startsWith('sk-')) {
      // Validate client API key
      return res.status(400).json({
        success: false,
        message: 'Invalid API key format. OpenAI keys should start with "sk-".'
      });
    }

    try {
      // Generate insights using OpenAI
      const insights = await generateInsightsWithOpenAI(data, keyToUse, options);

      // Return the insights
      return res.status(200).json({
        success: true,
        insights: {
          ...insights,
          stats: {
            productCount: data.reduce((unique, item) => 
              unique.add(`${item.product}-${item.barcode}`), new Set()).size,
            retailerCount: data.reduce((unique, item) => 
              unique.add(item.retailer), new Set()).size,
            avgPriceDiff: calculateAveragePriceDiff(data),
            lowestPriceRetailer: findLowestPriceRetailer(data)
          },
          recommendations: insights.recommendations || []
        }
      });
    } catch (error) {
      console.error('API error:', error);
      
      // Handle different types of errors
      if (error.code === 'invalid_api_key' || error.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Invalid API key. Please provide a valid OpenAI API key.'
        });
      } else if (error.code === 'insufficient_quota' || error.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'API rate limit exceeded or insufficient quota. Please try again later or use a different API key.'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error generating insights. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating insights'
    });
  }
});

// Helper function to calculate average price difference
function calculateAveragePriceDiff(data) {
  const priceDiffs = data.map(item => {
    const diffStr = item.priceDifference.replace('%', '');
    return parseFloat(diffStr) || 0;
  });
  const sum = priceDiffs.reduce((acc, curr) => acc + curr, 0);
  return sum / priceDiffs.length;
}

// Helper function to find retailer with lowest average price
function findLowestPriceRetailer(data) {
  const retailerPrices = {};
  
  data.forEach(item => {
    if (!retailerPrices[item.retailer]) {
      retailerPrices[item.retailer] = { total: 0, count: 0 };
    }
    retailerPrices[item.retailer].total += item.averagePrice;
    retailerPrices[item.retailer].count++;
  });
  
  let lowestAvg = Infinity;
  let lowestRetailer = '';
  
  for (const [retailer, data] of Object.entries(retailerPrices)) {
    const avg = data.total / data.count;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      lowestRetailer = retailer;
    }
  }
  
  return lowestRetailer;
}

export default router;
