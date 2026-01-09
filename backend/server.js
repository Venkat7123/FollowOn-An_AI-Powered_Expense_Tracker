import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();


import auth from './src/routes/auth.js'
import chatbot from './src/routes/chatbot.js'
import expense from './src/routes/expense.js'
import summary from './src/routes/summary.js'

const PORT = "https://followon-backend.onrender.com";
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/expense', expense);
app.use('/api/summary', summary);
app.use('/api/chatbot', chatbot);

app.get('/', (req, res) => {
    res.send("Expense tracker is running")
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: "OK", port: PORT });
});

app.listen(PORT);