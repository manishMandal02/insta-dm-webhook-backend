const { default: axios } = require('axios');
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

router.post('/', async (req, res) => {
  //getting socket.io instance
  let io = server.getIO();
  //retreving data from the webhook response
  const text = req.body.entry[0].messaging[0].message.text || '';
  const senderIGSID = req.body.entry[0].messaging[0].sender.id || '';
  const timestamp = req.body.entry[0].time || '';
  try {
    if (!text || !senderIGSID) {
      throw new Error('Something went wrong');
    }

    //sending the message data through socket connection
    const socketResponse = {
      message: text,
      senderId: senderIGSID,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
    };
    io.emit('message_received', socketResponse);
    res.status(200);
    res.json({ status: 'success' });
  } catch (error) {
    console.log(error.response && error.response.data.message ? error.response.data.message : error.message);
    res.status(400);
    res.json({ status: 'failure' });
  }
});

module.exports = router;
