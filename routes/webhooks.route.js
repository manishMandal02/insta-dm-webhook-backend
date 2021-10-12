const express = require('express');

const test = require('../server');

const router = express.Router();

const server = require('../server');

router.get('/', (req, res) => {
  const response = req.query['hub.challenge'];
  console.log(req.query);
  try {
    //
    if (req.query['hub.verify_token'] === 'instadmtesttoken') {
      res.status(200);
      res.send(response);
    } else {
      res.status(401);
      res.json({ staus: 'token_not_verified' });
    }
  } catch (error) {
    res.status(400);
    res.json({ message: error.message });
  }
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.status(200);
  let io = server.getIO();
  io.emit('test', req.body);
  res.json({ status: 'success' });
});

module.exports = router;
