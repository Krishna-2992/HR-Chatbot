import React, { useState } from "react";

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null); // Clear previous results
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Starting upload...");
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("file content: ", result.file_content);
      setUploadResult(result);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>File Upload</h2>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        disabled={uploading}
      />

      {file && <p>Selected: {file.name}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          backgroundColor: uploading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploadResult && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#d4edda",
            borderRadius: "4px",
          }}
        >
          <h3>Upload Successful!</h3>
          <p>
            <strong>File:</strong> {uploadResult.filename}
          </p>
          <p>
            <strong>S3 Key:</strong> {uploadResult.s3_key}
          </p>
          <p>
            <strong>Size:</strong> {uploadResult.file_size} bytes
          </p>
          {uploadResult.s3_url && (
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={uploadResult.s3_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View File
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
