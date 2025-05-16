import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

/**
 * Extract price comparison data from a PDF file
 * @param {string} filePath - Path to the uploaded PDF file
 * @returns {Array} - Array of extracted price data objects
 */
export async function extractDataFromPDF(filePath) {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse the PDF using the core function directly to avoid test files loading
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    
    // Extract data from text
    const extractedData = parseTextContent(text);
    
    // Clean up the file after processing
    fs.unlinkSync(filePath);
    
    return extractedData;
  } catch (error) {
    console.error('Error extracting data from PDF:', error);
    throw new Error('Failed to extract data from PDF');
  }
}

/**
 * Parse the text content to extract structured price data
 * @param {string} text - Raw text from the PDF
 * @returns {Array} - Array of structured data objects
 */
function parseTextContent(text) {
  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const result = [];
  
  // Regular expression to match price data
  // Format: Category Product Barcode Retailer PriceCount AveragePrice PriceDiff
  const regex = /([A-Z\s]+)\s+([^\d]+)\s+(\d+)\s+([A-Z]+)\s+(\d+)\s+(\d+[\.,]\d+)\s+(\d+[\.,]\d+%)/i;
  
  for (const line of lines) {
    const match = regex.exec(line);
    
    if (match) {
      result.push({
        category: match[1].trim(),
        product: match[2].trim(),
        barcode: match[3].trim(),
        retailer: match[4].trim(),
        priceCount: parseInt(match[5], 10),
        averagePrice: parseFloat(match[6].replace(',', '.')),
        priceDifference: match[7].trim()
      });
    }
  }
  
  return result;
}
