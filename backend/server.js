const app  = require('express')();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const port = process.env.PORT || 4000;
const connectDB = require('./config/db');
const CodeBlock = require('./models/CodeBlock');
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

    socket.on('joinCodeBlock', async ({ title }) => {
        socket.join(title);
        const codeBlock = await CodeBlock.findOne({ title });

        if (!codeBlock) {
            await CodeBlock.create({ title });
    }
        io.to(title).emit('userJoined');
    });
  
    socket.on('codeChange', ({ title, code }) => {
        io.to(title).emit('codeChange', { title, code });
      });
});

server.listen(port, () => {
    console.log("Server is running on port 4000")
});