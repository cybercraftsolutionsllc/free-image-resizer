import { useState } from 'react';

const MODES = [
    {
        value: 'cover',
        label: 'Cover',
        desc: 'Fill canvas, crop overflow',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="1" y="6" width="22" height="12" rx="1" strokeDasharray="3 2" />
            </svg>
        ),
    },
    {
        value: 'contain',
        label: 'Contain',
        desc: 'Fit inside, add padding',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="6" y="5" width="12" height="14" rx="1" />
            </svg>
        ),
    },
    {
        value: 'fill',
        label: 'Stretch',
        desc: 'Force exact dimensions',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 12h8M12 8v8" strokeLinecap="round" />
            </svg>
        ),
    },
];

export default function FitModeSelector({ fitMode, bgColor, onModeChange, onBgColorChange }) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Fit Mode</h3>

            <div className="grid grid-cols-3 gap-2">
                {MODES.map((m) => (
                    <button
                        key={m.value}
                        onClick={() => onModeChange(m.value)}
                        className={`relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all duration-200 ${fitMode === m.value
                                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-lg shadow-cyan-400/10'
                                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {m.icon}
                        <span className="text-xs font-medium">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Tooltips */}
            <p className="text-xs text-gray-500">
                {MODES.find((m) => m.value === fitMode)?.desc}
            </p>

            {/* Background colour picker for contain mode */}
            {fitMode === 'contain' && (
                <div className="flex items-center gap-3 animate-fadeIn">
                    <span className="text-xs text-gray-400">Padding colour</span>
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="w-7 h-7 rounded-lg border-2 border-gray-600 hover:border-cyan-400 transition-colors shadow-inner"
                        style={{ backgroundColor: bgColor }}
                        title="Choose background colour"
                    />
                    {showPicker && (
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => onBgColorChange(e.target.value)}
                            className="w-8 h-8 bg-transparent cursor-pointer"
                        />
                    )}
                </div>
            )}
        </div>
    );
}
