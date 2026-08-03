import React from "react";
import { Spinner } from "react-bootstrap";

const ImgUpload = ({ onChange, src, isLoading }) => (
  <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
    <div 
      className="rounded-circle border border-4 border-light d-flex align-items-center justify-content-center overflow-hidden bg-light shadow-sm"
      style={{ width: '128px', height: '128px' }}
    >
      {isLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : src ? (
        <img src={src} alt="Profile" className="w-100 h-100 object-fit-cover" style={{ objectFit: 'cover' }} />
      ) : (
        <span className="text-muted small text-center px-2">
          Upload Image
        </span>
      )}
    </div>
    <input
      id="photo-upload"
      type="file"
      accept="image/*"
      onChange={onChange}
      className="d-none"
    />
  </label>
);

export default ImgUpload;
