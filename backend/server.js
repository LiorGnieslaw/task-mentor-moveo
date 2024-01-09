const app  = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const CodeBlock = require('./models/CodeBlock');

app.use(cors());

const io = new Server(server);  

connectDB();

let isCodeBlocksInit = true;
let mentorTrackMap = {};
let isMentor = false;

io.on('connection', (socket) => {
    socket.on('joinCodeBlock', (title) => {
        socket.join(title);
        if (mentorTrackMap[title] === false){
            isMentor = true;
            mentorTrackMap[title] = true
            socket.emit('mentorConnection', isMentor);
        }
      });
  
    socket.on(`codeChange`, ({title, newCode}) => {
        io.to(title).emit('getCode', newCode);
    });

    socket.on('disconnect', () => {});
  });

app.get('/code-blocks', async (req,res) => {
  try {
    const codeBlocks = await CodeBlock.find({});
    res.json(codeBlocks);
    if (isCodeBlocksInit){
      for ( const { title } of codeBlocks){
        mentorTrackMap[title] = false;
      }
    }
      isCodeBlocksInit = false;
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/code/:title', async (req,res) => {
  try {
    const { title } = req.params;
    const codeBlock = await CodeBlock.findOne({ title });
    res.json(codeBlock);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});