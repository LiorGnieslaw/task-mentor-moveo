const app  = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { Server } = require('socket.io');
const port = process.env.PORT || 4000;
const connectDB = require('./config/db');
const CodeBlock = require('./models/CodeBlock');
const codeBlockController = require('./controllers/codeBlockControllers');

app.use(cors());

const io = new Server(server);  

connectDB();

const mentorTrackDict = {
    'Async Case': false,
    'Second Case': false,
    'Third Case': false,
    'Fourth Case': false,
    'Fifth Case': false,
  };

let isMentor = false;

io.on('connection', (socket) => {
    socket.on('joinCodeBlock', (title) => {
        socket.join(title);
        if (mentorTrackDict[title] === false){
            isMentor = true;
            mentorTrackDict[title] = true
            socket.emit('mentorConnection', isMentor);
        }
      });
  
    socket.on(`codeChange`, ({title, newCode}) => {
        io.to(title).emit('getCode', newCode);
    });

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected.`);
    });
  });

app.get('/code-blocks', codeBlockController.getCodeBlocks);
app.get('/code/:title', codeBlockController.getCodeBlock);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});