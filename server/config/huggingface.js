// config/huggingface.js
const axios = require('axios');

// Hardcoded API key for testing (replace with process.env.HUGGING_FACE_API_KEY for production)
const apiKey = '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';

const generateImageFromText = async (textPrompt) => {
    const url = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';

    try {
        const response = await axios.post(
            url,
            { inputs: textPrompt },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' // Directly retrieve binary data
            }
        );

        if (response.status === 200) {
            const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
            return base64Image;
        } else {
            console.error('Unexpected response:', response.status, response.data);
            throw new Error('Unexpected API response');
        }
    } catch (error) {
        console.error('Error generating image:', error.response?.data || error.message);
        throw new Error('Image generation failed');
    }
};

module.exports = { generateImageFromText };
