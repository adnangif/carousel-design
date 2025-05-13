# CarouselJS

A lightweight, zero-dependency JavaScript carousel/slider library with configurable parameters and responsive design.

## Features

- 🚀 Zero dependencies
- 📱 Mobile responsive
- ⚙️ Highly configurable
- 🎯 Easy to integrate
- 🔄 Smooth animations
- 🖼️ Custom item rendering
- 🔌 UMD module support (works with CommonJS, AMD, and browser globals)
- 🛡️ Built-in error handling and fallbacks
- 🔍 Customizable navigation icons

## Installation

### Option 1: Download directly

1. Download the carousel.js and carousel.css files from the dist folder
2. Include them in your HTML:

```html
<link rel="stylesheet" href="path/to/carousel.min.css">
<script src="path/to/carousel.min.js"></script>
```

### Option 2: Via npm (Coming soon)

```bash
npm install carouseljs --save
```

Then import in your project:

```javascript
// CommonJS
const CarouselJS = require('carouseljs');

// ES6
import CarouselJS from 'carouseljs';
```

## Basic Usage

HTML:
```html
<!-- Container for the carousel -->
<div id="my-carousel"></div>
```

JavaScript:
```javascript
// Sample data
const items = [
  {
    id: 1,
    title: "Item Title 1",
    description: "This is a description for item 1",
    photo: "path/to/image1.jpg"
  },
  // Add more items...
];

// Initialize the carousel
const carousel = new CarouselJS({
  selector: '#my-carousel',
  items: items,
  totalItems: 5,     // N value - Number of items in carousel
  visibleItems: 3    // X value - Number of visible items
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | String | (required) | CSS selector for the carousel container |
| `items` | Array | (required) | Array of items to display in the carousel |
| `totalItems` | Number | 7 | Number of items to use in the carousel (N) |
| `visibleItems` | Number | 3 | Number of items visible at once (X) |
| `autoRotateDelay` | Number | 5000 | Delay between auto rotations in ms |
| `autoRotate` | Boolean | true | Whether to auto rotate the carousel |
| `renderItem` | Function | (internal) | Custom function to render carousel items |
| `onSlideChange` | Function | null | Callback when slide changes |
| `adaptToMobile` | Boolean | true | Whether to adapt to mobile screens |
| `mobileBreakpoint` | Number | 768 | Breakpoint for mobile devices |
| `mobileVisibleItems` | Number | 1 | Number of items visible on mobile |
| `leftArrowIcon` | String | 'icons/left-arrow.svg' | Path to the left arrow icon |
| `rightArrowIcon` | String | 'icons/right-arrow.svg' | Path to the right arrow icon |

## API Methods

```javascript
// Navigate to the next slide
carousel.next();

// Navigate to the previous slide
carousel.prev();

// Start auto rotation
carousel.startAutoRotation();

// Stop auto rotation
carousel.stopAutoRotation();

// Update configuration
carousel.update({
  visibleItems: 2,
  autoRotate: false,
  leftArrowIcon: 'path/to/custom-left-arrow.svg'
});

// Destroy the carousel and clean up
carousel.destroy();
```

## Custom Rendering

You can customize how each item in the carousel is rendered:

```javascript
const carousel = new CarouselJS({
  selector: '#my-carousel',
  items: items,
  renderItem: function(item) {
    return `
      <div class="box blurr">
        <img class="slide" src="${item.photo}" alt="${item.title}" />
        <div class="slide-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <button>View Details</button>
        </div>
      </div>
    `;
  }
});
```

## Custom Navigation Icons

You can customize the navigation icons by providing paths to your own SVG files:

```javascript
const carousel = new CarouselJS({
  selector: '#my-carousel',
  items: items,
  leftArrowIcon: 'path/to/custom-left-arrow.svg',
  rightArrowIcon: 'path/to/custom-right-arrow.svg'
});
```

## Error Handling

CarouselJS includes built-in error handling and fallbacks:

- Fallback SVG icons if image paths are invalid
- Error handling for missing DOM elements
- Fallback for broken image links in carousel items
- Graceful degradation when elements aren't found

## Event Handling

Listen for slide changes:

```javascript
const carousel = new CarouselJS({
  selector: '#my-carousel',
  items: items,
  onSlideChange: function(slideIndex) {
    console.log('Current slide:', slideIndex);
  }
});
```

## Browser Support

CarouselJS works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License 