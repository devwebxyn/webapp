// netlify/functions/api.cjs

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const serverless = require('serverless-http');

// Pastikan environment variables diatur di Netlify UI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();

// Middleware harus didefinisikan SEBELUM route
app.use(cors());
app.use(express.json());

// Langsung definisikan route pada 'app'
app.post('/api/chat', async (req, res) => {
  // Cek jika req.body ada isinya
  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: 'Prompt is required in the request body.' });
  }
  
  const { prompt } = req.body;

  console.log(`Menerima prompt untuk Groq: "${prompt}"`);

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

    res.status(200).json(chatCompletion.choices[0]);

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada Groq API.' });
  }
});

// Ekspor handler untuk Netlify
module.exports.handler = serverless(app);