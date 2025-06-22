// server.cjs
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message || '';
  const language = req.body.language || 'en';

  // Define the language prompt
  const promptHeader = language === 'sw'
    ? `Wewe ni msaidizi wa afya ya akili mwenye huruma. Jibu maswali yote kwa Kiswahili kwa njia ya kusaidia na ya kueleweka.`
    : `You are a helpful and supportive mental health assistant. Reply kindly in English.`

  const fullPrompt = `${promptHeader}\n\nUser: ${userMessage}\nAssistant:`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt: fullPrompt,
      stream: false
    });

    const reply = response.data.response.trim();
    console.log("🧠 Ollama replied:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("🚨 Ollama error:", err.message);
    res.status(500).json({ reply: "⚠️ Failed to connect. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
