import express from 'express';
import { generateChatResponse } from '../utils/openaiProcessor.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Route for chat requests
router.post('/', async (req, res) => {
  try {
    const { prompt, apiKey, data, useServerKey } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'No prompt provided'
      });
    }

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
      // Generate chat response
      const response = await generateChatResponse(prompt, data, keyToUse);

      return res.status(200).json({
        success: true,
        response
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
        message: 'Error generating response. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating chat response'
    });
  }
});

export default router;
