const app  = require('express')();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
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

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('joinCodeBlock', ({ title }) => {
        socket.join(title);
        
        const codeBlock = CodeBlock.findOne({ title });
        io.to(title).emit('codeChange', { title, code: codeBlock.code || ''});
    });
  
    socket.on('codeChange', ({ title, code }) => {
        console.log('RECIEVED THE CODE', code)
        io.to(title).emit('codeChange', { title, code });
      });
 
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(4000, () => {
    console.log("Server is running on port 4000")
});