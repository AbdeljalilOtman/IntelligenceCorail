import express from 'express';
import multer from 'multer';
import { extractDataFromPDF } from '../utils/pdfProcessor.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter for PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Route for file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Extract data from the PDF
    const extractedData = await extractDataFromPDF(req.file.path);
    
    if (!extractedData || extractedData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Could not extract data from the PDF. Please ensure it follows the required format.' 
      });
    }

    // Return the extracted data
    return res.status(200).json({
      success: true,
      message: 'File processed successfully',
      data: extractedData
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing the file'
    });
  }
});

// Alternative route for testing with JSON data
router.post('/json', express.json(), (req, res) => {
  try {
    const data = req.body;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Please provide an array of price data.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Data received successfully',
      data: data
    });
  } catch (error) {
    console.error('Error processing JSON:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing the data'
    });
  }
});

export default router;
