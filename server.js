const dotenv = require('dotenv');
const express = require('express');

const http = require('http');
const socketIO = require('socket.io');

const cors = require('cors');
const instaWebHooks = require('./routes/webhooks.route');

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('Server is running');
});

app.use('/webhooks', instaWebHooks);

const server = http.createServer(app);

//socket.io integration

const io = socketIO(server);



io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('connection', null);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server is running on port ${PORT}`));

module.exports.getIO = function(){
    return io;
}