// netlify/functions/api.js

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const serverless = require('serverless-http');

// Pastikan environment variables diatur di Netlify UI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  console.log(`Menerima prompt untuk Groq: "${prompt}"`);

  // Streaming tidak didukung secara langsung di serverless function standar.
  // Kita akan mengirim respon lengkap setelah selesai.
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Always detect the language of the user's input and respond in that same language."
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      model: 'llama3-8b-8192', 
    });

    res.json(chatCompletion.choices[0]);

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada Groq API.' });
  }
});

app.use('/api', router); // Menggunakan prefix /api

// Ekspor handler untuk Netlify
module.exports.handler = serverless(app);