const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "derhhsydm";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "thispresetunsigned";
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || "354723296682912";

export interface CloudinaryImage {
    public_id: string;
    secure_url: string;
    created_at: string;
    width: number;
    height: number;
    resource_type?: string;
    format?: string;
    category?: string;
    isFavorite?: boolean;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryImage> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Determine resource type based on file type
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to upload file");
    }

    return response.json();
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    // Note: Delete requires server-side implementation with API secret
    // For now, we'll just remove from local state
    console.warn("Delete from Cloudinary requires server-side implementation");
};

export const getCloudinaryImages = async (): Promise<CloudinaryImage[]> => {
    try {
        // Get images from localStorage
        const stored = localStorage.getItem("gallery_images");
        console.log("[Gallery] Raw localStorage data:", stored);
        const images = stored ? JSON.parse(stored) : [];
        console.log("[Gallery] Parsed images:", images);
        return images;
    } catch (error) {
        console.error("[Gallery] Error loading images:", error);
        return [];
    }
};

export const saveImagesToLocal = (images: CloudinaryImage[]): void => {
    try {
        console.log("[Gallery] Saving images to localStorage:", images);
        localStorage.setItem("gallery_images", JSON.stringify(images));
        console.log("[Gallery] Images saved successfully");

        // Verify it was saved
        const verification = localStorage.getItem("gallery_images");
        console.log("[Gallery] Verification read:", verification);
    } catch (error) {
        console.error("[Gallery] Error saving images:", error);
    }
};
