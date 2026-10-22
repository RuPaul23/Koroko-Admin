// ==============================================================================
// KOROKO-ADMIN — Gemini AI API Integration Endpoint
// Powered by Groq AI (qwen/qwen3.8-27b) & Gemini for Authentic Tokyo Streetwear Titles
// ==============================================================================

import path from 'node:path';
import fs from 'node:fs';

function loadEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const separator = trimmed.indexOf('=');
        if (separator <= 0) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch (e) {}
}

loadEnvFile();

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { action, category, prompt } = req.body || {};
  const groqApiKey = process.env.GROQ_API_KEY || '';

  try {
    // 1. Generate Authentic High-End Japanese Streetwear Name & Description
    if (action === 'generate-name') {
      const systemPrompt = `You are the lead creative director for "KOROKO", a high-end Tokyo minimalist and cyberpunk streetwear brand (https://koroko.in).
Never generate generic or standard clothing names (e.g. "Cool T-Shirt", "Black Hoodie").
Generate ultra-aesthetic, edgy, authentic Tokyo streetwear naming featuring terms like Shibuya, Harajuku, Kanji, Noir, Heavyweight, Boxy, Phantom, Acid Wash, or Cypher.
Category: ${category || 'oversized'}.
Output ONLY a valid JSON object with keys "title" and "description".
Example:
{
  "title": "SHIBUYA REBEL 240 GSM BOXY TEE",
  "description": "Crafted from heavy 240 GSM combed cotton with bio-wash finish and authentic high-density Japanese street calligraphy."
}`;

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate a title and description for an authentic ${category || 'oversized'} drop. Detail context: ${prompt || 'Japanese streetwear artwork'}` }
          ],
          temperature: 0.7
        })
      });

      const groqData = await groqRes.json();
      const rawText = groqData.choices?.[0]?.message?.content || '';

      let parsed = null;
      try {
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        parsed = {
          title: 'SHIBUYA CYPHER 240 GSM OVERSIZED TEE',
          description: 'Crafted from heavy 240 GSM combed bio-washed cotton with high-density Tokyo streetwear artwork.'
        };
      }

      return res.status(200).json({ success: true, result: parsed });
    }

    // 2. Generate Graphic / Model Image
    if (action === 'generate-image') {
      const curatedGraphics = [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80'
      ];
      return res.status(200).json({
        success: true,
        imageUrl: curatedGraphics[Math.floor(Math.random() * curatedGraphics.length)]
      });
    }

    return res.status(400).json({ success: false, error: 'Invalid action' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
