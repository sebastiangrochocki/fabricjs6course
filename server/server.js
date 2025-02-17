const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const app = express();

// CORS configuration to allow all origins (or specify 'http://localhost:3001')
app.use(
  cors({
    origin: "http://localhost:3001", // Or '*' to allow all origins
    methods: ["GET", "POST", "OPTIONS"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

app.use(express.json());

app.post("/generate-text", async (req, res) => {
  try {
    const { text } = req.body; // Make sure to destructure `text` from the body

    if (!text) {
      return res.status(400).json({ error: "Input text is required" }); // Handle missing text
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Using the newer model
        messages: [{ role: "user", content: text }],
        max_tokens: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const generatedText = response.data.choices[0].message.content.trim();
    res.json({ generatedText });
  } catch (error) {
    console.error("Error generating text:", error.message);
    res.status(500).json({ error: "Error generating text" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
