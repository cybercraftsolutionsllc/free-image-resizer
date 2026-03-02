import { useState } from 'react';
import { socialPresets, printPresets, presentationPresets } from '../utils/presets';

const TABS = [
  { key: 'social', label: 'Social', icon: '📱', presets: socialPresets },
  { key: 'print', label: 'Print', icon: '🖨️', presets: printPresets },
  { key: 'presentation', label: 'Presentation', icon: '📊', presets: presentationPresets },
];

export default function PresetPicker({ onSelect }) {
  const [tab, setTab] = useState('social');

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Presets</h3>

      {/* Tab bar */}
      <div className="flex rounded-lg bg-gray-800/50 p-1 gap-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${tab === t.key
                ? 'bg-gray-700 text-cyan-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {activeTab?.presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset.width, preset.height)}
            className="text-left px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-400/50 hover:bg-gray-800 transition-all duration-200 group"
          >
            <span className="block text-sm text-gray-200 group-hover:text-cyan-400 transition-colors truncate">
              {preset.name}
            </span>
            <span className="block text-xs text-gray-500">
              {preset.width} × {preset.height}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
