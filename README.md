# Free Image Resizer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A free, open-source, browser-based image resizer — resize, scale, and export images without uploading anything to a server.

> **No data leaves your browser.** All processing happens 100% client-side using the Canvas API.

![Screenshot placeholder](https://via.placeholder.com/800x450?text=Screenshot+Coming+Soon)

## Features

- Drag & drop or click to upload (JPG, PNG, WebP, GIF, BMP, SVG)
- Custom width/height with lockable aspect ratio
- Quick scale buttons (25%, 50%, 75%, 100%, 150%, 200%)
- Social media presets (Instagram, Facebook, Twitter, YouTube, LinkedIn)
- Multi-step downscaling algorithm for high-quality output
- Export as PNG, JPG, or WebP
- Dark theme UI
- Mobile responsive

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/free-image-resizer/](http://localhost:5173/free-image-resizer/) in your browser.

## Build

```bash
npm run build
```

The production build is output to `dist/`.

## Deployment

This project deploys automatically to GitHub Pages via the included GitHub Actions workflow on every push to `main`.

To enable it: go to **Settings → Pages → Source → GitHub Actions**.

## License

[MIT](LICENSE)
