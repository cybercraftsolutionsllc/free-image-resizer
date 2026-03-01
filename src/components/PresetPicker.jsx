import { socialPresets } from '../utils/presets';

export default function PresetPicker({ onSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Social Media Presets</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {socialPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset.width, preset.height)}
            className="text-left px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-cyan-400 transition-colors group"
          >
            <span className="block text-sm text-gray-200 group-hover:text-cyan-400">{preset.name}</span>
            <span className="block text-xs text-gray-500">
              {preset.width} × {preset.height}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
