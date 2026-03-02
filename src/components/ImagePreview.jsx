import { useRef, useEffect } from 'react';
import { renderPreview } from '../utils/resizer';

export default function ImagePreview({
  image,
  originalWidth,
  originalHeight,
  targetWidth,
  targetHeight,
  fitMode,
  bgColor,
  cropRegion,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    renderPreview(canvasRef.current, image, targetWidth, targetHeight, {
      fitMode,
      bgColor,
      cropRegion,
    });
  }, [image, targetWidth, targetHeight, fitMode, bgColor, cropRegion]);

  if (!image) return null;

  const ratio = targetWidth && targetHeight ? (targetWidth / targetHeight).toFixed(2) : '—';
  const percent =
    originalWidth && originalHeight
      ? Math.round(((targetWidth * targetHeight) / (originalWidth * originalHeight)) * 100)
      : 100;

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm text-gray-400 flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Original: {originalWidth} × {originalHeight}px
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Target: {targetWidth} × {targetHeight}px
          <span className="text-gray-600">({ratio})</span>
        </span>
      </div>

      {/* Size change badge */}
      <div className="flex gap-2 flex-wrap">
        <span
          className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium ${percent > 100
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : percent < 100
                ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30'
                : 'bg-gray-700/50 text-gray-400 border border-gray-600'
            }`}
        >
          {percent > 100 ? '↑' : percent < 100 ? '↓' : '='} {percent}% of original
        </span>
        <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-gray-700/50 text-gray-400 border border-gray-600 capitalize">
          {fitMode}
        </span>
      </div>

      {/* Canvas preview */}
      <div className="relative overflow-hidden rounded-xl bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px] border border-gray-700 flex items-center justify-center p-4 min-h-[200px]">
        <canvas
          ref={canvasRef}
          className="max-w-full rounded-lg shadow-2xl shadow-black/40 transition-all duration-300"
          style={{ maxHeight: 400 }}
        />
      </div>

      <p className="text-xs text-gray-500 text-center">
        Live preview — what you see is what you'll export
      </p>
    </div>
  );
}
