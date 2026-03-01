/**
 * Multi-step downscale algorithm for better image quality.
 * Instead of resizing directly to the target size, we halve the dimensions
 * repeatedly until we're close, then do one final resize. This preserves
 * sharpness and avoids aliasing artifacts.
 */
export function resizeImage(img, targetWidth, targetHeight, format, quality) {
  let { width, height } = getDimensions(img);
  let currentSource = img;

  // Step down by halves until within 2x of target
  while (width / 2 >= targetWidth && height / 2 >= targetHeight) {
    width = Math.round(width / 2);
    height = Math.round(height / 2);
    const step = drawToCanvas(currentSource, width, height);
    currentSource = step;
  }

  // Final draw to exact target size
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(currentSource, 0, 0, targetWidth, targetHeight);

  const mimeType = formatToMime(format);
  return canvas.toDataURL(mimeType, quality);
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
