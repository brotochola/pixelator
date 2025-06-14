/**
 * PIXELATOR - Advanced Image Pixelation and Color Effects Tool
 *
 * This application transforms images with pixelation effects, color manipulation,
 * and artistic filters. It provides a comprehensive suite of tools for creating
 * retro-style pixel art from regular photographs or images.
 *
 * Main Features:
 * - Pixelation with adjustable levels
 * - Color palette application and extraction
 * - Hue, saturation, brightness, and contrast adjustments
 * - Border darkening effects for enhanced pixel definition
 * - Surface smoothing for artistic blur effects
 * - Color removal/replacement functionality
 * - Preset saving and loading system
 * - Zoom and pan functionality for detailed editing
 *
 * Technical Implementation:
 * - Uses HTML5 Canvas for real-time image processing
 * - Implements dual-canvas system for optimized rendering
 * - Supports various color space conversions (RGB, HSL, LAB)
 * - Includes multiple color extraction algorithms
 *
 * Author: Facundo Saiegh
 * Purpose: To provide an easy-to-use tool for converting photos into pixel art
 */

// Pre-defined color palettes for artistic effects
// These palettes are carefully curated to provide different artistic moods and styles
const colorPalettes = [
  {
    name: "Forest Adventure",
    colors: ["#3b5323", "#6b8e23", "#a2d149", "#324631", "#202b24"],
  },
  {
    name: "Desert Sands",
    colors: ["#e4a672", "#c68642", "#a65f38", "#5c3c25", "#2b1f14"],
  },
  {
    name: "Ocean Breeze",
    colors: ["#4682b4", "#5f9ea0", "#87cefa", "#2f4f4f", "#1e3f3f"],
  },
  {
    name: "Retro Sunset",
    colors: ["#ff4500", "#ff6347", "#ffa07a", "#f08080", "#800000"],
  },
  {
    name: "Neon Nights",
    colors: ["#ff00ff", "#8a2be2", "#4b0082", "#0000ff", "#00ffff"],
  },
  {
    name: "Snowy Peaks",
    colors: ["#ffffff", "#d3d3d3", "#a9a9a9", "#696969", "#2f4f4f"],
  },
  {
    name: "Cave Depths",
    colors: ["#2c3e50", "#34495e", "#1c2833", "#566573", "#17202a"],
  },
  {
    name: "Candy Land",
    colors: ["#ff69b4", "#ff1493", "#ffa07a", "#ffb6c1", "#ff00ff"],
  },
  {
    name: "Tropical Paradise",
    colors: ["#20b2aa", "#2e8b57", "#3cb371", "#00fa9a", "#adff2f"],
  },
  {
    name: "Haunted Mansion",
    colors: ["#4b0082", "#8b008b", "#483d8b", "#2e2e2e", "#1c1c1c"],
  },
  {
    name: "Apollo",
    colors: [
      "#172038",
      "#253a5e",
      "#3c5e8b",
      "#4f8fba",
      "#73bed3",
      "#a4dddb",
      "#19332d",
      "#25562e",
      "#468232",
      "#75a743",
      "#a8ca58",
      "#d0da91",
      "#4d2b32",
      "#7a4841",
      "#ad7757",
      "#c09473",
      "#d7b594",
      "#e7d5b3",
      "#341c27",
      "#602c2c",
      "#884b2b",
      "#be772b",
      "#de9e41",
      "#e8c170",
      "#241527",
      "#411d31",
      "#752438",
      "#a53030",
      "#cf573c",
      "#da863e",
      "#1e1d39",
      "#402751",
      "#7a367b",
      "#a23e8c",
      "#c65197",
      "#df84a5",
      "#090a14",
      "#10141f",
      "#151d28",
      "#202e37",
      "#394a50",
      "#577277",
      "#819796",
      "#a8b5b2",
      "#c7cfcc",
      "#ebede9",
    ],
  },
  {
    name: "Sweetie 16",
    colors: [
      "#1a1c2c",
      "#5d275d",
      "#b13e53",
      "#ef7d57",
      "#ffcd75",
      "#a7f070",
      "#38b764",
      "#257179",
      "#29366f",
      "#3b5dc9",
      "#41a6f6",
      "#73eff7",
      "#f4f4f4",
      "#94b0c2",
      "#566c86",
      "#333c57",
    ],
  },
  {
    name: "Journey",
    colors: [
      "#050914",
      "#110524",
      "#3b063a",
      "#691749",
      "#9c3247",
      "#d46453",
      "#f5a15d",
      "#ffcf8e",
      "#ff7a7d",
      "#ff417d",
      "#d61a88",
      "#94007a",
      "#42004e",
      "#220029",
      "#100726",
      "#25082c",
      "#3d1132",
      "#73263d",
      "#bd4035",
      "#ed7b39",
      "#ffb84a",
      "#fff540",
      "#c6d831",
      "#77b02a",
      "#429058",
      "#2c645e",
      "#153c4a",
      "#052137",
      "#0e0421",
      "#0c0b42",
      "#032769",
      "#144491",
      "#488bd4",
      "#78d7ff",
      "#b0fff1",
      "#faffff",
      "#c7d4e1",
      "#928fb8",
      "#5b537d",
      "#392946",
      "#24142c",
      "#0e0f2c",
      "#132243",
      "#1a466b",
      "#10908e",
      "#28c074",
      "#3dff6e",
      "#f8ffb8",
      "#f0c297",
      "#cf968c",
      "#8f5765",
      "#52294b",
      "#0f022e",
      "#35003b",
      "#64004c",
      "#9b0e3e",
      "#d41e3c",
      "#ed4c40",
      "#ff9757",
      "#d4662f",
      "#9c341a",
      "#691b22",
      "#450c28",
      "#2d002e",
    ],
  },
  {
    name: "IslandJoy 16",
    colors: [
      "#ffffff",
      "#6df7c1",
      "#11adc1",
      "#606c81",
      "#393457",
      "#1e8875",
      "#5bb361",
      "#a1e55a",
      "#f7e476",
      "#f99252",
      "#cb4d68",
      "#6a3771",
      "#c92464",
      "#f48cb6",
      "#f7b69e",
      "#9b9c82",
    ],
  },
  {
    name: "Dramescape Hex 8",
    colors: [
      "#c9cca1",
      "#caa05a",
      "#ae6a47",
      "#8b4049",
      "#543344",
      "#515262",
      "#63787d",
      "#8ea091",
    ],
  },
  {
    name: "kenney",
    colors: [
      "#333333ff",
      "#F0E3C2ff",
      "#9C0000ff",
      "#000000ff",
      "#653F1Dff",
      "#B48554ff",
      "#9F8763ff",
      "#FF0000ff",
      "#D46700ff",
      "#23BE75ff",
    ],
  },
];

// DOM Elements
const colorRemover = document.getElementById("colorRemover");
const canvas1Antialias = document.getElementById("canvas1Antialias");
const canvas2Antialias = document.getElementById("canvas2Antialias");
const bypass = document.getElementById("bypass");
const imageLoader = document.getElementById("imageLoader");
const paletteSelect = document.getElementById("palette");
const pixelationRange = document.getElementById("pixelationRange");
const contrastRange = document.getElementById("contrastRange");
const darkenRange = document.getElementById("darkenRange");
const paletteBlend = document.getElementById("paletteBlend");
const shouldRemoveColor = document.getElementById("shouldRemoveColor");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const hueRange = document.getElementById("hueRange");
const saturationRange = document.getElementById("saturationRange");
const brightnessRange = document.getElementById("brightnessRange");
const smoothRange = document.getElementById("smoothRange");

// Zoom controls
const zoomControls = document.getElementById("zoomControls");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomResetBtn = document.getElementById("zoomReset");
const zoomFitBtn = document.getElementById("zoomFit");
const zoomLevelDisplay = document.getElementById("zoomLevel");
const canvasWrapper = document.getElementById("canvasWrapper");

// Preset elements
const presetSelect = document.getElementById("presetSelect");
const presetName = document.getElementById("presetName");
const savePresetBtn = document.getElementById("savePreset");
const loadPresetBtn = document.getElementById("loadPreset");
const deletePresetBtn = document.getElementById("deletePreset");

// Controls panel elements
const controlsPanel = document.querySelector(".controls-panel");
const controlsToggle = document.querySelector(".controls-toggle");
const controlsClose = document.querySelector(".controls-close");

let img = new Image();

// Zoom state
let zoomLevel = 1;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panOffsetX = 0;
let panOffsetY = 0;

/**
 * Initialize the palette selection dropdown
 * Populates the palette select element with all available color palettes
 * This allows users to choose from predefined artistic color schemes
 */
function putPalettesInSelect() {
  let option = document.createElement("option");
  option.value = "none";
  option.innerHTML = "none";
  paletteSelect.appendChild(option);

  for (let p of colorPalettes) {
    let option = document.createElement("option");
    option.value = p.name;
    option.innerHTML = p.name;
    paletteSelect.appendChild(option);
  }
}

function updateSliderValue(elementId, value) {
  document.getElementById(elementId).textContent = value;
}

// Event Listeners
colorRemover.addEventListener("change", applyEffects, false);
canvas1Antialias.addEventListener("change", applyEffects, false);
canvas2Antialias.addEventListener("change", applyEffects, false);
imageLoader.addEventListener("change", handleImage, false);
pixelationRange.addEventListener(
  "input",
  function () {
    updateSliderValue("pixelationValue", pixelationRange.value);
    applyEffects();
  },
  false
);
contrastRange.addEventListener(
  "input",
  function () {
    updateSliderValue("contrastValue", contrastRange.value);
    applyEffects();
  },
  false
);
brightnessRange.addEventListener(
  "input",
  function () {
    updateSliderValue("brightnessValue", brightnessRange.value);
    applyEffects();
  },
  false
);
darkenRange.addEventListener(
  "input",
  function () {
    updateSliderValue("darkenValue", darkenRange.value);
    applyEffects();
  },
  false
);
hueRange.addEventListener(
  "input",
  function () {
    updateSliderValue("hueValue", hueRange.value + "°");
    applyEffects();
  },
  false
);
saturationRange.addEventListener(
  "input",
  function () {
    updateSliderValue("saturationValue", saturationRange.value + "%");
    applyEffects();
  },
  false
);
smoothRange.addEventListener(
  "input",
  function () {
    updateSliderValue("smoothValue", smoothRange.value);
    applyEffects();
  },
  false
);
paletteBlend.addEventListener(
  "input",
  function () {
    updateSliderValue(
      "paletteBlendValue",
      Math.round(paletteBlend.value * 100) + "%"
    );
    applyEffects();
  },
  false
);

shouldRemoveColor.addEventListener("change", applyEffects, false);
bypass.addEventListener("change", applyEffects, false);
paletteSelect.addEventListener("input", handlePaletteChange, false);

// Zoom event listeners
zoomInBtn.addEventListener("click", zoomIn);
zoomOutBtn.addEventListener("click", zoomOut);
zoomResetBtn.addEventListener("click", zoomReset);
zoomFitBtn.addEventListener("click", zoomFit);

// Canvas panning event listeners
canvas.addEventListener("mousedown", startPan);
canvas.addEventListener("mousemove", doPan);
canvas.addEventListener("mouseup", endPan);
canvas.addEventListener("mouseleave", endPan);

// Mouse wheel zoom
canvasWrapper.addEventListener("wheel", handleWheelZoom);

// Main Functions
function handleImage(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      // Show canvas and hide placeholder
      canvas.style.display = "block";
      document.getElementById("canvasPlaceholder").style.display = "none";
      // Show zoom controls
      zoomControls.style.display = "flex";
      // Reset zoom
      zoomReset();
      applyEffects();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function handlePaletteChange() {
  displaySelectedPaletteColors();
  applyEffects();
}

/**
 * Main image processing function - applies all selected effects to the image
 * This is the core function that transforms the original image based on user settings:
 * - Pixelation: Creates blocky pixel art effect by downscaling and upscaling
 * - Color adjustments: Contrast, brightness, hue, saturation
 * - Smoothing: Blur effect for artistic touch
 * - Color palette application: Maps colors to predefined palettes
 * - Border darkening: Adds definition to pixel boundaries
 * - Color removal: Removes or replaces specific colors
 */
function applyEffects() {
  console.log("re applying...");
  if (!img.src) return;

  const pixelation = parseInt(pixelationRange.value, 10);
  const contrast = parseInt(contrastRange.value, 10);
  const brightness = parseInt(brightnessRange.value, 10);
  const darken = parseInt(darkenRange.value, 10);
  const hue = parseInt(hueRange.value, 10);
  const saturation = parseInt(saturationRange.value, 10);
  const smooth = parseFloat(smoothRange.value);

  // Clear the main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the original image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (bypass.checked) return;

  // Apply smoothing effect if enabled
  if (smooth > 0) {
    applySmoothingEffect(smooth);
  }

  // Apply contrast adjustment
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(contrastFactor * (data[i] - 128) + 128); // Red
    data[i + 1] = clamp(contrastFactor * (data[i + 1] - 128) + 128); // Green
    data[i + 2] = clamp(contrastFactor * (data[i + 2] - 128) + 128); // Blue
  }

  // Apply brightness adjustment
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + brightness); // Red
    data[i + 1] = clamp(data[i + 1] + brightness); // Green
    data[i + 2] = clamp(data[i + 2] + brightness); // Blue
  }

  // Remove color if enabled
  if (shouldRemoveColor.checked) removeColor(imageData, colorRemover.value);

  adjustHueSaturation(imageData, hue, saturation);

  ctx.putImageData(imageData, 0, 0);

  // Use a temporary canvas for pixelation
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Scale down and then up to create pixelation
  const scaledWidth = Math.floor(canvas.width / pixelation);
  const scaledHeight = Math.floor(canvas.height / pixelation);
  ctx.imageSmoothingEnabled = canvas1Antialias.checked;
  tempCtx.imageSmoothingEnabled = canvas2Antialias.checked;
  tempCtx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    scaledWidth,
    scaledHeight
  );
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Darken border pixels of the smaller image
  imageData = darkenBorders(tempCtx, darken, canvas.width, canvas.height);

  // Apply color palette to smaller image
  imageData = applyColorPaletteIfAnySelected(imageData);

  // Draw the new image in temp canvas
  tempCtx.putImageData(imageData, 0, 0);

  // Draw smaller canvas to visible canvas
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    scaledWidth,
    scaledHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function applyColorPaletteIfAnySelected(imageData) {
  if (paletteSelect.value == "none") {
    return imageData;
  }
  let colors = colorPalettes.filter((k) => k.name == paletteSelect.value)[0]
    .colors;
  return applyPalette(imageData, colors, Number(paletteBlend.value));
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function adjustHueSaturation(imageData, hue, saturation) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    let a = data[i + 3];

    // Convert RGB to HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // Adjust Hue and Saturation
    h = (h + hue / 360) % 1; // Hue adjustment
    s = clamp(s * (saturation / 100)); // Saturation adjustment

    // Convert HSL back to RGB
    [r, g, b] = hslToRgb(h, s, l);

    // Update pixel data
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
}

function darkenBorders(ct, darkenPercentage, width, height) {
  const imgdata = ct.getImageData(0, 0, width, height);
  const data = imgdata.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      if (data[index + 3] === 0) continue; // Skip transparent pixels

      if (isBorderPixel(data, x, y)) {
        data[index] = darkenPixel(data[index], darkenPercentage); // Red
        data[index + 1] = darkenPixel(data[index + 1], darkenPercentage); // Green
        data[index + 2] = darkenPixel(data[index + 2], darkenPercentage); // Blue
      }
    }
  }

  return imgdata;
}

function isBorderPixel(data, x, y) {
  const width = canvas.width;
  const height = canvas.height;

  const neighbors = [
    [x - 1, y],
    [x + 1, y], // Left, Right
    [x, y - 1],
    [x, y + 1], // Top, Bottom
  ];

  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const index = (ny * width + nx) * 4;
      if (data[index + 3] === 0) return true; // Transparent neighbor
    }
  }

  return false;
}

function darkenPixel(value, percentage) {
  return Math.max(0, value - value * (percentage / 100));
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function hexToRgbArr(hex) {
  const cleanHex = hex.replace("#", "");
  return [
    parseInt(cleanHex.slice(0, 2), 16),
    parseInt(cleanHex.slice(2, 4), 16),
    parseInt(cleanHex.slice(4, 6), 16),
  ];
}

function removeColor(imageData, targetColor) {
  const [rTarget, gTarget, bTarget] = hexToRgbArr(targetColor);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    if (r === rTarget && g === gTarget && b === bTarget) {
      imageData.data[i + 3] = 0; // Set alpha to 0
    }
  }
}

function applyPalette(imageData, palette, blendFactor) {
  const paletteColors = palette.map(hexToRgb);
  const { data, width, height } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const originalColor = { r: data[i], g: data[i + 1], b: data[i + 2] };
    const closestColor = findClosestColor(originalColor, paletteColors);

    const blendedColor = {
      r: lerp(originalColor.r, closestColor.r, blendFactor),
      g: lerp(originalColor.g, closestColor.g, blendFactor),
      b: lerp(originalColor.b, closestColor.b, blendFactor),
    };

    data[i] = blendedColor.r;
    data[i + 1] = blendedColor.g;
    data[i + 2] = blendedColor.b;
  }

  let newimgDAta = new ImageData(data, width, height);
  return newimgDAta;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function findClosestColor(color, palette) {
  let closest = palette[0];
  let minDistance = Infinity;
  for (const palColor of palette) {
    const distance = Math.sqrt(
      (color.r - palColor.r) ** 2 +
        (color.g - palColor.g) ** 2 +
        (color.b - palColor.b) ** 2
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = palColor;
    }
  }
  return closest;
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function applySmoothingEffect(blurAmount) {
  // Create a temporary canvas for the blurred image
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Save the current image data (original)
  const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Apply blur filter and draw to temp canvas
  tempCtx.filter = `blur(${blurAmount}px)`;
  tempCtx.drawImage(canvas, 0, 0);

  // Reset filter for main canvas
  ctx.filter = "none";

  // Clear main canvas and draw the blurred version
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  // Get the blurred image data
  const blurredImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Blend the original and blurred images
  // The alpha determines how much of the original shows through
  // Higher blur amount = more blur effect, less original
  const alpha = Math.min(0.8, blurAmount / 25); // Max 80% blur effect

  const originalData = originalImageData.data;
  const blurredData = blurredImageData.data;

  for (let i = 0; i < originalData.length; i += 4) {
    // Blend RGB channels (alpha blending: result = blur * alpha + original * (1 - alpha))
    blurredData[i] = Math.round(
      blurredData[i] * alpha + originalData[i] * (1 - alpha)
    ); // Red
    blurredData[i + 1] = Math.round(
      blurredData[i + 1] * alpha + originalData[i + 1] * (1 - alpha)
    ); // Green
    blurredData[i + 2] = Math.round(
      blurredData[i + 2] * alpha + originalData[i + 2] * (1 - alpha)
    ); // Blue
    // Keep original alpha channel
    blurredData[i + 3] = originalData[i + 3];
  }

  // Put the blended image back on canvas
  ctx.putImageData(blurredImageData, 0, 0);
}

// Selected Palette Display Function
function displaySelectedPaletteColors() {
  const selectedPaletteName = paletteSelect.value;
  const selectedPaletteDisplay = document.getElementById(
    "selectedPaletteDisplay"
  );
  const selectedColorGrid = document.getElementById("selectedColorGrid");

  // Clear existing colors
  selectedColorGrid.innerHTML = "";

  if (selectedPaletteName === "none" || !selectedPaletteName) {
    selectedPaletteDisplay.style.display = "none";
    return;
  }

  // Find the selected palette
  const selectedPalette = colorPalettes.find(
    (p) => p.name === selectedPaletteName
  );
  if (!selectedPalette) {
    selectedPaletteDisplay.style.display = "none";
    return;
  }

  // Show the palette display
  selectedPaletteDisplay.style.display = "block";

  // Create color swatches for each color in the palette
  selectedPalette.colors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color;
    swatch.setAttribute("data-hex", color);
    swatch.title = color;

    // Add click event to copy color
    swatch.addEventListener("click", () => {
      copyToClipboard(color);
      showCopyNotification(color);
    });

    selectedColorGrid.appendChild(swatch);
  });
}

// Helper functions for copying colors (reusing from palette-extraction.js)
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}

function showCopyNotification(hex) {
  // Remove existing notification
  const existing = document.querySelector(".copy-notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = "copy-notification";
  notification.textContent = `Copied ${hex}`;
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 10);

  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Controls Panel Toggle Functions
function toggleControlsPanel() {
  controlsPanel.classList.toggle("open");
}

function closeControlsPanel() {
  controlsPanel.classList.remove("open");
}

function openControlsPanel() {
  controlsPanel.classList.add("open");
}

// Event listeners for controls panel
controlsToggle.addEventListener("click", toggleControlsPanel);
controlsClose.addEventListener("click", closeControlsPanel);

// Close panel when clicking outside
document.addEventListener("click", function (event) {
  if (
    !controlsPanel.contains(event.target) &&
    !controlsToggle.contains(event.target) &&
    controlsPanel.classList.contains("open")
  ) {
    closeControlsPanel();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && controlsPanel.classList.contains("open")) {
    closeControlsPanel();
  }
  if (event.key === "c" && event.ctrlKey) {
    event.preventDefault();
    toggleControlsPanel();
  }
});

// Preset Management Functions
function getCurrentConfig() {
  return {
    pixelation: pixelationRange.value,
    contrast: contrastRange.value,
    brightness: brightnessRange.value,
    darken: darkenRange.value,
    hue: hueRange.value,
    saturation: saturationRange.value,
    smooth: smoothRange.value,
    paletteBlend: paletteBlend.value,
    palette: paletteSelect.value,
    colorRemover: colorRemover.value,
    shouldRemoveColor: shouldRemoveColor.checked,
    bypass: bypass.checked,
    canvas1Antialias: canvas1Antialias.checked,
    canvas2Antialias: canvas2Antialias.checked,
  };
}

function applyConfig(config) {
  pixelationRange.value = config.pixelation || 4;
  contrastRange.value = config.contrast || 0;
  brightnessRange.value = config.brightness || 0;
  darkenRange.value = config.darken || 20;
  hueRange.value = config.hue || 0;
  saturationRange.value = config.saturation || 100;
  smoothRange.value = config.smooth || 0;
  paletteBlend.value = config.paletteBlend || 0;
  paletteSelect.value = config.palette || "none";
  colorRemover.value = config.colorRemover || "#ffffff";
  shouldRemoveColor.checked = config.shouldRemoveColor || false;
  bypass.checked = config.bypass || false;
  canvas1Antialias.checked = config.canvas1Antialias || false;
  canvas2Antialias.checked =
    config.canvas2Antialias !== undefined ? config.canvas2Antialias : true;

  // Update all slider displays
  updateSliderValue("pixelationValue", pixelationRange.value);
  updateSliderValue("contrastValue", contrastRange.value);
  updateSliderValue("brightnessValue", brightnessRange.value);
  updateSliderValue("darkenValue", darkenRange.value);
  updateSliderValue("hueValue", hueRange.value + "°");
  updateSliderValue("saturationValue", saturationRange.value + "%");
  updateSliderValue("smoothValue", smoothRange.value);
  updateSliderValue(
    "paletteBlendValue",
    Math.round(paletteBlend.value * 100) + "%"
  );

  // Display selected palette colors
  displaySelectedPaletteColors();

  // Apply effects if image is loaded
  if (img.src) {
    applyEffects();
  }
}

function savePreset() {
  const name = presetName.value.trim();
  if (!name) {
    alert("Please enter a preset name");
    return;
  }

  const presets = JSON.parse(localStorage.getItem("pixeladorPresets") || "{}");
  presets[name] = getCurrentConfig();
  localStorage.setItem("pixeladorPresets", JSON.stringify(presets));

  presetName.value = "";
  loadPresetsFromStorage();
  alert(`Preset "${name}" saved successfully!`);
}

function loadPreset() {
  const selectedPreset = presetSelect.value;
  if (!selectedPreset) {
    alert("Please select a preset to load");
    return;
  }

  const presets = JSON.parse(localStorage.getItem("pixeladorPresets") || "{}");
  if (presets[selectedPreset]) {
    applyConfig(presets[selectedPreset]);
    alert(`Preset "${selectedPreset}" loaded successfully!`);
  }
}

function deletePreset() {
  const selectedPreset = presetSelect.value;
  if (!selectedPreset) {
    alert("Please select a preset to delete");
    return;
  }

  if (
    confirm(`Are you sure you want to delete the preset "${selectedPreset}"?`)
  ) {
    const presets = JSON.parse(
      localStorage.getItem("pixeladorPresets") || "{}"
    );
    delete presets[selectedPreset];
    localStorage.setItem("pixeladorPresets", JSON.stringify(presets));
    loadPresetsFromStorage();
    alert(`Preset "${selectedPreset}" deleted successfully!`);
  }
}

function loadPresetsFromStorage() {
  const presets = JSON.parse(localStorage.getItem("pixeladorPresets") || "{}");

  // Clear existing options except the first one
  presetSelect.innerHTML = '<option value="">Select a preset...</option>';

  // Add saved presets
  Object.keys(presets)
    .sort()
    .forEach((presetName) => {
      const option = document.createElement("option");
      option.value = presetName;
      option.textContent = presetName;
      presetSelect.appendChild(option);
    });
}

// Event listeners for preset management
savePresetBtn.addEventListener("click", savePreset);
loadPresetBtn.addEventListener("click", loadPreset);
deletePresetBtn.addEventListener("click", deletePreset);

// Allow saving preset with Enter key
presetName.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    savePreset();
  }
});

// Zoom Functions
function updateZoomDisplay() {
  zoomLevelDisplay.textContent = Math.round(zoomLevel * 100) + "%";
  canvas.style.transform = `scale(${zoomLevel}) translate(${panOffsetX}px, ${panOffsetY}px)`;
}

function zoomIn() {
  zoomLevel = Math.min(zoomLevel * 1.2, 5); // Max zoom 500%
  updateZoomDisplay();
}

function zoomOut() {
  zoomLevel = Math.max(zoomLevel / 1.2, 0.1); // Min zoom 10%
  updateZoomDisplay();
}

function zoomReset() {
  zoomLevel = 1;
  panOffsetX = 0;
  panOffsetY = 0;
  updateZoomDisplay();
}

function zoomFit() {
  if (!img.src) return;

  const containerWidth = canvasWrapper.clientWidth;
  const containerHeight = canvasWrapper.clientHeight;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const scaleX = containerWidth / canvasWidth;
  const scaleY = containerHeight / canvasHeight;

  zoomLevel = Math.min(scaleX, scaleY) * 0.9; // 90% of container size
  panOffsetX = 0;
  panOffsetY = 0;
  updateZoomDisplay();
}

function handleWheelZoom(event) {
  event.preventDefault();

  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

function startPan(event) {
  if (zoomLevel <= 1) return; // Only allow panning when zoomed in

  isPanning = true;
  panStartX = event.clientX - panOffsetX;
  panStartY = event.clientY - panOffsetY;
  canvas.style.cursor = "grabbing";
}

function doPan(event) {
  if (!isPanning) return;

  event.preventDefault();
  panOffsetX = event.clientX - panStartX;
  panOffsetY = event.clientY - panStartY;
  updateZoomDisplay();
}

function endPan() {
  isPanning = false;
  canvas.style.cursor = zoomLevel > 1 ? "grab" : "default";
}

// Initialize everything
putPalettesInSelect();
loadPresetsFromStorage();
