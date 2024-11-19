// controllers/imageController.js
const { generateImageFromText } = require('../config/huggingface');

const generateImage = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text prompt is required' });
    }

    try {
        const imageData = await generateImageFromText(text);
        res.status(200).json({ image: imageData }); // Base64-encoded image
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate image' });
    }
};

module.exports = { generateImage };
