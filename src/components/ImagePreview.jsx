import { useState } from 'react';

export default function ImagePreview({ image, originalWidth, originalHeight, targetWidth, targetHeight }) {
  const [zoom, setZoom] = useState(false);

  if (!image) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Original: {originalWidth} × {originalHeight}px
        </span>
        <span>
          Target: {targetWidth} × {targetHeight}px
        </span>
      </div>
      <div
        className={`relative overflow-hidden rounded-lg bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px] border border-gray-700 ${
          zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => setZoom(!zoom)}
      >
        <img
          src={image.src}
          alt="Preview"
          className={`mx-auto transition-transform duration-200 ${zoom ? 'scale-150' : 'scale-100'}`}
          style={{ maxHeight: 400, objectFit: 'contain' }}
        />
      </div>
      <p className="text-xs text-gray-500 text-center">Click to {zoom ? 'zoom out' : 'zoom in'}</p>
    </div>
  );
}
