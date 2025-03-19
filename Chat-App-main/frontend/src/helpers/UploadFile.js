// const URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
// // const URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`;

// const UploadFile = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append("upload_preset", "Chat_app-file");

//   try {
//     const response = await fetch(URL, {
//       method: 'post',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Upload failed: ${response.statusText}`);
//     }

//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     console.error("Error uploading the file:", error);
//     return null;
//   }

  
// };

// export default UploadFile;


const URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;

const UploadFile = async(file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Chat_app-file'); // Ensure this preset matches exactly

  try {
    const response = await fetch(URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json(); // Get detailed error message
      throw new Error(`Upload failed: ${errorData.error?.message}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error uploading the file:', error);
    return null;
  }
};

export default UploadFile;