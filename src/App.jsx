import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const CLOUD_RUN_URL = import.meta.env.VITE_CLOUD_RUN_URL;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(`${CLOUD_RUN_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',  // Important: This tells axios to treat the response as binary data
      });
      
      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Error processing the image');
      setResultImage(null);
    }
  };

  return (
    <div className="root">
      <h1>Image Upload and Object Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload and Detect</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {resultImage && (
        <div>
          <h2>Detection Result:</h2>
          <img src={resultImage} alt="Detection Result" style={{maxWidth: '100%'}} />
        </div>
      )}
    </div>
  );
}

export default App;