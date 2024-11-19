const multer = require('multer');

// Configure Multer to use memory storage
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage });

module.exports = upload;
