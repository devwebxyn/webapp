require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 8000; // Backend akan berjalan di port 8000

// Inisialisasi Express dan CORS
app.use(cors());
app.use(express.json());

// Konfigurasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint untuk chat
app.post('/api/chat', async (req, res) => {
  try {
    // ... kode try yang sudah ada
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Cek apakah error memiliki status 503
    if (error.status === 503) {
      return res.status(503).json({ error: 'Layanan AI sedang sibuk. Silakan coba lagi beberapa saat.' });
    }
    // Untuk error lainnya
    res.status(500).json({ error: 'Terjadi kesalahan internal pada server AI.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});