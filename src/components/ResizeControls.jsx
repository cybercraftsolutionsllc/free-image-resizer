import { scaleOptions } from '../utils/presets';

export default function ResizeControls({
  width,
  height,
  originalWidth,
  originalHeight,
  aspectLocked,
  onWidthChange,
  onHeightChange,
  onToggleAspectLock,
}) {
  const aspectRatio = originalWidth / originalHeight;

  const handleWidthChange = (val) => {
    const w = Math.max(1, parseInt(val, 10) || 1);
    onWidthChange(w);
    if (aspectLocked) {
      onHeightChange(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val) => {
    const h = Math.max(1, parseInt(val, 10) || 1);
    onHeightChange(h);
    if (aspectLocked) {
      onWidthChange(Math.round(h * aspectRatio));
    }
  };

  const handleScale = (factor) => {
    const w = Math.round(originalWidth * factor);
    const h = Math.round(originalHeight * factor);
    onWidthChange(w);
    onHeightChange(h);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Dimensions</h3>

      <div className="flex items-end gap-3">
        <label className="flex-1">
          <span className="block text-xs text-gray-400 mb-1">Width (px)</span>
          <input
            type="number"
            min={1}
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
        </label>

        <button
          onClick={onToggleAspectLock}
          title={aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          className={`mb-1 p-2 rounded-lg border transition-all duration-200 ${aspectLocked
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10'
              : 'border-gray-600 text-gray-500 hover:border-gray-400'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {aspectLocked ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            )}
          </svg>
        </button>

        <label className="flex-1">
          <span className="block text-xs text-gray-400 mb-1">Height (px)</span>
          <input
            type="number"
            min={1}
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
        </label>
      </div>

      <div>
        <span className="block text-xs text-gray-400 mb-2">Quick Scale</span>
        <div className="flex flex-wrap gap-2">
          {scaleOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleScale(opt.value)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-200"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
