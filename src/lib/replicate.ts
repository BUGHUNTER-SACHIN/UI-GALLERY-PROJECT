// Replicate API integration for AI image conversion

const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN || '';
const API_URL = import.meta.env.VITE_AI_PROXY_URL || 'http://localhost:3000';

export interface ConversionOptions {
    style: string;
    strength?: number; // 0-100
}

export interface ConversionResult {
    success: boolean;
    imageUrl?: string;
    error?: string;
    processingTime?: number;
}

export const convertImage = async (
    imageFile: File,
    options: ConversionOptions
): Promise<ConversionResult> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('style', options.style);
    if (options.strength !== undefined) {
        formData.append('strength', options.strength.toString());
    }

    try {
        const startTime = Date.now();

        const response = await fetch(`${API_URL}/api/convert`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Conversion failed: ${response.statusText}`);
        }

        const data = await response.json();
        const processingTime = Math.round((Date.now() - startTime) / 1000);

        return {
            success: true,
            imageUrl: data.output,
            processingTime,
        };
    } catch (error) {
        console.error('Replicate API error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

// Model configurations for different styles
export const styleModels: Record<string, { model: string; prompt?: string }> = {
    cartoon: {
        model: 'fofr/face-to-sticker',
    },
    anime: {
        model: 'cjwbw/anything-v3.0',
        prompt: 'anime style, high quality',
    },
    sketch: {
        model: 'jagilley/controlnet-scribble',
    },
    'oil-painting': {
        model: 'stability-ai/stable-diffusion',
        prompt: 'oil painting style',
    },
    watercolor: {
        model: 'stability-ai/stable-diffusion',
        prompt: 'watercolor painting style',
    },
    'pixel-art': {
        model: 'stability-ai/stable-diffusion',
        prompt: 'pixel art style, 8-bit',
    },
    '3d-render': {
        model: 'stability-ai/stable-diffusion',
        prompt: '3D render, octane render',
    },
    comic: {
        model: 'stability-ai/stable-diffusion',
        prompt: 'comic book style',
    },
};
