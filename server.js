const dotenv = require('dotenv');
const express = require('express');

const http = require('http');
const socketIO = require('socket.io');

const cors = require('cors');
const scrapperRoutes = require('./routes/scrapper.route');

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('Server is running');
});

app.use('/api/scrapper', scrapperRoutes);

app.use('/api/webhook-scrapper', webhookScrapperRoutes);

const server = http.createServer(app);

// //socket.io integration
// const io = socketIO(server);

// let interval;

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getApiAndEmit(socket), 1000);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     clearInterval(interval);
//   });
// });

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server is running on port ${PORT}`));
