const CLOUDINARY_CLOUD_NAME = "derhhsydm";
const CLOUDINARY_UPLOAD_PRESET = "thispresetunsigned";

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  created_at: string;
  width: number;
  height: number;
  resource_type?: string;
  format?: string;
  category?: string;
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
  // Note: Fetching images requires API key/secret on server-side
  // For this demo, we'll store in localStorage
  const stored = localStorage.getItem("gallery_images");
  return stored ? JSON.parse(stored) : [];
};

export const saveImagesToLocal = (images: CloudinaryImage[]): void => {
  localStorage.setItem("gallery_images", JSON.stringify(images));
};
