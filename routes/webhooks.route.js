const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const response = req.query.hub.challenge;
  try {
    //
    if (req.query.hub.verify_token === 'instadmtesttoken') {
      res.status(200);
      res.send(response);
    }
  } catch (error) {
    res.status(400);
    res.json({ message: error.message });
  }
});

router.post('/', (req, res) => {
  clg(req.body);
  res.status(200);
  res.json({ status: 'success' });
});

module.exports = router;
