import { useState } from 'react';
import { resizeImage, dataURLtoBlob, downloadBlob } from '../utils/resizer';

const FORMATS = [
  { value: 'png', label: 'PNG', hasQuality: false },
  { value: 'jpg', label: 'JPG', hasQuality: true },
  { value: 'webp', label: 'WebP', hasQuality: true },
];

export default function ExportPanel({
  image,
  width,
  height,
  originalFilename,
  fitMode,
  bgColor,
  cropRegion,
}) {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(92);
  const [exporting, setExporting] = useState(false);

  const currentFmt = FORMATS.find((f) => f.value === format);
  const showQuality = currentFmt?.hasQuality;

  const handleExport = () => {
    if (!image) return;
    setExporting(true);

    requestAnimationFrame(() => {
      try {
        const q = showQuality ? quality / 100 : 1;
        const dataURL = resizeImage(image, width, height, format, q, {
          fitMode,
          bgColor,
          cropRegion,
        });
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

      {/* Format picker */}
      <div className="flex gap-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.value}
            onClick={() => setFormat(fmt.value)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${format === fmt.value
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10'
                : 'border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* Quality slider */}
      {showQuality && (
        <div className="space-y-1 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Quality</span>
            <span className="text-xs font-mono text-cyan-400">{quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
            className="w-full quality-slider"
          />
          <div className="flex justify-between text-[10px] text-gray-600">
            <span>Smaller file</span>
            <span>Higher quality</span>
          </div>
        </div>
      )}

      {/* Download button */}
      <button
        onClick={handleExport}
        disabled={!image || exporting}
        className="relative w-full py-3 rounded-xl font-semibold text-gray-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {exporting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resized Image
            </>
          )}
        </span>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </div>
  );
}
