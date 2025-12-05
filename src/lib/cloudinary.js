const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "derhhsydm";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "thispresetunsigned";
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || "354723296682912";
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";
  console.log(`[Cloudinary] Starting upload for ${file.name} (${resourceType})`);
  console.log(`[Cloudinary] Cloud Name: ${CLOUDINARY_CLOUD_NAME}, Preset: ${CLOUDINARY_UPLOAD_PRESET}`);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Cloudinary] Upload failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to upload file: ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    console.log(`[Cloudinary] Upload successful:`, data);
    return data;
  } catch (error) {
    console.error(`[Cloudinary] Network or other error:`, error);
    throw error;
  }
};
export const deleteFromCloudinary = async (publicId) => {
  console.warn("Delete from Cloudinary requires server-side implementation");
};
export const getCloudinaryImages = async () => {
  try {
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
export const saveImagesToLocal = (images) => {
  try {
    console.log("[Gallery] Saving images to localStorage:", images);
    localStorage.setItem("gallery_images", JSON.stringify(images));
    console.log("[Gallery] Images saved successfully");
    const verification = localStorage.getItem("gallery_images");
    console.log("[Gallery] Verification read:", verification);
  } catch (error) {
    console.error("[Gallery] Error saving images:", error);
  }
};
