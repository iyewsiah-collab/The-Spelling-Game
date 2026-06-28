import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Evaluate student's sentence (Enrichment Mode)
  app.post('/api/check-sentence', async (req, res) => {
    const { word, sentence, playerName } = req.body;

    if (!word || !sentence) {
      return res.status(400).json({ error: 'Missing word or sentence.' });
    }

    try {
      // Lazy init of Gemini API
      const ai = getAIClient();

      const prompt = `
        Player Name: ${playerName || 'Super Speller'}
        Target Spelling Word: "${word}"
        Submitted Sentence: "${sentence}"

        Evaluate this sentence written by a Year 1 student (age 6-7, learning English).
        
        Requirements:
        1. The sentence must contain the target spelling word "${word}" (case-insensitive).
        2. The sentence should make logical sense for a primary school level.
        3. Check basic grammar and punctuation (capital letter at start, full stop at end). 
           Be gentle! If they missed a full stop but the sentence is otherwise great, still approve it but give a gentle reminder.
        
        Provide:
        - "approved": true if it's a real sentence that attempts to use the word. false if it's just random letters, unrelated words, or completely misses the target word.
        - "feedback": Short, extremely encouraging, warm, and easy-to-understand feedback addressed directly to the student by name. Use positive words! E.g. "Wow Alex, that is a stellar sentence!", or "Great try Jordan! Remember to start with a capital letter next time!"
        - "stars": Award 3 stars for an outstanding complete sentence (including capitals/punctuation and correct usage), 2 stars for a correct but simple sentence, 1 star for a partial try, 0 stars only if it's completely incorrect or gibberish.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an exceptionally warm, encouraging primary school teacher named "Spelling Buddy". You give direct, friendly, and cute feedback to children. Speak in short sentences, use positive words, and refer to them by their name.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              approved: {
                type: Type.BOOLEAN,
                description: 'True if the sentence is valid and contains the target word.',
              },
              feedback: {
                type: Type.STRING,
                description: 'Caring, positive, child-friendly feedback addressed directly to the child.',
              },
              stars: {
                type: Type.INTEGER,
                description: 'Stars earned: 0 (incorrect) to 3 (excellent sentence).',
              },
            },
            required: ['approved', 'feedback', 'stars'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Received empty response from Gemini');
      }

      const result = JSON.parse(responseText.trim());
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/check-sentence:', error);
      
      // Fallback response if API key is missing or calls fail, so the game doesn't break!
      let friendlyFeedback = "That is a lovely sentence! Well done! 🌟";
      let stars = 3;
      
      const containsWord = sentence.toLowerCase().includes(word.toLowerCase());
      if (!containsWord) {
        friendlyFeedback = `Oh! Can you try writing a sentence with the word "${word}"?`;
        stars = 1;
      } else if (sentence.trim().length < 5) {
        friendlyFeedback = "Great start! Try to make your sentence a little longer.";
        stars = 2;
      }
      
      res.json({
        approved: containsWord,
        feedback: `${friendlyFeedback} (Spelling Buddy offline: auto-evaluated)`,
        stars: containsWord ? stars : 0,
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
