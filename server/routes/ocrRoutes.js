const express = require('express');
const cors = require('cors');
const axios = require('axios');
const upload = require('../config/multer'); // Correctly import multer config
const FormData = require('form-data');
const router = express.Router();

// Enable CORS
router.use(cors());

// OCR Endpoint
router.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Received file:', req.file.originalname);

    // Prepare the image file to send to the Flask backend
    const formData = new FormData();
    formData.append('image', req.file.buffer, req.file.originalname);

    // Send the file to the Flask API
    const response = await axios.post('http://127.0.0.1:5000/ocr', formData, {
      headers: formData.getHeaders(),
    });

    console.log('Flask response:', response.data);

    // Return the Flask API's response to the client
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Error communicating with Flask API:', err.message);
    res.status(500).json({ error: 'Error processing OCR request' });
  }
});

module.exports = router;
