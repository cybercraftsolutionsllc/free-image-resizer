// ── Social Media ────────────────────────────────────────────────
export const socialPresets = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Twitter/X Header', width: 1500, height: 500 },
  { name: 'Twitter/X Post', width: 1600, height: 900 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'YouTube Banner', width: 2560, height: 1440 },
  { name: 'LinkedIn Banner', width: 1584, height: 396 },
  { name: 'TikTok Video', width: 1080, height: 1920 },
  { name: 'Pinterest Pin', width: 1000, height: 1500 },
  { name: 'Twitch Banner', width: 1200, height: 480 },
];

// ── Print ───────────────────────────────────────────────────────
export const printPresets = [
  { name: 'A4 (300 DPI)', width: 2480, height: 3508 },
  { name: 'A5 (300 DPI)', width: 1748, height: 2480 },
  { name: 'US Letter (300 DPI)', width: 2550, height: 3300 },
  { name: 'Business Card', width: 1050, height: 600 },
  { name: '4×6 Photo', width: 1200, height: 1800 },
  { name: '5×7 Photo', width: 1500, height: 2100 },
  { name: 'Poster 18×24', width: 5400, height: 7200 },
];

// ── Presentation / Ads ──────────────────────────────────────────
export const presentationPresets = [
  { name: 'Presentation 16:9', width: 1920, height: 1080 },
  { name: 'Presentation 4:3', width: 1024, height: 768 },
  { name: 'Google Display Ad', width: 300, height: 250 },
  { name: 'Leaderboard Ad', width: 728, height: 90 },
  { name: 'Banner Ad', width: 468, height: 60 },
  { name: 'Email Header', width: 600, height: 200 },
  { name: 'Open Graph', width: 1200, height: 630 },
];

// ── Quick Scale ─────────────────────────────────────────────────
export const scaleOptions = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
  { label: '300%', value: 3 },
];

// ── Crop Aspect Ratios ─────────────────────────────────────────
export const cropAspects = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
  { label: '2:3', value: 2 / 3 },
  { label: '3:4', value: 3 / 4 },
];
