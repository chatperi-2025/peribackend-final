const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Directly using your OpenAI API key (not recommended for production)
const OPENAI_API_KEY = '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';

// Health check route
app.get('/', (req, res) => {
    res.send("✅ Welcome to the Peri Chatbot Backend!");
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    if (!userInput) {
        return res.status(400).json({ response: "Message cannot be empty." });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const botMessage = response.data.choices[0].message.content;
        res.json({ response: botMessage });

    } catch (error) {
        console.error('❌ OpenAI API Error:', error.message);
        res.status(500).json({ response: "Something went wrong while contacting OpenAI." });
    }
});

// Optional print route
app.get('/print', (req, res) => {
    console.log("✅ /print was triggered");
    res.send("✅ Print log was successful!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
