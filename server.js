// FILE: server.js (Root folder)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using flash for speed
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(buffer, mimeType) {
    return { inlineData: { data: buffer.toString("base64"), mimeType } };
}

/**
 * POST /api/convert-image
 * Receives imageFile and a 'stylePrompt' text field.
 */
app.post('/api/convert-image', upload.single('imageFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image file provided.' });
        }

        // 1. Get the user's written instruction from the frontend
        const userStyleInstructions = req.body.stylePrompt;

        if (!userStyleInstructions || userStyleInstructions.trim() === "") {
             return res.status(400).json({ success: false, error: 'Please provide style instructions.' });
        }

        console.log("Processing image with Gemini based on user instructions...");

        const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

        // 2. Construct the master prompt for Gemini
        // We tell Gemini to look at the image, read the user's instructions, and create a detailed image generation prompt.
        const masterPrompt = `
You are an expert AI image prompt engineer.
Task: View the provided image. I want to recreate the fundamental subject and composition of this image, BUT apply the following specific style and modifications requested by the user.

User Instructions: "${userStyleInstructions}"

Output: Please generate a single, highly detailed descriptive paragraph that combines the visual elements of the source image with the user's requested style. This paragraph should be ready to paste into a text-to-image model (like Midjourney or Stable Diffusion) to generate the final artwork. Describe lighting, colors, art medium, and background details tailored to the user's request.
`;

        // 3. Call Gemini
        const result = await model.generateContent([masterPrompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini prompt generated successfully.");
        res.json({ success: true, generatedPrompt: text });

    } catch (error) {
        console.error("Error with Gemini:", error);
        res.status(500).json({
            success: false,
            error: error.message || "An internal server error occurred."
        });
    }
});

app.listen(port, () => {
    console.log(`--- AetherGallery Gemini Backend running on http://localhost:${port} ---`);
});