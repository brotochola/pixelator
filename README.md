# 🎨 Pixelator - Advanced Image Pixelation Tool

A powerful web-based image transformation tool that converts regular photographs into stunning pixel art with advanced color manipulation capabilities.

## 🌟 Features

### Core Pixelation Effects

- **Adjustable Pixelation**: Transform images with customizable pixel sizes (1-16 levels)
- **Surface Smoothing**: Apply artistic blur effects for softer pixel transitions
- **Border Darkening**: Enhance pixel definition with adjustable border emphasis
- **Dual Canvas System**: Optimized rendering with separate antialias controls

### Advanced Color Manipulation

- **Color Palette Application**: Apply predefined artistic color schemes
- **Custom Palette Extraction**: Extract colors from any image using 5 different algorithms
- **Hue & Saturation Control**: Fine-tune color characteristics
- **Brightness & Contrast**: Adjust image exposure and contrast levels
- **Color Removal**: Remove or replace specific colors from images

### Professional Tools

- **Preset System**: Save and load custom effect configurations
- **Zoom & Pan**: Navigate large images with precision controls
- **Real-time Preview**: See changes instantly as you adjust parameters
- **Export Capabilities**: Save your pixel art creations

## 🎯 Why Pixelator?

### The Problem

Traditional photo editing software often lacks specialized tools for creating pixel art or applying retro effects. Most pixelation tools are either:

- Too simplistic (just resize and scale up)
- Lack color palette control
- Don't provide real-time preview
- Missing artistic enhancement features

### The Solution

Pixelator was created to bridge this gap by providing:

1. **Professional-grade pixelation** with multiple enhancement options
2. **Color science integration** using advanced algorithms like K-means clustering and LAB color space
3. **Artist-friendly workflow** with real-time preview and preset management
4. **Educational value** for understanding color theory and image processing

### Use Cases

- **Digital Artists**: Create pixel art from reference photos
- **Game Developers**: Generate retro-style sprites and textures
- **Designers**: Create stylized imagery for presentations
- **Educators**: Demonstrate color theory and image processing concepts
- **Hobbyists**: Transform personal photos into artistic creations

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Start creating pixel art!

_No installation required - runs entirely in your browser!_

### Basic Usage

#### 1. Load an Image

- Click "📁 Choose Image File"
- Select any image file (JPG, PNG, etc.)
- The image will appear in the canvas area

#### 2. Apply Pixelation

- Use the "Pixelation Level" slider (1-16) to control pixel size
- Lower values = more detail, higher values = more pixelated
- Watch the preview update in real-time

#### 3. Enhance with Effects

- **Surface Smoothing**: Add blur for artistic effect
- **Border Darkening**: Enhance pixel boundaries (0-100%)
- **Color Controls**: Adjust brightness, contrast, hue, saturation

#### 4. Apply Color Palettes

- Choose from 13 predefined artistic palettes
- Or extract custom palettes from any image
- Adjust "Palette Blend Strength" for subtle color mapping

### Advanced Features

#### Custom Palette Extraction

1. **Upload Reference Image**: Choose an image with colors you want to extract
2. **Select Algorithm**: Choose from 5 different extraction methods:
   - **K-Means Clustering**: Machine learning approach for balanced colors
   - **Median Cut**: Recursive color space division
   - **Dominant Colors**: Frequency-based most common colors
   - **LAB Space Clustering**: Perceptually uniform color space
   - **Delta E**: Maximum color difference for distinct palettes
3. **Extract & Apply**: Click "Extract from Image" and then "Use This Palette"

#### Preset Management

- **Save Presets**: Save your favorite effect combinations
- **Load Presets**: Quickly apply saved configurations
- **Share Settings**: Export/import preset configurations

#### Navigation Controls

- **Zoom**: Use mouse wheel or zoom buttons for detailed work
- **Pan**: Click and drag to move around large images
- **Fit to Screen**: Automatically adjust zoom to fit canvas

## 🎨 Color Palette Library

### Predefined Palettes

- **Forest Adventure**: Earthy greens and browns
- **Desert Sands**: Warm sandy tones
- **Ocean Breeze**: Cool blues and teals
- **Retro Sunset**: Warm oranges and reds
- **Neon Nights**: Vibrant electric colors
- **Snowy Peaks**: Cool grays and whites
- **Cave Depths**: Dark mysterious tones
- **Candy Land**: Sweet pastel colors
- **Tropical Paradise**: Bright tropical greens
- **Haunted Mansion**: Dark purples and blacks
- **Apollo**: Professional 46-color palette
- **Sweetie 16**: Curated 16-color artistic palette
- **Journey**: Expansive 64-color gradient palette
- **IslandJoy 16**: Tropical 16-color palette

## 🔧 Technical Details

### Architecture

- **Pure JavaScript**: No external libraries required
- **HTML5 Canvas**: High-performance image processing
- **CSS Grid Layout**: Responsive modern interface
- **Local Storage**: Preset and palette persistence

### Performance Optimizations

- **Dual Canvas System**: Separate processing and display canvases
- **Image Scaling**: Automatic scaling for large images
- **Efficient Algorithms**: Optimized color extraction and processing
- **Real-time Rendering**: Smooth interactive experience

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎓 Educational Value

### Color Theory Concepts

- **Color Spaces**: RGB, HSL, LAB color space conversions
- **Color Harmony**: Predefined palettes demonstrate color relationships
- **Perception**: LAB color space for perceptually uniform color processing

### Image Processing Techniques

- **Convolution**: Smoothing and blur effects
- **Quantization**: Color reduction and pixelation
- **Clustering**: Machine learning color grouping
- **Histogram Analysis**: Dominant color extraction

### Algorithm Implementation

- **K-Means Clustering**: Unsupervised learning for color grouping
- **Median Cut**: Recursive color space partitioning
- **Delta E**: Color difference calculation
- **Color Space Conversion**: Mathematical transformations

## 🤝 Contributing

This project is open for contributions! Areas for improvement:

- Additional color extraction algorithms
- New artistic palettes
- Performance optimizations
- UI/UX enhancements
- Mobile responsiveness

## 📄 License

Open source - feel free to use, modify, and distribute!

## 🙏 Acknowledgments

Created with passion for digital art and color theory. Special thanks to the community of pixel artists and game developers who inspired this tool.

---

_Transform your images into pixel art masterpieces with Pixelator!_ 🎨✨
