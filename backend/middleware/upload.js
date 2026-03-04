// Simple base64 media handler - no external dependencies needed
export const handleMediaUpload = (base64Data) => {
  return {
    success: true,
    data: base64Data,
    // Or you can use cloud storage like AWS S3, Cloudinary, etc.
  };
};

export default { handleMediaUpload };

