require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Hanya inisialisasi Klien API Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Endpoint API sekarang langsung memanggil Groq
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  console.log(`Menerima prompt untuk Groq: "${prompt}"`);
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const chatCompletion = await groq.chat.completions.create({
        // --- PERUBAHAN DI SINI ---
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
        stream: true,
    });

    for await (const chunk of chatCompletion) { 
      res.write(chunk.choices[0]?.delta?.content || ''); 
    }
  } catch (error) {
    console.error('Groq API Error:', error.message);
    res.write(`\n\n**Maaf, terjadi kesalahan pada Groq API:** ${error.message}`);
  } finally {
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Backend server (Groq-only) listening on port ${port}`);
});