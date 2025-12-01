/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AI_PROXY_URL: string
    readonly VITE_CLOUDINARY_CLOUD_NAME: string
    readonly VITE_CLOUDINARY_API_KEY: string
    readonly VITE_CLOUDINARY_UPLOAD_PRESET: string
    readonly VITE_REPLICATE_API_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
