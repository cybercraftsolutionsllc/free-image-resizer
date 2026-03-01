import { useState } from 'react';
import { resizeImage, dataURLtoBlob, downloadBlob } from '../utils/resizer';

const FORMATS = [
  { value: 'png', label: 'PNG', quality: 1 },
  { value: 'jpg', label: 'JPG', quality: 0.95 },
  { value: 'webp', label: 'WebP', quality: 0.95 },
];

export default function ExportPanel({ image, width, height, originalFilename }) {
  const [format, setFormat] = useState('png');
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    if (!image) return;
    setExporting(true);

    // Use requestAnimationFrame to let the UI update before heavy work
    requestAnimationFrame(() => {
      try {
        const fmt = FORMATS.find((f) => f.value === format);
        const dataURL = resizeImage(image, width, height, format, fmt.quality);
        const blob = dataURLtoBlob(dataURL);
        const baseName = originalFilename.replace(/\.[^.]+$/, '');
        downloadBlob(blob, `${baseName}-${width}x${height}.${format}`);
      } finally {
        setExporting(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Export</h3>

      <div className="flex gap-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.value}
            onClick={() => setFormat(fmt.value)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
              format === fmt.value
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleExport}
        disabled={!image || exporting}
        className="w-full py-3 rounded-xl font-semibold text-gray-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {exporting ? 'Processing…' : 'Download Resized Image'}
      </button>
    </div>
  );
}
