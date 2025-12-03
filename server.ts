import express from 'express';
import cors from 'cors';
import multer from 'multer';
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

console.log('🎨 AI Converter - DEMO MODE');
console.log('� Simulating realistic AI conversions');

// Rate limiting map
const rateLimits = new Map<string, number[]>();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || [];
  const recentRequests = userLimits.filter((time: number) => now - time < 3600000);

  if (recentRequests.length >= 50) {
    return false;
  }

  recentRequests.push(now);
  rateLimits.set(userId, recentRequests);
  return true;
};

// Simulate realistic processing delay
const simulateProcessing = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// AI Conversion endpoint (DEMO MODE)
app.post('/api/convert', upload.single('image'), async (req, res) => {
  const startTime = Date.now();

  try {
    const { style, strength = 70 } = req.body;
    const userIdHeader = req.headers['x-user-id'];
    const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : (userIdHeader || 'anonymous');

    console.log(`🎨 [DEMO] Conversion request: style=${style}, strength=${strength}, user=${userId}`);

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return res.status(429).json({ error: 'Rate limit exceeded. Max 50 conversions per hour.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!style) {
      return res.status(400).json({ error: 'No style selected' });
    }

    // Read uploaded file
    const imageBuffer = await fs.readFile(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

    // Simulate realistic AI processing time (3-6 seconds)
    const processingTime = 3000 + Math.random() * 3000;
    console.log(`⏳ [DEMO] Simulating ${Math.round(processingTime / 1000)}s processing...`);
    await simulateProcessing(processingTime);

    // In demo mode, return the original image
    // This makes it feel like it's working while being completely free
    console.log(`✅ [DEMO] Conversion simulated successfully`);
    console.log(`💡 [DEMO] In production, this would return a ${style}-styled image`);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    const totalTime = Date.now() - startTime;

    res.json({
      output: base64Image, // Return original image in demo mode
      style,
      processingTime: totalTime,
      demo: true,
      message: `Demo: Showing original image. In production, this would be converted to ${style} style.`
    });

  } catch (error) {
    console.error('❌ [DEMO] Conversion error:', error);

    // Clean up uploaded file if it exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
    res.status(500).json({ error: errorMessage });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: 'DEMO',
    message: 'Running in demonstration mode - simulates AI conversion'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Converter server running on http://localhost:${PORT}`);
  console.log(`📡 MODE: DEMO (Completely Free)`);
  console.log(`ℹ️  Note: Returns original images with realistic processing delays`);
  console.log(`💡 Tip: Perfect for portfolio demonstrations!\n`);
  console.log(`📡 Endpoints:`);
  console.log(`   POST /api/convert - AI image conversion (demo)`);
  console.log(`   GET  /api/health - Health check\n`);
});
