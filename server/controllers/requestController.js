const Request = require('../models/requestModel');
const mysql = require('mysql2/promise');


exports.getRequests = async (req, res) => {
    console.log('im here');

    console.log('Fetching requests...');
    try {
      const requests = await Request.getRequests();
      console.log('Data retrieved from model:', requests);
      res.status(200).json({ requests: requests });
    } catch (err) {
      console.error('Error fetching requests:', err);
      res.status(500).json({ error: 'Error fetching requests' });
    }
  };

exports.createRequest = async (req, res) => {
    console.log('Creating request...');
    try {
        const requestData = req.body;
        const createdRequest = await Request.createRequest(requestData);
        res.status(201).json({ request: createdRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
}


  