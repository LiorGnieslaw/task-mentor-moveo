const app  = require('express')();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const codeBlockController = require('./controllers/codeBlockControllers');
const cors = require('cors');
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
});

connectDB();

app.get('/code-blocks', codeBlockController.getCodeBlocks);
app.get('/code/:title', codeBlockController.getCodeBlock);

//This is my try for setting the mentor with the socket and not with local storage.
// let sockets = [];


io.on('connection', (socket) => {
    //This is my try for setting the mentor with the socket and not with local storage.
    // sockets.push(socket);
    // const isMentor = sockets.length === 0;
    // socket.emit("userInfo", { isMentor });

    socket.on('joinCodeBlock', ({ title }) => {
        socket.join(title);
        io.to(title).emit('userJoined');
    });
  
    socket.on('codeChange', ({ title, code }) => {
        io.to(title).emit('codeChange', { title, code });
      });
});

server.listen(4000, () => {
    console.log("Server is running on port 4000")
});