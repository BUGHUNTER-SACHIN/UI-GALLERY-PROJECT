export const applyFilters = (canvas, sourceCanvas, filters) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(sourceCanvas, 0, 0);
  const filterString = `
        brightness(${100 + filters.brightness}%)
        contrast(${100 + filters.contrast}%)
        saturate(${100 + filters.saturation}%)
        blur(${filters.blur}px)
        hue-rotate(${filters.hue}deg)
    `.trim().replace(/\s+/g, " ");
  ctx.filter = filterString;
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.filter = "none";
};
export const applyPresetFilter = (canvas, sourceCanvas, filterName) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(sourceCanvas, 0, 0);
  switch (filterName) {
    case "grayscale":
      ctx.filter = "grayscale(100%)";
      break;
    case "sepia":
      ctx.filter = "sepia(100%)";
      break;
    case "vintage":
      ctx.filter = "sepia(50%) contrast(110%) brightness(110%)";
      break;
    case "cool":
      ctx.filter = "saturate(150%) hue-rotate(180deg)";
      break;
    case "warm":
      ctx.filter = "saturate(120%) sepia(30%)";
      break;
    default:
      ctx.filter = "none";
  }
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.filter = "none";
};
export const rotateImage = (canvas, sourceImage, angle) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rad = angle * Math.PI / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newWidth = sourceImage.width * cos + sourceImage.height * sin;
  const newHeight = sourceImage.width * sin + sourceImage.height * cos;
  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rad);
  ctx.drawImage(sourceImage, -sourceImage.width / 2, -sourceImage.height / 2);
};
export const flipImage = (canvas, sourceImage, horizontal, vertical) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(
    sourceImage,
    horizontal ? -canvas.width : 0,
    vertical ? -canvas.height : 0
  );
  ctx.restore();
};
export const downloadImage = (canvas, filename) => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
};
