import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UploadImage ({productId}) {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('productId', productId); // Add the product ID

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/products/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    console.log('Image uploaded:', response.data.message);
    Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Image uploaded successfully'
        })
  } catch (error) {

    console.error('Error uploading image:', error);
    Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: ' Failed to upload image. Please try again'
        })
  }
};


  return (

    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="px-2">Upload</button>
    </div>


  );
};

