import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Replicate from 'replicate';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Initialize Replicate
const apiToken = process.env.REPLICATE_API_TOKEN || '';
console.log('🔑 Replicate API Token loaded:', apiToken ? `${apiToken.substring(0, 10)}...` : 'NOT FOUND');

const replicate = new Replicate({
  auth: apiToken,
});

// Rate limiting map (simple in-memory)
const rateLimits = new Map<string, number[]>();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || [];
  const recentRequests = userLimits.filter((time: number) => now - time < 3600000); // 1 hour

  if (recentRequests.length >= 10) {
    return false;
  }

  recentRequests.push(now);
  rateLimits.set(userId, recentRequests);
  return true;
};

// AI Conversion endpoint
app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    const { style, strength = 70 } = req.body;
    const userIdHeader = req.headers['x-user-id'];
    const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : (userIdHeader || 'anonymous');

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return res.status(429).json({ error: 'Rate limit exceeded. Max 10 conversions per hour.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Read uploaded file
    const imageBuffer = await fs.readFile(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

    let output;
    const styleStrength = parseInt(strength) / 100;

    // Different models for different styles
    switch (style) {
      case 'cartoon':
        output = await replicate.run(
          "fofr/face-to-sticker:764d4827ea159608a07cdde8ddf1c6000019627515eb02b6b449695fd547e5ef",
          { input: { image: base64Image } }
        );
        break;

      case 'anime':
        output = await replicate.run(
          "cjwbw/anything-v3.0:bc62661d76e1c5a14c81b9a0b5c4e6c3d7f06f6c5b25e7e5eb5e5a2b5c4e6c3d",
          {
            input: {
              image: base64Image,
              prompt: "anime style, high quality",
              strength: styleStrength
            }
          }
        );
        break;

      default:
        // Use Stable Diffusion for other styles
        const prompts: Record<string, string> = {
          'sketch': 'pencil sketch, black and white drawing',
          'oil-painting': 'oil painting, impressionist style',
          'watercolor': 'watercolor painting, soft colors',
          'pixel-art': 'pixel art, 8-bit style',
          '3d-render': '3D render, octane render, high quality',
          'comic': 'comic book style, ink drawing'
        };

        output = await replicate.run(
          "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
          {
            input: {
              image: base64Image,
              prompt: prompts[style as string] || style,
              strength: styleStrength
            }
          }
        );
    }

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({
      output: Array.isArray(output) ? output[0] : output,
      style,
      processingTime: Date.now()
    });

  } catch (error) {
    console.error('Conversion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
    res.status(500).json({ error: errorMessage });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Converter server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/convert - AI image conversion`);
  console.log(`   GET  /api/health - Health check`);
});
