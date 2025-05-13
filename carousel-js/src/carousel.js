/**
 * CarouselJS - A lightweight, zero-dependency JavaScript carousel library
 * @version 1.0.1
 * @author Original author + Claude
 * @license MIT
 */

(function(root, factory) {
  // UMD (Universal Module Definition) pattern
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.CarouselJS = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * The Carousel class
   * @class
   */
  class Carousel {
    /**
     * Create a new Carousel
     * @param {Object} options - Configuration options
     * @param {string} options.selector - CSS selector for the carousel container
     * @param {Array} options.items - Array of items to display in the carousel
     * @param {number} [options.totalItems=7] - Number of items to use in the carousel (N)
     * @param {number} [options.visibleItems=3] - Number of items visible at once (X)
     * @param {number} [options.autoRotateDelay=5000] - Delay between auto rotations in ms
     * @param {boolean} [options.autoRotate=true] - Whether to auto rotate the carousel
     * @param {Function} [options.renderItem] - Custom function to render carousel items
     * @param {Function} [options.onSlideChange] - Callback when slide changes
     * @param {boolean} [options.adaptToMobile=true] - Whether to adapt to mobile screens
     * @param {number} [options.mobileBreakpoint=768] - Breakpoint for mobile devices
     * @param {number} [options.mobileVisibleItems=1] - Number of items visible on mobile
     * @param {string} [options.leftArrowIcon] - Path to the left arrow icon
     * @param {string} [options.rightArrowIcon] - Path to the right arrow icon
     * @param {string} [options.loadingText] - Text to display while loading
     * @param {string} [options.nextSlideText] - Screen reader text for next button
     * @param {string} [options.prevSlideText] - Screen reader text for previous button
     */
    constructor(options) {
      // Validate required options
      if (!options || !options.selector) {
        throw new Error('CarouselJS: Container selector is required');
      }

      if (!options.items || !Array.isArray(options.items)) {
        throw new Error('CarouselJS: Items array is required');
      }

      // Set default options
      this.options = Object.assign({
        totalItems: Math.min(7, options.items.length),
        visibleItems: 3,
        autoRotateDelay: 5000,
        autoRotate: true,
        adaptToMobile: true,
        mobileBreakpoint: 768,
        mobileVisibleItems: 1,
        renderItem: this._defaultRenderItem.bind(this),
        onSlideChange: null,
        leftArrowIcon: 'icons/left-arrow.svg',
        rightArrowIcon: 'icons/right-arrow.svg',
        loadingText: 'Loading carousel...',
        nextSlideText: 'Next slide',
        prevSlideText: 'Previous slide'
      }, options);

      // Validate totalItems and visibleItems
      if (this.options.visibleItems >= this.options.totalItems) {
        console.warn('CarouselJS: visibleItems must be less than totalItems. Setting visibleItems to totalItems - 1');
        this.options.visibleItems = Math.max(1, this.options.totalItems - 1);
      }

      if (this.options.totalItems > this.options.items.length) {
        console.warn(`CarouselJS: totalItems (${this.options.totalItems}) exceeds available items (${this.options.items.length}). Using ${this.options.items.length} items.`);
        this.options.totalItems = this.options.items.length;
      }

      // Set internal variables
      try {
        this.container = document.querySelector(this.options.selector);
        if (!this.container) {
          console.error(`CarouselJS: Container not found with selector: ${this.options.selector}`);
          throw new Error(`Container not found with selector: ${this.options.selector}`);
        }
      } catch (error) {
        throw new Error(`CarouselJS: Error finding container: ${error.message}`);
      }

      this.items = this.options.items || [];
      this.N = this.options.totalItems || 1;
      this.X = this.options.adaptToMobile && this._isMobileDevice() 
        ? this.options.mobileVisibleItems 
        : this.options.visibleItems;
      
      // Ensure X is never larger than N
      this.X = Math.min(this.X, this.N - 1);
      
      // Create additional properties
      this.anchorTime = null;
      this.autoRotateInterval = null;
      this.carousel = null;
      this.btnLeft = null;
      this.btnRight = null;
      this.currentSlide = 0;
      this.isInitialized = false;
      
      // Set unique ID for ARIA relationships
      this.carouselId = `carousel-${Math.floor(Math.random() * 1000000)}`;

      // Wait for DOM to be ready before initializing
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this._init();
        });
      } else {
        // DOM already ready, initialize now
        this._init();
      }
    }
    
    /**
     * Initialize the carousel
     * @private
     */
    _init() {
      // Create carousel structure
      this._createCarouselStructure();
      
      // Set up event listeners
      this._setupEventListeners();
      
      // Set up initial display
      this._setupVariables(this.N, this.X);
      this._updatePagination(0, this.N, this.X);
      
      // Remove loading state
      this.container.classList.remove('loading');
      
      // Start auto-rotation if enabled
      if (this.options.autoRotate) {
        this._startAutoRotation();
      }

      // Add no-js class to detect JavaScript availability
      document.documentElement.classList.remove('no-js');
    }
    
    /**
     * Create the carousel DOM structure
     * @private
     */
    _createCarouselStructure() {
      // Create container structure if it doesn't exist
      if (!this.container.classList.contains('slider')) {
        this.container.classList.add('slider');
        
        try {
          // Set accessibility attributes
          this.container.setAttribute('role', 'region');
          this.container.setAttribute('aria-roledescription', 'carousel');
          this.container.setAttribute('aria-label', 'Image Carousel');
          this.container.setAttribute('tabindex', '0');
          this.container.setAttribute('id', this.carouselId);
          
          // Safely create the structure with error handling
          this.container.innerHTML = `
            <button class="nav-btn btn-left" aria-label="${this.options.prevSlideText}" aria-controls="${this.carouselId}"><img src="${this.options.leftArrowIcon}" alt="Previous" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath fill=\\'white\\' d=\\'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\\'/%3E%3C/svg%3E';" /></button>
            <button class="nav-btn btn-right" aria-label="${this.options.nextSlideText}" aria-controls="${this.carouselId}"><img src="${this.options.rightArrowIcon}" alt="Next" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath fill=\\'white\\' d=\\'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\\'/%3E%3C/svg%3E';" /></button>
            <div class="fading">
              <div class="slide-track" role="presentation"></div>
              <div class="pagination" role="tablist" aria-label="Carousel Pagination"></div>
            </div>
          `;
        } catch (error) {
          console.error('CarouselJS: Error creating carousel structure:', error);
          // Create a minimal structure as fallback
          this.container.innerHTML = `
            <div class="fading">
              <div class="slide-track" role="presentation"></div>
              <div class="pagination" role="tablist" aria-label="Carousel Pagination"></div>
            </div>
          `;
        }
      }
      
      // Get elements - wait until next tick to ensure DOM is updated
      setTimeout(() => {
        this.carousel = this.container.querySelector('.slide-track');
        this.pagination = this.container.querySelector('.pagination');
        this.btnLeft = this.container.querySelector('.nav-btn.btn-left');
        this.btnRight = this.container.querySelector('.nav-btn.btn-right');
        
        // Check if we found all required elements
        if (!this.carousel) {
          console.error('CarouselJS: Carousel element not found');
          // Create the carousel element if it doesn't exist
          const fading = this.container.querySelector('.fading');
          if (fading) {
            this.carousel = document.createElement('div');
            this.carousel.className = 'slide-track';
            this.carousel.setAttribute('role', 'presentation');
            fading.insertBefore(this.carousel, fading.firstChild);
          } else {
            // Create a full structure if fading doesn't exist
            this.container.innerHTML = `
              <div class="fading">
                <div class="slide-track" role="presentation"></div>
                <div class="pagination" role="tablist" aria-label="Carousel Pagination"></div>
              </div>
            `;
            this.carousel = this.container.querySelector('.slide-track');
          }
        }
        
        if (!this.pagination) {
          console.warn('CarouselJS: Pagination element not found');
          this.pagination = document.createElement('div');
          this.pagination.className = 'pagination';
          this.pagination.setAttribute('role', 'tablist');
          this.pagination.setAttribute('aria-label', 'Carousel Pagination');
          this.container.querySelector('.fading')?.appendChild(this.pagination);
        }
        
        // Create slides only after we ensure the carousel element exists
        if (this.carousel) {
          this._handleCarouselCreation(this.items.slice(0, this.N));
        
          // Set up event listeners for navigation buttons if they exist
          if (this.btnLeft && this.btnRight) {
            this._setupNavButtonListeners();
          } else {
            console.warn('CarouselJS: Navigation buttons not found');
          }
          
          // Continue initialization
          this._completeInitialization();
        } else {
          console.error('CarouselJS: Could not create carousel element');
          throw new Error('Could not create carousel element');
        }
      }, 0);
    }
    
    /**
     * Complete the initialization after carousel structure is ready
     * @private
     */
    _completeInitialization() {
      // Set up initial display
      this._setupVariables(this.N, this.X);
      this._updatePagination(0, this.N, this.X);
      
      // Remove loading state
      this.container.classList.remove('loading');
      
      // Start auto-rotation if enabled
      if (this.options.autoRotate) {
        this._startAutoRotation();
      }
    }
    
    /**
     * Set up event listeners for navigation buttons
     * @private
     */
    _setupNavButtonListeners() {
      this.gotoNextSlideAction = this._gotoNextSlideAction.bind(this);
      this.gotoPrevSlideAction = this._gotoPrevSlideAction.bind(this);
      
      this.btnRight.addEventListener('click', this.gotoNextSlideAction);
      this.btnLeft.addEventListener('click', this.gotoPrevSlideAction);
    }
    
    /**
     * Set up event listeners
     * @private
     */
    _setupEventListeners() {
      // Set up navigation buttons if they exist
      if (this.btnRight && this.btnLeft) {
        this._setupNavButtonListeners();
      }
      
      // Keyboard navigation
      this.handleKeyPress = this._handleKeyPress.bind(this);
      document.addEventListener('keydown', this.handleKeyPress);
      
      // Handle focus/blur for auto-rotation pause
      this.handleFocus = this._handleFocus.bind(this);
      this.handleBlur = this._handleBlur.bind(this);
      this.container.addEventListener('focus', this.handleFocus, true);
      this.container.addEventListener('blur', this.handleBlur, true);
      
      // Pause auto-rotation on hover
      this.handleMouseEnter = this._handleMouseEnter.bind(this);
      this.handleMouseLeave = this._handleMouseLeave.bind(this);
      this.container.addEventListener('mouseenter', this.handleMouseEnter);
      this.container.addEventListener('mouseleave', this.handleMouseLeave);
      
      // Window resize
      if (this.options.adaptToMobile) {
        this.handleResize = this._handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
      }
      
      // Touch events for swipe
      this.handleTouchStart = this._handleTouchStart.bind(this);
      this.handleTouchMove = this._handleTouchMove.bind(this);
      this.handleTouchEnd = this._handleTouchEnd.bind(this);
      this.container.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      this.container.addEventListener('touchmove', this.handleTouchMove, { passive: true });
      this.container.addEventListener('touchend', this.handleTouchEnd);
      
      // Visibility change to pause auto-rotation when tab is not visible
      this.handleVisibilityChange = this._handleVisibilityChange.bind(this);
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    /**
     * Handle visibility change for auto-rotation
     * @private
     */
    _handleVisibilityChange() {
      if (document.hidden) {
        this._stopAutoRotation();
      } else if (this.options.autoRotate) {
        this._startAutoRotation();
      }
    }
    
    /**
     * Handle touch start event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.touchingSurface = true;
      
      // Pause auto rotation while touching
      if (this.options.autoRotate) {
        this._stopAutoRotation();
      }
    }
    
    /**
     * Handle touch move event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _handleTouchMove(event) {
      if (!this.touchingSurface) return;
      
      this.touchEndX = event.touches[0].clientX;
      this.touchEndY = event.touches[0].clientY;
    }
    
    /**
     * Handle touch end event
     * @private
     */
    _handleTouchEnd() {
      if (!this.touchingSurface) return;
      
      const diffX = this.touchStartX - this.touchEndX;
      const diffY = this.touchStartY - this.touchEndY;
      
      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
          if (diffX > 0) {
            this._gotoNextSlideAction();
          } else {
            this._gotoPrevSlideAction();
          }
        }
      }
      
      this.touchingSurface = false;
      
      // Resume auto rotation
      if (this.options.autoRotate) {
        this._startAutoRotation();
      }
    }
    
    /**
     * Handle mouse enter for auto-rotation pause
     * @private
     */
    _handleMouseEnter() {
      if (this.options.autoRotate) {
        this._stopAutoRotation();
      }
    }
    
    /**
     * Handle mouse leave for auto-rotation resume
     * @private
     */
    _handleMouseLeave() {
      if (this.options.autoRotate) {
        this._startAutoRotation();
      }
    }
    
    /**
     * Handle focus for auto-rotation pause
     * @private
     */
    _handleFocus() {
      if (this.options.autoRotate) {
        this._stopAutoRotation();
      }
    }
    
    /**
     * Handle blur for auto-rotation resume
     * @private
     */
    _handleBlur() {
      if (this.options.autoRotate && !this.container.contains(document.activeElement)) {
        this._startAutoRotation();
      }
    }
    
    /**
     * Handle window resize for responsive behavior
     * @private
     */
    _handleResize() {
      const isMobile = this._isMobileDevice();
      const newX = isMobile ? this.options.mobileVisibleItems : this.options.visibleItems;
      
      if (newX !== this.X) {
        this.X = newX;
        this._setupVariables(this.N, this.X);
        this._updatePagination(0, this.N, this.X);
      }
    }
    
    /**
     * Check if the current device is a mobile device
     * @returns {boolean} Whether the current device is a mobile device
     * @private
     */
    _isMobileDevice() {
      return window.innerWidth <= this.options.mobileBreakpoint;
    }
    
    /**
     * Handle keyboard events for arrow key presses.
     * @param {KeyboardEvent} event - The keyboard event triggered by a key press.
     * @private
     */
    _handleKeyPress(event) {
      // Only handle keyboard events when the carousel or its children have focus
      if (!this.container.contains(document.activeElement) && document.activeElement !== this.container) {
        return;
      }
      
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        this._gotoNextSlideAction();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        this._gotoPrevSlideAction();
      } else if (event.key === 'Home') {
        event.preventDefault();
        this._gotoSlide(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        this._gotoSlide(this.N - 1);
      }
    }
    
    /**
     * Go to a specific slide
     * @param {number} index - Slide index
     * @private
     */
    _gotoSlide(index) {
      if (index < 0 || index >= this.N) return;
      
      const leftSlideCount = this._getLeftSlideCount();
      const currentIndex = leftSlideCount % this.N;
      const diff = index - currentIndex;
      
      if (diff === 0) return;
      
      const slidingWidth = this._getSlidingWidth();
      const translateX = this._getCurrentTranslateX() - (diff * slidingWidth);
      
      this.carousel.style.transition = 'all 200ms ease-in-out';
      this.carousel.style.transform = `translateX(${translateX}px)`;
      
      this._updatePagination(currentIndex, this.N, this.X);
      this._updatePagination(index, this.N, this.X);
      
      this._handleBoxAnimationToggle(currentIndex, this.N, this.X);
      this._handleBoxAnimationToggle(index, this.N, this.X);
      
      this.currentSlide = index;
      
      // Trigger onSlideChange callback if provided
      if (typeof this.options.onSlideChange === 'function') {
        this.options.onSlideChange(index);
      }
    }
    
    /**
     * Default render function for carousel items
     * @param {Object} item - The item data to render
     * @returns {string} HTML string for the rendered item
     * @private
     */
    _defaultRenderItem(item) {
      try {
        const title = item.title || '';
        const description = item.description || '';
        const photo = item.photo || '';
        const id = item.id || Math.floor(Math.random() * 1000000);
        
        // Add image error handling and accessibility attributes
        return `
          <div class="box blurr" role="tabpanel" id="slide-${id}" aria-labelledby="tab-${id}">
            <img class="slide" src="${photo}" alt="${title}" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'200\\' viewBox=\\'0 0 300 200\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'300\\' height=\\'200\\'/%3E%3Ctext fill=\\'%23555\\' font-family=\\'sans-serif\\' font-size=\\'16\\' text-anchor=\\'middle\\' x=\\'150\\' y=\\'100\\'%3EImage not found%3C/text%3E%3C/svg%3E';" />
            <div class="slide-content">
              <h3 class="slide-title">${this._clipString(title, 40)}</h3>
              <p class="slide-description">${this._clipString(description, 100)}</p>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('CarouselJS: Error rendering item:', error);
        return '<div class="box blurr" role="tabpanel">Error rendering item</div>';
      }
    }
    
    /**
     * Truncates a string to a specified maximum length and appends an ellipsis if necessary.
     * @param {string} str - The string to be truncated.
     * @param {number} maxLength - The maximum allowed length of the string.
     * @returns {string} - The truncated string with an ellipsis if it exceeds the maxLength.
     * @private
     */
    _clipString(str, maxLength) {
      if (!str || typeof str !== 'string') return '';
      if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
      }
      return str;
    }
    
    /**
     * Creates pagination dots for the carousel.
     * @param {number} n - The number of pagination dots to create.
     * @private
     */
    _makePagination(n) {
      if (!this.pagination) return;
      
      this.pagination.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('id', `tab-${i}`);
        dot.setAttribute('aria-controls', `slide-${i}`);
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.setAttribute('tabindex', '0');
        
        // Add event listener for keyboard and mouse navigation
        // dot.addEventListener('click', () => this._gotoSlide(i));
        // dot.addEventListener('keydown', (event) => {
        //   if (event.key === 'Enter' || event.key === ' ') {
        //     event.preventDefault();
        //     this._gotoSlide(i);
        //   }
        // });
        
        this.pagination.appendChild(dot);
      }
    }
    
    /**
     * Creates the carousel with the given list of items.
     * @param {object[]} items - The list of items to be added to the carousel.
     * @private
     */
    _handleCarouselCreation(items) {
      if (!this.carousel) {
        console.error('CarouselJS: Carousel element not found');
        return;
      }
      
      this.carousel.innerHTML = '';
      
      // Add the slides three times to allow for continuous scrolling
      this._makeSlides(items, this.carousel);
      this._makeSlides(items, this.carousel);
      this._makeSlides(items, this.carousel);
      
      this._makePagination(items.length);
    }
    
    /**
     * Creates a series of carousel slides from the given list of items.
     * @param {object[]} items - The list of items from which to create the carousel slides.
     * @param {HTMLElement} carousel - The container element in the DOM in which to append the slides.
     * @private
     */
    _makeSlides(items, carousel) {
      items.forEach(item => {
        const itemHTML = this.options.renderItem(item);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHTML.trim();
        const cardElement = tempDiv.firstChild;
        carousel.appendChild(cardElement);
      });
    }
    
    /**
     * Starts the auto-rotation of the carousel.
     * @private
     */
    _startAutoRotation() {
      if (this.autoRotateInterval) {
        clearInterval(this.autoRotateInterval);
      }
      
      this.autoRotateInterval = setInterval(() => {
        this._handleAutoRotation();
      }, this.options.autoRotateDelay);
    }
    
    /**
     * Stops the auto-rotation of the carousel.
     * @private
     */
    _stopAutoRotation() {
      if (this.autoRotateInterval) {
        clearInterval(this.autoRotateInterval);
        this.autoRotateInterval = null;
      }
    }
    
    /**
     * Handles auto rotation of the carousel.
     * @private
     */
    _handleAutoRotation() {
      if (!this.carousel) {
        console.warn('CarouselJS: Cannot handle auto rotation, carousel element is null');
        return;
      }
      
      if (!this.anchorTime || Date.now() - this.anchorTime >= 3000) {
        this._gotoNextSlideAction();
      }
    }
    
    /**
     * Updates the pagination of the carousel based on the current slide number.
     * @param {number} current - The current slide number.
     * @param {number} n - The total number of slides.
     * @param {number} x - The number of slides visible at once.
     * @private
     */
    _updatePagination(current, n, x) {
      if (!this.pagination) {
        console.warn('CarouselJS: Cannot update pagination, pagination element is null');
        return;
      }
      
      let currentSlide = current;
      const dots = this.container.querySelectorAll('.dot');
      
      if (!dots || dots.length === 0) {
        console.warn('CarouselJS: No pagination dots found');
        return;
      }
      
      while (currentSlide - n >= 0) {
        currentSlide -= n;
      }
      
      for (let i = currentSlide; i < currentSlide + x && i < dots.length; i++) {
        dots[i % n].classList.toggle('active-dot');
      }
    }
    
    /**
     * Sets up the global variables N and X, and updates the style of the slider track.
     * @param {number} n - The number of slides to display in the carousel.
     * @param {number} x - The index of the slide to display as the first slide.
     * @private
     */
    _setupVariables(n, x) {
      this.N = n;
      this.X = x;
      
      if (!this.carousel) {
        console.error('CarouselJS: Cannot setup variables, carousel element is null');
        return;
      }
      
      this.carousel.style.width = `calc(100% / ${x + 1} * ${n} * 3)`;
      this.carousel.style.transform = `translateX(calc(100% / ${n}/2/3 - 100% / 3))`;
      
      this._removeBoxAnimation();
      setTimeout(() => {
        this._handleBoxAnimationToggle(n, n, x);
      }, 100);
    }
    
    /**
     * Retrieves the current horizontal translation of the slider track.
     * @returns {number} The current horizontal translation of the slider track.
     * @private
     */
    _getCurrentTranslateX() {
      if (!this.carousel) {
        console.error('CarouselJS: Cannot get translate X, carousel element is null');
        return 0;
      }
      
      const computedStyle = window.getComputedStyle(this.carousel);
      const transform = computedStyle.transform;
      
      let translateX = 0;
      
      if (transform !== 'none') {
        const values = transform.match(/matrix\(([^)]+)\)/)[1].split(', ');
        translateX = parseFloat(values[4]);
      }
      
      return translateX;
    }
    
    /**
     * Calculates the width of a single slide in the slider track.
     * @returns {number} The width of a single slide in the slider track.
     * @private
     */
    _getSlidingWidth() {
      if (!this.carousel) {
        console.error('CarouselJS: Cannot get sliding width, carousel element is null');
        return 0;
      }
      
      return this.carousel.offsetWidth / (this.N * 3.0);
    }
    
    /**
     * Calculates the number of slides to the left of the current position.
     * @returns {number} The number of slides to the left of the current position.
     * @private
     */
    _getLeftSlideCount() {
      if (!this.carousel) {
        console.error('CarouselJS: Cannot get left slide count, carousel element is null');
        return 0;
      }
      
      const translateX = this._getCurrentTranslateX();
      const slidingWidth = this._getSlidingWidth();
      
      // Handle division by zero
      if (slidingWidth === 0) {
        return 0;
      }
      
      return Math.floor(translateX * -1.0 / slidingWidth);
    }
    
    /**
     * Throttles carousel navigation to prevent rapid, successive actions.
     * @returns {boolean} Whether the carousel is currently throttled.
     * @private
     */
    _throttle() {
      if (!this.anchorTime) {
        return false;
      }
      
      return (Date.now() - this.anchorTime < 400);
    }
    
    /**
     * Moves the slider to the next slide.
     * @private
     */
    _gotoNextSlideAction() {
      if (this._throttle() || !this.carousel) {
        return;
      }
      
      this.anchorTime = Date.now();
      
      const N = this.N;
      const X = this.X;
      
      if (this._getLeftSlideCount() + X + 2 >= (N * 3) - 2) {
        setTimeout(() => {
          if (this.carousel) {
            this.carousel.style.transition = 'none';
            this.carousel.style.transform = `translateX(${this._getCurrentTranslateX() + this.carousel.offsetWidth / 3}px)`;
          }
        }, 250);
      }
      
      this._handleBoxAnimationToggle(this._getLeftSlideCount() + 1, N, X);
      this._handleBoxAnimationToggle(this._getLeftSlideCount() + 2, N, X);
      
      this._updatePagination(this._getLeftSlideCount() + 1, N, X);
      this._updatePagination(this._getLeftSlideCount() + 2, N, X);
      
      if (this.carousel) {
        this.carousel.style.transition = 'all 200ms ease-in-out';
        this.carousel.style.transform = `translateX(${this._getCurrentTranslateX() - this._getSlidingWidth()}px)`;
      }
      
      // Trigger onSlideChange callback if provided
      if (typeof this.options.onSlideChange === 'function') {
        this.options.onSlideChange(this._getLeftSlideCount() + 1);
      }
    }
    
    /**
     * Moves the slider to the previous slide.
     * @private
     */
    _gotoPrevSlideAction() {
      if (this._throttle() || !this.carousel) {
        return;
      }
      
      this.anchorTime = Date.now();
      
      if (this._getLeftSlideCount() <= 1) {
        setTimeout(() => {
          if (this.carousel) {
            this.carousel.style.transition = 'none';
            this.carousel.style.transform = `translateX(${this._getCurrentTranslateX() - this.carousel.offsetWidth / 3}px)`;
          }
        }, 250);
      }
      
      this._handleBoxAnimationToggle(this._getLeftSlideCount() + 1, this.N, this.X);
      this._handleBoxAnimationToggle(this._getLeftSlideCount(), this.N, this.X);
      
      this._updatePagination(this._getLeftSlideCount() + 1, this.N, this.X);
      this._updatePagination(this._getLeftSlideCount(), this.N, this.X);
      
      if (this.carousel) {
        this.carousel.style.transition = 'all 200ms ease-in-out';
        this.carousel.style.transform = `translateX(${this._getCurrentTranslateX() + this._getSlidingWidth()}px)`;
      }
      
      // Trigger onSlideChange callback if provided
      if (typeof this.options.onSlideChange === 'function') {
        this.options.onSlideChange(this._getLeftSlideCount());
      }
    }
    
    /**
     * Adds the 'blurr' class to all elements with the class 'box'.
     * @private
     */
    _removeBoxAnimation() {
      const boxes = this.container.querySelectorAll('.box');
      if (!boxes || boxes.length === 0) {
        console.warn('CarouselJS: No box elements found');
        return;
      }
      
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.add('blurr');
      }
    }
    
    /**
     * Toggles the 'blurr' class on the boxes that are currently in view.
     * @param {number} nextTarget - The index of the next target slide.
     * @param {number} n - The total number of slides in one full cycle of the carousel.
     * @param {number} x - The number of slides to display at once.
     * @private
     */
    _handleBoxAnimationToggle(nextTarget, n, x) {
      const boxes = this.container.querySelectorAll('.box');
      if (!boxes || boxes.length === 0) {
        console.warn('CarouselJS: No box elements found');
        return;
      }
      
      let currentBox = nextTarget;
      while (currentBox - n >= 0) {
        currentBox -= n;
      }
      
      for (let i = currentBox; i < 3 * n; i = i + n) {
        for (let j = 0; j < x && i + j < boxes.length; j++) {
          if (i + j < boxes.length) {
            boxes[i + j].classList.toggle('blurr');
          }
        }
      }
    }
    
    // PUBLIC API METHODS
    
    /**
     * Go to the next slide
     * @public
     */
    next() {
      this._gotoNextSlideAction();
    }
    
    /**
     * Go to the previous slide
     * @public
     */
    prev() {
      this._gotoPrevSlideAction();
    }
    
    /**
     * Start auto rotation
     * @public
     */
    startAutoRotation() {
      this._startAutoRotation();
    }
    
    /**
     * Stop auto rotation
     * @public
     */
    stopAutoRotation() {
      this._stopAutoRotation();
    }
    
    /**
     * Update carousel configuration
     * @param {Object} options - New configuration options
     * @public
     */
    update(options) {
      // Update options
      this.options = Object.assign(this.options, options);
      
      // Re-initialize with new options
      const needsRebuild = options.totalItems || options.items || options.renderItem;
      
      if (needsRebuild) {
        this.N = this.options.totalItems;
        this.X = this.options.adaptToMobile && this._isMobileDevice() 
          ? this.options.mobileVisibleItems 
          : this.options.visibleItems;
        
        if (options.items) {
          this.items = options.items;
        }
        
        this._handleCarouselCreation(this.items.slice(0, this.N));
      }
      
      this._setupVariables(this.N, this.X);
      this._updatePagination(0, this.N, this.X);
      
      // Handle auto-rotation changes
      if (options.autoRotate !== undefined) {
        if (options.autoRotate) {
          this._startAutoRotation();
        } else {
          this._stopAutoRotation();
        }
      }
    }
    
    /**
     * Destroy the carousel and remove event listeners
     * @public
     */
    destroy() {
      // Stop auto rotation
      this._stopAutoRotation();
      
      // Remove event listeners with the properly bound functions
      if (this.btnRight && this.gotoNextSlideAction) {
        this.btnRight.removeEventListener('click', this.gotoNextSlideAction);
      }
      
      if (this.btnLeft && this.gotoPrevSlideAction) {
        this.btnLeft.removeEventListener('click', this.gotoPrevSlideAction);
      }
      
      if (this.handleKeyPress) {
        document.removeEventListener('keydown', this.handleKeyPress);
      }
      
      if (this.handleFocus) {
        this.container.removeEventListener('focus', this.handleFocus, true);
      }
      
      if (this.handleBlur) {
        this.container.removeEventListener('blur', this.handleBlur, true);
      }
      
      if (this.handleMouseEnter) {
        this.container.removeEventListener('mouseenter', this.handleMouseEnter);
      }
      
      if (this.handleMouseLeave) {
        this.container.removeEventListener('mouseleave', this.handleMouseLeave);
      }
      
      if (this.handleTouchStart) {
        this.container.removeEventListener('touchstart', this.handleTouchStart);
        this.container.removeEventListener('touchmove', this.handleTouchMove);
        this.container.removeEventListener('touchend', this.handleTouchEnd);
      }
      
      if (this.handleVisibilityChange) {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      }
      
      if (this.options.adaptToMobile && this.handleResize) {
        window.removeEventListener('resize', this.handleResize);
      }
      
      // Clear DOM contents
      if (this.container) {
        this.container.innerHTML = '';
        this.container.classList.remove('slider', 'loading');
        this.container.removeAttribute('role');
        this.container.removeAttribute('aria-roledescription');
        this.container.removeAttribute('aria-label');
        this.container.removeAttribute('tabindex');
      }
    }
  }

  return Carousel;
})); 