// Cloudinary configuration for React app
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
};

// Helper function to upload image using Cloudinary Upload Widget
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    formData.append('folder', 'rotaract-events');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with response:', errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to delete image (requires server-side implementation)
export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    if (imageUrl.includes('cloudinary.com')) {
      // Note: Deletion requires server-side implementation for security
      // For now, we'll just log the deletion request
      console.log('Image deletion requested for:', imageUrl);
      console.log('Note: Implement server-side deletion for production');
    }
  } catch (error) {
    console.error('Error with image deletion:', error);
  }
};
