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
    //getting user details from IGSID (instagram senderId)
    const { data } = await axios(
      `https://graph.facebook.com/v12.0/${senderIGSID}?fields=name,profile_pic,follower_count&access_token=${EAAIEDxV2qx4BACnBbwmIXZBpGJuxW9POeq3m497HZBRD8ZB970Jg9Q1CuIwLqMUvZCFaJ5rgZAMcP1bn17W8NUY0bm152cQWjpgSPXqYZAZAiU7V4vLuv3XvN5ZBBTwH34xpFyQCMujAD25mYY1HkzduzId2HRqCEZCJHhfnAWpymtZC3HZCdf014SnzBPCZCIOL29YtUidndGZAjIQZDZD}`
    );
    console.log(data);
    //sending the message data through socket connection
    const socketResponse = {
      message: text,
      sender: data,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
    };
    io.emit('message_received', socketResponse);
    res.status(200);
    res.json({ status: 'success' });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ status: 'failure' });
  }
});

module.exports = router;
