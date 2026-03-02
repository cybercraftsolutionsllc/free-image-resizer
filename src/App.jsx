import { useState, useCallback } from 'react';
import DropZone from './components/DropZone';
import ImagePreview from './components/ImagePreview';
import CropEditor from './components/CropEditor';
import ResizeControls from './components/ResizeControls';
import FitModeSelector from './components/FitModeSelector';
import PresetPicker from './components/PresetPicker';
import ExportPanel from './components/ExportPanel';

export default function App() {
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectLocked, setAspectLocked] = useState(true);

  // New state
  const [fitMode, setFitMode] = useState('cover');
  const [bgColor, setBgColor] = useState('#000000');
  const [cropMode, setCropMode] = useState(false);
  const [cropRegion, setCropRegion] = useState(null);

  const handleImageLoad = useCallback((img, name) => {
    setImage(img);
    setFilename(name);
    setOriginalWidth(img.naturalWidth);
    setOriginalHeight(img.naturalHeight);
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
    setAspectLocked(true);
    setFitMode('cover');
    setCropMode(false);
    setCropRegion(null);
  }, []);

  const handlePresetSelect = (w, h) => {
    setWidth(w);
    setHeight(h);
    setAspectLocked(false);
  };

  const handleReset = () => {
    setImage(null);
    setFilename('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(0);
    setHeight(0);
    setAspectLocked(true);
    setFitMode('cover');
    setBgColor('#000000');
    setCropMode(false);
    setCropRegion(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-panel border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="w-8 h-8" />
              <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-md -z-10" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Free Image Resizer
            </h1>
          </div>
          <span className="text-xs text-gray-500 hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% client-side — your images never leave your browser
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {!image ? (
            <DropZone onImageLoad={handleImageLoad} />
          ) : (
            <>
              {/* File bar */}
              <div className="flex items-center justify-between glass-panel rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-medium text-gray-200 truncate">{filename}</h2>
                </div>
                <button
                  onClick={handleReset}
                  className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New Image
                </button>
              </div>

              {/* Crop editor OR normal layout */}
              {cropMode ? (
                <CropEditor
                  image={image}
                  cropRegion={cropRegion}
                  onCropChange={setCropRegion}
                  onClose={() => setCropMode(false)}
                />
              ) : (
                <div className="grid lg:grid-cols-[1fr_360px] gap-8">
                  {/* Left column — preview */}
                  <ImagePreview
                    image={image}
                    originalWidth={originalWidth}
                    originalHeight={originalHeight}
                    targetWidth={width}
                    targetHeight={height}
                    fitMode={fitMode}
                    bgColor={bgColor}
                    cropRegion={cropRegion}
                  />

                  {/* Right column — controls */}
                  <div className="space-y-6">
                    <div className="glass-panel rounded-xl p-5 space-y-6">
                      <FitModeSelector
                        fitMode={fitMode}
                        bgColor={bgColor}
                        onModeChange={setFitMode}
                        onBgColorChange={setBgColor}
                      />

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                      <ResizeControls
                        width={width}
                        height={height}
                        originalWidth={originalWidth}
                        originalHeight={originalHeight}
                        aspectLocked={aspectLocked}
                        onWidthChange={setWidth}
                        onHeightChange={setHeight}
                        onToggleAspectLock={() => setAspectLocked(!aspectLocked)}
                      />

                      {/* Crop button */}
                      <button
                        onClick={() => setCropMode(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21H3v-4M17 3h4v4M21 17v4h-4M3 7V3h4" />
                        </svg>
                        {cropRegion ? 'Edit Crop' : 'Crop Image'}
                        {cropRegion && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </button>
                    </div>

                    <div className="glass-panel rounded-xl p-5">
                      <PresetPicker onSelect={handlePresetSelect} />
                    </div>

                    <div className="glass-panel rounded-xl p-5">
                      <ExportPanel
                        image={image}
                        width={width}
                        height={height}
                        originalFilename={filename}
                        fitMode={fitMode}
                        bgColor={bgColor}
                        cropRegion={cropRegion}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-4 text-center text-xs text-gray-600">
        Open source &middot; MIT License &middot; No data leaves your browser
      </footer>
    </div>
  );
}
