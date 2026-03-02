import { useState, useRef, useCallback, useEffect } from 'react';
import { cropAspects } from '../utils/presets';

export default function CropEditor({ image, cropRegion, onCropChange, onClose }) {
    const containerRef = useRef(null);
    const [dragging, setDragging] = useState(null); // null | 'move' | edge key
    const [dragStart, setDragStart] = useState(null);
    const [aspect, setAspect] = useState(null);

    // Default crop to full image
    const crop = cropRegion || { x: 0.05, y: 0.05, w: 0.9, h: 0.9 };

    const getContainerRect = useCallback(() => {
        return containerRef.current?.getBoundingClientRect();
    }, []);

    // Clamp helper
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const handlePointerDown = useCallback(
        (e, type) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(type);
            setDragStart({ px: e.clientX, py: e.clientY, crop: { ...crop } });
        },
        [crop],
    );

    const handlePointerMove = useCallback(
        (e) => {
            if (!dragging || !dragStart) return;
            const rect = getContainerRect();
            if (!rect) return;

            const dx = (e.clientX - dragStart.px) / rect.width;
            const dy = (e.clientY - dragStart.py) / rect.height;
            const prev = dragStart.crop;
            let next = { ...prev };

            if (dragging === 'move') {
                next.x = clamp(prev.x + dx, 0, 1 - prev.w);
                next.y = clamp(prev.y + dy, 0, 1 - prev.h);
            } else {
                // Handle edge/corner dragging
                if (dragging.includes('w')) {
                    const newX = clamp(prev.x + dx, 0, prev.x + prev.w - 0.05);
                    next.w = prev.w - (newX - prev.x);
                    next.x = newX;
                }
                if (dragging.includes('e')) {
                    next.w = clamp(prev.w + dx, 0.05, 1 - prev.x);
                }
                if (dragging.includes('n')) {
                    const newY = clamp(prev.y + dy, 0, prev.y + prev.h - 0.05);
                    next.h = prev.h - (newY - prev.y);
                    next.y = newY;
                }
                if (dragging.includes('s')) {
                    next.h = clamp(prev.h + dy, 0.05, 1 - prev.y);
                }

                // Enforce aspect ratio
                if (aspect) {
                    const imgW = image.naturalWidth || image.width;
                    const imgH = image.naturalHeight || image.height;
                    const pixelAspect = (next.w * imgW) / (next.h * imgH);
                    if (pixelAspect > aspect) {
                        next.w = (next.h * imgH * aspect) / imgW;
                    } else {
                        next.h = (next.w * imgW) / (aspect * imgH);
                    }
                    // Re-clamp after aspect enforcement
                    next.w = clamp(next.w, 0.05, 1 - next.x);
                    next.h = clamp(next.h, 0.05, 1 - next.y);
                }
            }

            onCropChange(next);
        },
        [dragging, dragStart, aspect, image, onCropChange, getContainerRect],
    );

    const handlePointerUp = useCallback(() => {
        setDragging(null);
        setDragStart(null);
    }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
            return () => {
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('pointerup', handlePointerUp);
            };
        }
    }, [dragging, handlePointerMove, handlePointerUp]);

    if (!image) return null;

    const handles = [
        { key: 'nw', style: { top: '0%', left: '0%', cursor: 'nwse-resize' } },
        { key: 'ne', style: { top: '0%', right: '0%', cursor: 'nesw-resize' } },
        { key: 'sw', style: { bottom: '0%', left: '0%', cursor: 'nesw-resize' } },
        { key: 'se', style: { bottom: '0%', right: '0%', cursor: 'nwse-resize' } },
        { key: 'n', style: { top: '0%', left: '50%', cursor: 'ns-resize', transform: 'translateX(-50%)' } },
        { key: 's', style: { bottom: '0%', left: '50%', cursor: 'ns-resize', transform: 'translateX(-50%)' } },
        { key: 'w', style: { top: '50%', left: '0%', cursor: 'ew-resize', transform: 'translateY(-50%)' } },
        { key: 'e', style: { top: '50%', right: '0%', cursor: 'ew-resize', transform: 'translateY(-50%)' } },
    ];

    return (
        <div className="space-y-3 animate-fadeIn">
            {/* Aspect ratio presets */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Aspect:</span>
                {cropAspects.map((a) => (
                    <button
                        key={a.label}
                        onClick={() => setAspect(a.value)}
                        className={`px-2 py-1 text-xs rounded-lg border transition-colors ${aspect === a.value
                                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                                : 'border-gray-700 text-gray-500 hover:border-gray-500'
                            }`}
                    >
                        {a.label}
                    </button>
                ))}
            </div>

            {/* Crop overlay */}
            <div
                ref={containerRef}
                className="relative overflow-hidden rounded-lg bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px] border border-gray-700 select-none"
                style={{ touchAction: 'none' }}
            >
                <img
                    src={image.src}
                    alt="Crop preview"
                    className="w-full block"
                    style={{ maxHeight: 400, objectFit: 'contain' }}
                    draggable={false}
                />

                {/* Dark mask — four rectangles around the crop area */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
              linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))`,
                        clipPath: `polygon(
              0 0, 100% 0, 100% 100%, 0 100%,
              0 ${crop.y * 100}%,
              ${crop.x * 100}% ${crop.y * 100}%,
              ${crop.x * 100}% ${(crop.y + crop.h) * 100}%,
              0 ${(crop.y + crop.h) * 100}%,
              0 0,
              100% 0, 100% 100%, 0 100%,
              0 0
            )`,
                    }}
                />

                {/* Crop box */}
                <div
                    className="absolute border-2 border-cyan-400 rounded-sm"
                    style={{
                        left: `${crop.x * 100}%`,
                        top: `${crop.y * 100}%`,
                        width: `${crop.w * 100}%`,
                        height: `${crop.h * 100}%`,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                        cursor: 'move',
                    }}
                    onPointerDown={(e) => handlePointerDown(e, 'move')}
                >
                    {/* Rule-of-thirds grid */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-cyan-400/20" />
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-cyan-400/20" />
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-cyan-400/20" />
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-cyan-400/20" />
                    </div>

                    {/* Drag handles */}
                    {handles.map((h) => (
                        <div
                            key={h.key}
                            className="absolute w-3 h-3 bg-cyan-400 rounded-full border-2 border-gray-900 shadow-lg z-10"
                            style={{ ...h.style, margin: '-6px' }}
                            onPointerDown={(e) => handlePointerDown(e, h.key)}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Crop: {Math.round(crop.w * 100)}% × {Math.round(crop.h * 100)}%
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => onCropChange({ x: 0, y: 0, w: 1, h: 1 })}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs rounded-lg bg-cyan-400/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
