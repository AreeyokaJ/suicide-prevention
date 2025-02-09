// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import http from 'http'; 
import {Server} from 'socket.io';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5012;

app.use(cors());
app.use(express.json());

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Chatbot Route
app.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 100,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// server.js (Backend)



const app2 = express();
const server = http.createServer(app2);
const io = new Server(server); // Updated for ESM syntax

// --- Chatbot Code ---
app2.get('/chatbot', (req, res) => {
  res.send("This is the chatbot endpoint");
});

// --- Real-Time Chat Code ---
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join a chat room (for group chats)
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Receive chat message and broadcast it to the room
  socket.on('chatMessage', (data) => {
    io.to(data.room).emit('chatMessage', data.message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(5013, () => {
  console.log('Server running on port 5013');
});

app.use(cors());
app2.use(cors());