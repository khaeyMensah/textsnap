const canvas = document.getElementById("textCanvas");
const ctx = canvas.getContext("2d");
const textInput = document.getElementById("textInput");
const fontFamily = document.getElementById("fontFamily");
const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");
const textColor = document.getElementById("textColor");
const bgColor = document.getElementById("bgColor");
const textAlign = document.getElementById("textAlign");
const smartSize = document.getElementById("smartSize");
const canvasWidth = document.getElementById("canvasWidth");
const canvasWidthValue = document.getElementById("canvasWidthValue");
const canvasHeight = document.getElementById("canvasHeight");
const canvasHeightValue = document.getElementById("canvasHeightValue");
const manualSizeGroup = document.getElementById("manualSizeGroup");
const manualHeightGroup = document.getElementById("manualHeightGroup");
const downloadBtn = document.getElementById("downloadBtn");

const PADDING = 20; // Padding for text wrapping
const LINE_HEIGHT_RATIO = 1.4; // Line height ratio for readability

function wrapText(text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(currentLine.trim());
      currentLine = words[i] + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
}

function calculateCanvasHeight(lines, fontSize) {
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const totalTextHeight = lines.length * lineHeight;
  return totalTextHeight + PADDING * 2;
}

function updateCanvas() {
  const text = textInput.value || "Hello World!";
  const fontSizeNum = parseInt(fontSize.value);
  const font = `${fontSizeNum}px ${fontFamily.value}`;

  // Set canvas dimensions
  let width, height;

  if (smartSize.checked) {
    width = 360; // Smartphone-friendly width
    const maxWidth = width - PADDING * 2;

    // Set font for text measurement
    ctx.font = font;
    const lines = wrapText(text, maxWidth);
    height = calculateCanvasHeight(lines, fontSizeNum);

    // Update manual controls to reflect smart sizing
    canvasWidth.value = width;
    canvasHeight.value = height;
    canvasWidthValue.textContent = width + "px";
    canvasHeightValue.textContent = Math.round(height) + "px";
  } else {
    width = parseInt(canvasWidth.value);
    height = parseInt(canvasHeight.value);
  }

  canvas.width = width;
  canvas.height = height;

  // Clear canvas with background color
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  ctx.fillStyle = textColor.value;
  ctx.font = font;
  ctx.textAlign = textAlign.value;
  ctx.textBaseline = "top";

  // Calculate text layout
  const maxWidth = width - PADDING * 2;
  const lines = wrapText(text, maxWidth);
  const lineHeight = fontSizeNum * LINE_HEIGHT_RATIO;

  // Calculate starting position based on alignment
  let startX;
  switch (textAlign.value) {
    case "center":
      startX = width / 2;
      break;
    case "right":
      startX = width - PADDING;
      break;
    default: // left
      startX = PADDING;
  }

  const startY = PADDING;

  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, startX, y);
  });
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "text-image.png";
  link.href = canvas.toDataURL();
  link.click();
}

function applyPreset(preset) {
  switch (preset) {
    case "mobile":
      fontFamily.value = "Arial";
      fontSize.value = 20;
      textColor.value = "#333333";
      bgColor.value = "#ffffff";
      textAlign.value = "left";
      smartSize.checked = true;
      break;
    case "social":
      fontFamily.value = "Impact";
      fontSize.value = 32;
      textColor.value = "#ffffff";
      bgColor.value = "#1DA1F2";
      textAlign.value = "center";
      smartSize.checked = false;
      canvasWidth.value = 600;
      canvasHeight.value = 300;
      break;
    case "presentation":
      fontFamily.value = "Verdana";
      fontSize.value = 28;
      textColor.value = "#2c3e50";
      bgColor.value = "#ecf0f1";
      textAlign.value = "center";
      smartSize.checked = false;
      canvasWidth.value = 800;
      canvasHeight.value = 400;
      break;
    case "elegant":
      fontFamily.value = "Georgia";
      fontSize.value = 24;
      textColor.value = "#8e44ad";
      bgColor.value = "#f8f9fa";
      textAlign.value = "left";
      smartSize.checked = true;
      break;
  }
  updateManualControlsVisibility();
  updateRangeValues();
  updateCanvas();
}

function updateManualControlsVisibility() {
  const isVisible = !smartSize.checked;
  manualSizeGroup.style.display = isVisible ? "block" : "none";
  manualHeightGroup.style.display = isVisible ? "block" : "none";
}

function updateRangeValues() {
  fontSizeValue.textContent = fontSize.value + "px";
  canvasWidthValue.textContent = canvasWidth.value + "px";
  canvasHeightValue.textContent = canvasHeight.value + "px";
}

// Event listeners
textInput.addEventListener("input", updateCanvas);
fontFamily.addEventListener("change", updateCanvas);
fontSize.addEventListener("input", () => {
  updateRangeValues();
  updateCanvas();
});
textColor.addEventListener("input", updateCanvas);
bgColor.addEventListener("input", updateCanvas);
textAlign.addEventListener("change", updateCanvas);
smartSize.addEventListener("change", () => {
  updateManualControlsVisibility();
  updateCanvas();
});
canvasWidth.addEventListener("input", () => {
  updateRangeValues();
  updateCanvas();
});
canvasHeight.addEventListener("input", () => {
  updateRangeValues();
  updateCanvas();
});
downloadBtn.addEventListener("click", downloadImage);


// Initialize
updateManualControlsVisibility();
updateRangeValues();
updateCanvas();
