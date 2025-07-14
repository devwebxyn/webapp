// netlify/functions/api.cjs

const Groq = require('groq-sdk');

// Pastikan environment variables diatur di Netlify UI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Ini adalah handler fungsi serverless "native" untuk Netlify
exports.handler = async (event) => {
  // Hanya proses permintaan POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Body permintaan ada di 'event.body' dan perlu di-parse dari string
    const body = JSON.parse(event.body);
    const { prompt } = body;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required in the request body.' }),
      };
    }

    console.log(`Menerima prompt untuk Groq: "${prompt}"`);

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

    // Kirim kembali respons yang berhasil
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatCompletion.choices[0]),
    };

  } catch (error) {
    console.error('API Error:', error);
    // Kirim respons error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Terjadi kesalahan pada server.' }),
    };
  }
};