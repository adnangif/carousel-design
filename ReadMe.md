# Carousel Design

## Overview
This project is a dynamic, responsive, and auto-rotating carousel built with vanilla JavaScript. The carousel displays a configurable number of slides (n) with a user-defined number of visible slides (x). It is optimized for desktop and mobile devices, supports keyboard navigation, and includes pagination and auto-rotation features.

## Demo 
Visit [this link](https://adnangif.github.io/carousel-design/) to see the working demo of the Design.

## Features

### Dynamic Configuration
- **n**: Total number of slides to display.
- **x**: Number of slides visible at a time.

### Responsive Design
- Adjusts the number of visible slides (x) based on the device's screen size.

### Navigation
- Left and right arrow buttons to navigate between slides.
- Keyboard navigation using `ArrowLeft` and `ArrowRight`.

### Pagination
- Displays dots corresponding to the slides, highlighting active slides.

### Auto-Rotation
- Automatically moves to the next slide every 5 seconds.

### Animation
- Smooth transitions between slides.

### Mobile-Friendly
- Automatically sets `x = 1` on smaller screens.

## Code Structure

### 1. Entry Point
- `main()`: Initializes the carousel by:
  - Fetching the list of books (`getBooks()`).
  - Configuring `n` and `x` values.
  - Setting up event listeners for navigation buttons and keyboard input.
  - Creating the carousel (`handleCarouselCreation`).

### 2. Core Functions
- `handleCarouselCreation(books)`: Clears the existing carousel and adds new slides. Creates pagination dots for the slides.
- `updatePagination(current, n, x)`: Updates the active state of pagination dots based on the current slide.
- `setupVariables(n, x)`: Configures global variables (`n`, `x`) and updates the carousel's styling.
- `gotoNextSlideAction()` / `gotoPrevSlideAction()`: Handles navigation to the next or previous slide with animation and pagination updates.
- `handleKeyPress(event)`: Detects `ArrowLeft` and `ArrowRight` key presses to navigate the carousel.

### 3. Helper Functions
- `getBooks()`: Returns a list of books with id, title, description, and photo.
- `clipString(str, maxLength)`: Truncates long descriptions and appends an ellipsis (...).
- `isMobileDevice()`: Determines if the user is on a mobile device based on screen width.
- `throttle()`: Prevents rapid execution of actions, ensuring smoother navigation.
- `handleAutoRotation()`: Automatically navigates to the next slide every 5 seconds, respecting user interactions.

## Configuration

### Setting `n` and `x`
- **n**: Total number of slides. Controlled via the input field with `id="value-of-n"`.
- **x**: Number of visible slides. Automatically set based on device type or manually adjustable via the input field with `id="value-of-x"`.

### Validation Rules:
- `x` must be between 1 and `n-1`.
- `n` must not exceed the total number of available books.

### How to Update
- Use the input fields labeled `Value of N` and `Value of X` to set `n` and `x`.
- Click the `Update` button to refresh the carousel with the new configuration.

## Additional Features
- **Keyboard Navigation**:
  - `ArrowLeft`: Navigate to the previous slide.
  - `ArrowRight`: Navigate to the next slide.

- **Auto-Rotation**:
  - Automatically slides every 5 seconds unless interrupted by user input.

- **Throttling**:
  - Ensures smooth animations by limiting rapid function execution.

- **Responsive Design**:
  - Adjusts the number of visible slides (`x`) based on screen width.

## How to Run
1. Clone or download the repository.
2. Open `index.html` in any modern browser.
3. Adjust `n` and `x` using the input fields and test the carousel functionality.

## Known Limitations
- **Browser Compatibility**: Ensure the browser supports modern JavaScript (ES6+).

## Future Improvements
- Add swipe gestures for better mobile usability.
- Enhance accessibility with ARIA roles and screen-reader support.
- Allow dynamic loading of books from an API.
