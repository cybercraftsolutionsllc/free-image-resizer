import { useState, useCallback } from 'react';
import DropZone from './components/DropZone';
import ImagePreview from './components/ImagePreview';
import ResizeControls from './components/ResizeControls';
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

  const handleImageLoad = useCallback((img, name) => {
    setImage(img);
    setFilename(name);
    setOriginalWidth(img.naturalWidth);
    setOriginalHeight(img.naturalHeight);
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
    setAspectLocked(true);
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">
              Free Image Resizer
            </h1>
          </div>
          <span className="text-xs text-gray-500 hidden sm:block">
            100% client-side — your images never leave your browser
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {!image ? (
            <DropZone onImageLoad={handleImageLoad} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-200 truncate max-w-xs">{filename}</h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-400 hover:text-gray-200 underline"
                >
                  Upload a different image
                </button>
              </div>

              <div className="grid lg:grid-cols-[1fr_340px] gap-8">
                {/* Left column — preview */}
                <ImagePreview
                  image={image}
                  originalWidth={originalWidth}
                  originalHeight={originalHeight}
                  targetWidth={width}
                  targetHeight={height}
                />

                {/* Right column — controls */}
                <div className="space-y-6">
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

                  <PresetPicker onSelect={handlePresetSelect} />

                  <ExportPanel
                    image={image}
                    width={width}
                    height={height}
                    originalFilename={filename}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 text-center text-xs text-gray-600">
        Open source &middot; MIT License &middot; No data leaves your browser
      </footer>
    </div>
  );
}
