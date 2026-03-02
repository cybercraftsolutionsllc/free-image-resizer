/**
 * Canva-style image resizer with fit modes and optional crop.
 *
 * Fit modes:
 *   - cover:   scale to fill target, centre-crop overflow (no distortion, no empty space)
 *   - contain: scale to fit inside target, pad remaining area with bgColor
 *   - fill:    stretch to exact target dimensions (legacy behaviour)
 *
 * If a cropRegion { x, y, w, h } is provided (normalised 0–1), the image is
 * cropped to that region first before any resize logic runs.
 */

export function resizeImage(
  img,
  targetWidth,
  targetHeight,
  format,
  quality,
  { fitMode = 'cover', bgColor = '#000000', cropRegion = null } = {},
) {
  let source = img;

  // ── Step 1: Apply crop if specified ───────────────────────────
  if (cropRegion) {
    const srcW = source.naturalWidth || source.width;
    const srcH = source.naturalHeight || source.height;
    const cx = Math.round(cropRegion.x * srcW);
    const cy = Math.round(cropRegion.y * srcH);
    const cw = Math.round(cropRegion.w * srcW);
    const ch = Math.round(cropRegion.h * srcH);
    source = drawCropped(source, cx, cy, cw, ch);
  }

  // ── Step 2: Resize using selected fit mode ────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const srcW = source.naturalWidth || source.width;
  const srcH = source.naturalHeight || source.height;

  if (fitMode === 'contain') {
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Scale to fit inside, centre the image
    const scale = Math.min(targetWidth / srcW, targetHeight / srcH);
    const dw = Math.round(srcW * scale);
    const dh = Math.round(srcH * scale);
    const dx = Math.round((targetWidth - dw) / 2);
    const dy = Math.round((targetHeight - dh) / 2);

    // Multi-step downscale for quality
    const stepped = stepDown(source, dw, dh);
    ctx.drawImage(stepped, dx, dy, dw, dh);
  } else if (fitMode === 'cover') {
    // Scale to cover entire canvas, centre-crop overflow
    const scale = Math.max(targetWidth / srcW, targetHeight / srcH);
    const dw = Math.round(srcW * scale);
    const dh = Math.round(srcH * scale);
    const dx = Math.round((targetWidth - dw) / 2);
    const dy = Math.round((targetHeight - dh) / 2);

    const stepped = stepDown(source, dw, dh);
    ctx.drawImage(stepped, dx, dy, dw, dh);
  } else {
    // fill — legacy stretch
    const stepped = stepDown(source, targetWidth, targetHeight);
    ctx.drawImage(stepped, 0, 0, targetWidth, targetHeight);
  }

  const mimeType = formatToMime(format);
  return canvas.toDataURL(mimeType, quality);
}

/**
 * Generate a live preview on a supplied canvas element.
 */
export function renderPreview(
  canvas,
  img,
  targetWidth,
  targetHeight,
  { fitMode = 'cover', bgColor = '#000000', cropRegion = null } = {},
) {
  if (!canvas || !img) return;

  let source = img;

  if (cropRegion) {
    const srcW = source.naturalWidth || source.width;
    const srcH = source.naturalHeight || source.height;
    const cx = Math.round(cropRegion.x * srcW);
    const cy = Math.round(cropRegion.y * srcH);
    const cw = Math.round(cropRegion.w * srcW);
    const ch = Math.round(cropRegion.h * srcH);
    source = drawCropped(source, cx, cy, cw, ch);
  }

  // Size the canvas to show a scaled-down preview that fits in the UI
  const maxPreviewW = canvas.parentElement?.clientWidth || 600;
  const maxPreviewH = 400;
  const previewScale = Math.min(1, maxPreviewW / targetWidth, maxPreviewH / targetHeight);
  const pW = Math.round(targetWidth * previewScale);
  const pH = Math.round(targetHeight * previewScale);
  canvas.width = pW;
  canvas.height = pH;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, pW, pH);

  const srcW = source.naturalWidth || source.width;
  const srcH = source.naturalHeight || source.height;

  if (fitMode === 'contain') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, pW, pH);

    const scale = Math.min(pW / srcW, pH / srcH);
    const dw = Math.round(srcW * scale);
    const dh = Math.round(srcH * scale);
    const dx = Math.round((pW - dw) / 2);
    const dy = Math.round((pH - dh) / 2);
    ctx.drawImage(source, dx, dy, dw, dh);
  } else if (fitMode === 'cover') {
    const scale = Math.max(pW / srcW, pH / srcH);
    const dw = Math.round(srcW * scale);
    const dh = Math.round(srcH * scale);
    const dx = Math.round((pW - dw) / 2);
    const dy = Math.round((pH - dh) / 2);
    ctx.drawImage(source, dx, dy, dw, dh);
  } else {
    ctx.drawImage(source, 0, 0, pW, pH);
  }
}

// ── Helpers ──────────────────────────────────────────────────────

function drawCropped(source, x, y, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(source, x, y, w, h, 0, 0, w, h);
  return c;
}

/**
 * Multi-step downscale — halve dimensions repeatedly until close to target,
 * then do one final draw. Preserves sharpness and avoids aliasing.
 */
function stepDown(source, targetW, targetH) {
  let { width, height } = getDimensions(source);
  let current = source;

  while (width / 2 >= targetW && height / 2 >= targetH) {
    width = Math.round(width / 2);
    height = Math.round(height / 2);
    current = drawToCanvas(current, width, height);
  }

  return current;
}

function drawToCanvas(source, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);
  return c;
}

function getDimensions(img) {
  return { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
}

function formatToMime(format) {
  const map = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };
  return map[format] || 'image/png';
}

export function dataURLtoBlob(dataURL) {
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
