/**
 * PALETTE EXTRACTION MODULE
 *
 * This module implements advanced color palette extraction from images using
 * multiple algorithms. It's designed to automatically extract the most
 * representative colors from any image, creating custom palettes for artistic
 * image processing.
 *
 * Algorithms Implemented:
 * - K-Means Clustering: Groups similar colors using machine learning clustering
 * - Median Cut: Divides color space recursively to find representative colors
 * - Dominant Colors: Frequency-based extraction of most common colors
 * - LAB Space Clustering: Perceptually uniform color space clustering
 * - Delta E: Maximum color difference algorithm for distinct palette creation
 *
 * Why Multiple Algorithms?
 * - Different images benefit from different extraction methods
 * - Provides flexibility for various artistic styles
 * - Allows experimentation with color theory approaches
 * - Ensures optimal results across diverse image types
 */

// Palette extraction elements
const paletteImageLoader = document.getElementById("paletteImageLoader");
const paletteImagePreview = document.getElementById("paletteImagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imageInfoText = document.getElementById("imageInfoText");
const extractColorCount = document.getElementById("extractColorCount");
const extractColorCountValue = document.getElementById(
  "extractColorCountValue"
);
const extractMethod = document.getElementById("extractMethod");
const extractPalette = document.getElementById("extractPalette");
const extractedPalette = document.getElementById("extractedPalette");
const colorGrid = document.getElementById("colorGrid");
const usePalette = document.getElementById("usePalette");
const savePalette = document.getElementById("savePalette");

let paletteImage = new Image();
let currentPaletteFileName = "";

// Event listeners for palette extraction
paletteImageLoader.addEventListener("change", handlePaletteImage, false);
extractColorCount.addEventListener(
  "input",
  function () {
    updateSliderValue("extractColorCountValue", extractColorCount.value);
  },
  false
);

function handlePaletteImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Store the filename for palette naming
  currentPaletteFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension

  const reader = new FileReader();
  reader.onload = function (e) {
    paletteImagePreview.onload = function () {
      imagePreviewContainer.style.display = "block";
      extractPalette.disabled = false;
      imageInfoText.textContent = `${file.name} (${paletteImagePreview.naturalWidth}×${paletteImagePreview.naturalHeight})`;
    };
    paletteImagePreview.src = e.target.result;
    paletteImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Color extraction functionality
extractPalette.addEventListener("click", function () {
  if (!paletteImage.src) return;

  const colorCount = parseInt(extractColorCount.value);
  const method = extractMethod.value;

  // Show loading state
  extractPalette.disabled = true;
  extractPalette.innerHTML =
    '<span class="extract-icon">⏳</span> Extracting...';

  // Extract colors based on selected method
  setTimeout(() => {
    try {
      const colors = extractColorsFromImage(paletteImage, colorCount, method);
      displayExtractedPalette(colors);
    } catch (error) {
      console.error("Error extracting colors:", error);
      alert("Error extracting colors from image");
    } finally {
      // Reset button state
      extractPalette.disabled = false;
      extractPalette.innerHTML =
        '<span class="extract-icon">🎨</span> Extract from Image';
    }
  }, 100);
});

/**
 * Main color extraction orchestrator
 * Processes an image using the selected algorithm to extract a color palette
 *
 * Performance optimization: Scales down large images for faster processing
 * without significantly affecting color analysis accuracy
 *
 * @param {Image} image - The source image for color extraction
 * @param {number} colorCount - Number of colors to extract (3-32)
 * @param {string} method - Algorithm to use for extraction
 * @returns {Array} Array of RGB color objects
 */
function extractColorsFromImage(image, colorCount, method) {
  // Create a temporary canvas to analyze the image
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  // Scale down image for faster processing
  // This optimization reduces computation time without affecting color accuracy
  const maxSize = 200;
  const scale = Math.min(maxSize / image.width, maxSize / image.height);
  tempCanvas.width = Math.floor(image.width * scale);
  tempCanvas.height = Math.floor(image.height * scale);

  tempCtx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

  const imageData = tempCtx.getImageData(
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );
  const pixels = getPixelColors(imageData);

  let extractedColors;
  switch (method) {
    case "kmeans":
      extractedColors = kMeansExtraction(pixels, colorCount);
      break;
    case "median":
      extractedColors = medianCutExtraction(pixels, colorCount);
      break;
    case "dominant":
      extractedColors = dominantColorsExtraction(pixels, colorCount);
      break;
    case "lab":
      extractedColors = labSpaceExtraction(pixels, colorCount);
      break;
    case "deltae":
      extractedColors = deltaEExtraction(pixels, colorCount);
      break;
    default:
      extractedColors = dominantColorsExtraction(pixels, colorCount);
  }

  return extractedColors;
}

function getPixelColors(imageData) {
  const pixels = [];
  const data = imageData.data;

  // Sample every nth pixel for performance
  const step = 4;
  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a > 128) {
      pixels.push({ r, g, b });
    }
  }

  return pixels;
}

// Simple dominant colors extraction (frequency-based)
function dominantColorsExtraction(pixels, colorCount) {
  // Quantize colors to reduce complexity
  const colorMap = new Map();

  pixels.forEach((pixel) => {
    // Reduce color precision for grouping
    const r = Math.floor(pixel.r / 16) * 16;
    const g = Math.floor(pixel.g / 16) * 16;
    const b = Math.floor(pixel.b / 16) * 16;

    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  });

  // Sort by frequency and take top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([colorKey]) => {
      const [r, g, b] = colorKey.split(",").map(Number);
      return { r, g, b };
    });

  return sortedColors;
}

// Simplified median cut algorithm
function medianCutExtraction(pixels, colorCount) {
  if (pixels.length === 0) return [];

  let buckets = [pixels];

  while (buckets.length < colorCount) {
    // Find bucket with largest range
    let maxRange = 0;
    let bucketIndex = 0;

    buckets.forEach((bucket, index) => {
      const range = getColorRange(bucket);
      if (range > maxRange) {
        maxRange = range;
        bucketIndex = index;
      }
    });

    // Split the bucket
    const bucketToSplit = buckets[bucketIndex];
    const [bucket1, bucket2] = splitBucket(bucketToSplit);

    buckets.splice(bucketIndex, 1, bucket1, bucket2);
  }

  // Get average color for each bucket
  return buckets.map((bucket) => getAverageColor(bucket));
}

function getColorRange(pixels) {
  if (pixels.length === 0) return 0;

  const minR = Math.min(...pixels.map((p) => p.r));
  const maxR = Math.max(...pixels.map((p) => p.r));
  const minG = Math.min(...pixels.map((p) => p.g));
  const maxG = Math.max(...pixels.map((p) => p.g));
  const minB = Math.min(...pixels.map((p) => p.b));
  const maxB = Math.max(...pixels.map((p) => p.b));

  return maxR - minR + (maxG - minG) + (maxB - minB);
}

function splitBucket(pixels) {
  if (pixels.length <= 1) return [pixels, []];

  // Find the dimension with the largest range
  const minR = Math.min(...pixels.map((p) => p.r));
  const maxR = Math.max(...pixels.map((p) => p.r));
  const minG = Math.min(...pixels.map((p) => p.g));
  const maxG = Math.max(...pixels.map((p) => p.g));
  const minB = Math.min(...pixels.map((p) => p.b));
  const maxB = Math.max(...pixels.map((p) => p.b));

  const rangeR = maxR - minR;
  const rangeG = maxG - minG;
  const rangeB = maxB - minB;

  let sortKey;
  if (rangeR >= rangeG && rangeR >= rangeB) {
    sortKey = "r";
  } else if (rangeG >= rangeB) {
    sortKey = "g";
  } else {
    sortKey = "b";
  }

  // Sort by the chosen dimension
  pixels.sort((a, b) => a[sortKey] - b[sortKey]);

  // Split in the middle
  const mid = Math.floor(pixels.length / 2);
  return [pixels.slice(0, mid), pixels.slice(mid)];
}

function getAverageColor(pixels) {
  if (pixels.length === 0) return { r: 0, g: 0, b: 0 };

  const sum = pixels.reduce(
    (acc, pixel) => ({
      r: acc.r + pixel.r,
      g: acc.g + pixel.g,
      b: acc.b + pixel.b,
    }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(sum.r / pixels.length),
    g: Math.round(sum.g / pixels.length),
    b: Math.round(sum.b / pixels.length),
  };
}

// Simple K-means clustering
function kMeansExtraction(pixels, k) {
  if (pixels.length === 0) return [];

  // Initialize centroids randomly
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length);
    centroids.push({ ...pixels[randomIndex] });
  }

  // Iterate k-means
  for (let iter = 0; iter < 10; iter++) {
    const clusters = Array(k)
      .fill()
      .map(() => []);

    // Assign pixels to nearest centroid
    pixels.forEach((pixel) => {
      let minDistance = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, index) => {
        const distance = colorDistance(pixel, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = index;
        }
      });

      clusters[clusterIndex].push(pixel);
    });

    // Update centroids
    const newCentroids = clusters.map((cluster) =>
      cluster.length > 0
        ? getAverageColor(cluster)
        : centroids[clusters.indexOf(cluster)]
    );

    // Check for convergence
    let converged = true;
    for (let i = 0; i < k; i++) {
      if (colorDistance(centroids[i], newCentroids[i]) > 1) {
        converged = false;
        break;
      }
    }

    centroids = newCentroids;

    if (converged) break;
  }

  return centroids;
}

function colorDistance(color1, color2) {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
  );
}

// Color space conversion functions
function rgbToXyz(r, g, b) {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using sRGB matrix
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  return { x: x * 100, y: y * 100, z: z * 100 };
}

function xyzToLab(x, y, z) {
  // D65 illuminant
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;

  x = x / xn;
  y = y / yn;
  z = z / zn;

  const fx = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { L, a, b };
}

function rgbToLab(r, g, b) {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

function labToXyz(L, a, b) {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const x = fx * fx * fx > 0.008856 ? fx * fx * fx : (fx - 16 / 116) / 7.787;
  const y = fy * fy * fy > 0.008856 ? fy * fy * fy : (fy - 16 / 116) / 7.787;
  const z = fz * fz * fz > 0.008856 ? fz * fz * fz : (fz - 16 / 116) / 7.787;

  return {
    x: x * 95.047,
    y: y * 100.0,
    z: z * 108.883,
  };
}

function xyzToRgb(x, y, z) {
  x = x / 100;
  y = y / 100;
  z = z / 100;

  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // Apply inverse gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255))),
  };
}

function labToRgb(L, a, b) {
  const xyz = labToXyz(L, a, b);
  return xyzToRgb(xyz.x, xyz.y, xyz.z);
}

// Delta E CIE76 distance calculation
function deltaE76(lab1, lab2) {
  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
      Math.pow(lab1.a - lab2.a, 2) +
      Math.pow(lab1.b - lab2.b, 2)
  );
}

// LAB space clustering (K-means in LAB space)
function labSpaceExtraction(pixels, k) {
  if (pixels.length === 0) return [];

  // Convert all pixels to LAB space
  const labPixels = pixels.map((pixel) => ({
    ...pixel,
    lab: rgbToLab(pixel.r, pixel.g, pixel.b),
  }));

  // Initialize centroids randomly in LAB space
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * labPixels.length);
    centroids.push({
      lab: { ...labPixels[randomIndex].lab },
    });
  }

  // Iterate k-means in LAB space
  for (let iter = 0; iter < 15; iter++) {
    const clusters = Array(k)
      .fill()
      .map(() => []);

    // Assign pixels to nearest centroid using LAB distance
    labPixels.forEach((pixel) => {
      let minDistance = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, index) => {
        const distance = deltaE76(pixel.lab, centroid.lab);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = index;
        }
      });

      clusters[clusterIndex].push(pixel);
    });

    // Update centroids (average in LAB space)
    const newCentroids = clusters.map((cluster, index) => {
      if (cluster.length === 0) return centroids[index];

      const avgLab = {
        L: cluster.reduce((sum, p) => sum + p.lab.L, 0) / cluster.length,
        a: cluster.reduce((sum, p) => sum + p.lab.a, 0) / cluster.length,
        b: cluster.reduce((sum, p) => sum + p.lab.b, 0) / cluster.length,
      };

      return { lab: avgLab };
    });

    // Check for convergence
    let converged = true;
    for (let i = 0; i < k; i++) {
      if (deltaE76(centroids[i].lab, newCentroids[i].lab) > 1) {
        converged = false;
        break;
      }
    }

    centroids = newCentroids;
    if (converged) break;
  }

  // Convert final centroids back to RGB
  return centroids.map((centroid) =>
    labToRgb(centroid.lab.L, centroid.lab.a, centroid.lab.b)
  );
}

// Delta E based extraction (finds colors with maximum perceptual differences)
function deltaEExtraction(pixels, colorCount) {
  if (pixels.length === 0) return [];
  if (colorCount === 1) return [pixels[0]];

  // Convert all pixels to LAB space
  const labPixels = pixels.map((pixel) => ({
    ...pixel,
    lab: rgbToLab(pixel.r, pixel.g, pixel.b),
  }));

  // Start with a random color
  const selectedColors = [
    labPixels[Math.floor(Math.random() * labPixels.length)],
  ];

  // Iteratively add colors that are maximally different from existing ones
  while (selectedColors.length < colorCount) {
    let maxMinDistance = 0;
    let bestCandidate = null;

    // Sample every nth pixel for performance
    const step = Math.max(1, Math.floor(labPixels.length / 1000));

    for (let i = 0; i < labPixels.length; i += step) {
      const candidate = labPixels[i];

      // Find minimum distance to already selected colors
      let minDistance = Infinity;
      for (const selected of selectedColors) {
        const distance = deltaE76(candidate.lab, selected.lab);
        minDistance = Math.min(minDistance, distance);
      }

      // Keep the candidate with maximum minimum distance
      if (minDistance > maxMinDistance) {
        maxMinDistance = minDistance;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      selectedColors.push(bestCandidate);
    } else {
      // Fallback: add a random color if no good candidate found
      selectedColors.push(
        labPixels[Math.floor(Math.random() * labPixels.length)]
      );
    }
  }

  // Convert back to RGB
  return selectedColors.map((color) => ({
    r: color.r,
    g: color.g,
    b: color.b,
  }));
}

function displayExtractedPalette(colors) {
  extractedPalette.style.display = "block";
  colorGrid.innerHTML = "";

  colors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    const hex = rgbToHex(color.r, color.g, color.b);

    swatch.style.backgroundColor = hex;
    swatch.setAttribute("data-hex", hex);
    swatch.title = `Click to copy ${hex}`;

    swatch.addEventListener("click", () => {
      copyToClipboard(hex);
      showCopyNotification(hex);
    });

    colorGrid.appendChild(swatch);
  });
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

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

// Helper functions for palette management
function saveExtractedPaletteToStorage(palette) {
  const savedPalettes = JSON.parse(
    localStorage.getItem("extractedPalettes") || "{}"
  );
  savedPalettes[palette.name] = palette.colors;
  localStorage.setItem("extractedPalettes", JSON.stringify(savedPalettes));
}

function loadExtractedPalettesFromStorage() {
  const savedPalettes = JSON.parse(
    localStorage.getItem("extractedPalettes") || "{}"
  );

  // Add saved palettes to the main colorPalettes array and dropdown
  Object.keys(savedPalettes).forEach((paletteName) => {
    const existingPalette = colorPalettes.find((p) => p.name === paletteName);
    if (!existingPalette) {
      const newPalette = {
        name: paletteName,
        colors: savedPalettes[paletteName],
      };

      // Add to main colorPalettes array
      colorPalettes.push(newPalette);

      // Add to dropdown
      const option = document.createElement("option");
      option.value = paletteName;
      option.textContent = paletteName;
      document.getElementById("palette").appendChild(option);
    }
  });
}

// Use extracted palette functionality
usePalette.addEventListener("click", function () {
  const swatches = colorGrid.querySelectorAll(".color-swatch");
  if (swatches.length === 0) return;

  const colors = Array.from(swatches).map((swatch) =>
    swatch.getAttribute("data-hex")
  );

  // Create a palette name with filename + timestamp (yy-mm-dd-hh-mm-ss)
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  const filename = currentPaletteFileName || "image";
  const paletteName = `${filename}+${timestamp}`;

  const newPalette = {
    name: paletteName,
    colors: colors,
  };

  // Add to main colorPalettes array
  if (typeof colorPalettes !== "undefined") {
    colorPalettes.push(newPalette);

    // Add to dropdown
    const option = document.createElement("option");
    option.value = paletteName;
    option.textContent = paletteName;
    document.getElementById("palette").appendChild(option);

    // Select and apply the new palette
    document.getElementById("palette").value = paletteName;

    // Save to localStorage for persistence
    saveExtractedPaletteToStorage(newPalette);

    // Apply effects if there's an image loaded
    if (typeof applyEffects === "function") {
      applyEffects();
    }

    alert(`Palette "${paletteName}" is now active and saved!`);
  }
});

// Save extracted palette functionality with custom name
savePalette.addEventListener("click", function () {
  const swatches = colorGrid.querySelectorAll(".color-swatch");
  if (swatches.length === 0) return;

  const paletteName = prompt("Enter a name for this palette:");
  if (!paletteName || paletteName.trim() === "") return;

  const colors = Array.from(swatches).map((swatch) =>
    swatch.getAttribute("data-hex")
  );

  const newPalette = {
    name: paletteName,
    colors: colors,
  };

  // Add to main colorPalettes array
  if (typeof colorPalettes !== "undefined") {
    // Check if palette name already exists
    const existingPalette = colorPalettes.find((p) => p.name === paletteName);
    if (existingPalette) {
      if (
        !confirm(`A palette named "${paletteName}" already exists. Replace it?`)
      ) {
        return;
      }
      // Remove existing palette
      const index = colorPalettes.findIndex((p) => p.name === paletteName);
      colorPalettes.splice(index, 1);

      // Remove from dropdown
      const existingOption = document.querySelector(
        `#palette option[value="${paletteName}"]`
      );
      if (existingOption) {
        existingOption.remove();
      }
    }

    colorPalettes.push(newPalette);

    // Add to dropdown
    const option = document.createElement("option");
    option.value = paletteName;
    option.textContent = paletteName;
    document.getElementById("palette").appendChild(option);

    // Save to localStorage
    saveExtractedPaletteToStorage(newPalette);

    alert(`Palette "${paletteName}" saved successfully!`);
  }
});

// Load extracted palettes when the script loads
if (typeof colorPalettes !== "undefined") {
  // Wait a bit to ensure colorPalettes is fully initialized
  setTimeout(loadExtractedPalettesFromStorage, 100);
}
