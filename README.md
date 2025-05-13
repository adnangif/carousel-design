# Book Carousel Project

A beautiful, responsive book carousel demonstration built with CarouselJS, a zero-dependency JavaScript carousel library.

## Demo

View the live demo: [https://adnangif.github.io/carousel-design/](https://adnangif.github.io/carousel-design/)

This project showcases a responsive carousel of book items with configurable parameters. The carousel allows you to:
- Set the total number of items (N)
- Set the number of visible items (X)
- Auto-rotate through items
- Navigate with arrow buttons or keyboard keys

## Features

- Smooth transitions between slides
- Responsive design that adapts to mobile devices
- Blur effect for inactive slides
- Pagination indicators
- Keyboard navigation support
- Configurable parameters

## Project Structure

```
carousel-design/
├── icons/                    # Arrow icons
├── photos/                   # Book cover images
├── carousel-js/              # The carousel library
│   ├── src/                  # Source code
│   │   ├── carousel.js       # Main library code
│   │   └── carousel.css      # Styles for the carousel
│   ├── dist/                 # Distribution files
│   │   ├── carousel.min.js   # Minified JavaScript
│   │   └── carousel.min.css  # Minified CSS
│   ├── docs/                 # Documentation and demo
│   │   └── index.html        # Demo page
│   ├── README.md             # Library documentation
│   └── LICENSE               # MIT license
├── book-description.json     # Book data
├── index.html                # Main demo page
├── my-script.js              # Original script (for reference)
├── my-styles.css             # Original styles (for reference)
└── README.md                 # Project documentation
```

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Experiment with different N and X values using the controls

## Library Usage

The `carousel-js` directory contains a standalone library that you can use in other projects. See the [library README](carousel-js/README.md) for detailed usage instructions.

Basic usage:

```javascript
const carousel = new CarouselJS({
  selector: '#carousel-container',
  items: books,
  totalItems: 7,     // N value
  visibleItems: 3    // X value
});
```

## Customization

The carousel can be customized by modifying:
- The number of total items (N)
- The number of visible items (X)
- CSS variables for colors, spacing, and transitions
- Custom item rendering

## License

MIT License - See the [LICENSE](carousel-js/LICENSE) file for details.