window.onload = main

/**
 * The main function is the entry point of the script.
 * It is responsible for setting up the variables and event listeners,
 * and for initializing the carousel.
 *
 * It first gets the list of books from the JSON file.
 * Then it sets the value of X based on whether the device is mobile or not.
 * It then sets up the event listeners for the navigation buttons and the update button.
 * Finally, it calls the functions to create the carousel, set up the variables,
 * update the pagination and start the auto-rotation.
 */
function main() {
    books = getBooks()
    const n = parseInt(document.querySelector('#value-of-n').value)
    let x = 0

    if(isMobileDevice()){
        x = 1
    }else{
        x = 3
    }

    document.querySelector('#value-of-x').value = x


    const btnLeft = document.querySelector('.nav-btn.btn-left');
    const btnRight = document.querySelector('.nav-btn.btn-right');
    const updateBtn = document.querySelector('#update-btn');

    btnRight.addEventListener('click', gotoNextSlideAction)
    btnLeft.addEventListener('click', gotoPrevSlideAction)
    updateBtn.addEventListener('click', handleUpdate)
    document.addEventListener('keydown', handleKeyPress)

    handleCarouselCreation(books.slice(0,n))
    setupVariables(n, x)
    updatePagination(0,n,x)

    setInterval(handleAutoRotation, 5000)
};


/**
 * Checks if the time elapsed since the last anchor time is less than 3000ms,
 * and if so, calls the gotoNextSlideAction function to move to the next slide.
 * This is used to implement the auto-rotation feature of the carousel.
 */
function handleAutoRotation(){
    if(!window.anchorTime || Date.now() - window.anchorTime >= 3000){
        gotoNextSlideAction()
    }
}


/**
 * Updates the pagination of the carousel based on the current slide number.
 * 
 * This function is called whenever the user navigates to a different slide.
 * It first calculates the current slide number modulo N to ensure that it is
 * within the range of 0 to N-1.
 * 
 * Then it toggles the active state of the dots corresponding to the current
 * slide and the next X-1 slides.
 */
function updatePagination(current, n,x){
    let currentSlide = current
    const dots = document.querySelectorAll('.dot')

    while(currentSlide -n >= 0){
        currentSlide -= n
    }

    for(let i = currentSlide; i < currentSlide + x; i++){
        dots[i%n].classList.toggle('active-dot')

    }

}

/**
 * Returns an array of objects each with id, title, description, and photo attributes.
 * The objects represent books with unique ids, titles, descriptions, and photos.
 * The returned array is used to populate the slider with book cards.
 * @returns {Array<{id: number, title: string, description: string, photo: string}>} An array of book objects.
 */
function getBooks() {
    const books = [
    {
        "id": 1,
        "title": "Way of the Wolf",
        "description": "Jordan Belfort—immortalized by Leonardo DiCaprio in the hit movie The Wolf of Wall Street—reveals the step-by-step sales and persuasion system proven to turn anyone into a sales-closing, money-earning rock star.",
        "photo": "book1.jpg"
    },
    {
        "id": 2,
        "title": "Basic Economics",
        "description": "Basic Economics is a citizen's guide to economics, written for those who want to understand how the economy works but have no interest in jargon or equations. Bestselling economist Thomas Sowell explains the general principles underlying different economic systems: capitalist, socialist, feudal, and so on. In readable language, he shows how to critique economic policies in terms of the incentives they create, rather than the goals they proclaim. With clear explanations of the entire field, from rent control and the rise and fall of businesses to the international balance of payments, this is the first book for anyone who wishes to understand how the economy functions.",
        "photo": "book2.jpg"
    },
    {
        "id": 3,
        "title": "Getting to Yes: Negotiating Agreement Without Giving In",
        "description": "Since its original publication nearly thirty years ago, Getting to Yes has helped millions of people learn a better way to negotiate. One of the primary business texts of the modern era, it is based on the work of the Harvard Negotiation Project, a group that deals with all levels of negotiation and conflict resolution.",
        "photo": "book3.jpg"
    },
    {
        "id": 4,
        "title": "Economics in One Lesson: The Shortest and Surest Way to Understand Basic Economics ",
        "description": "A million copy seller, Henry Hazlitt’s classic primer is an essential guide to the basics of economic theory. A fundamental influence on modern libertarianism, Hazlitt defends capitalism and the free market from economic myths that persist to this day.",
        "photo": "book4.jpg"
    },
    {
        "id": 5,
        "title": "Foster",
        "description": "An international bestseller and one of The Times’ “Top 50 Novels Published in the 21st Century,” Claire Keegan’s piercing contemporary classic Foster is a heartbreaking story of childhood, loss, and love; now released as a standalone book for the first time ever in the US",
        "photo": "book5.jpg"
    },
    {
        "id": 6,
        "title": "Small Things Like These",
        "description": "Small Things Like These is award-winning author Claire Keegan's landmark new novel, a tale of one man's courage and a remarkable portrait of love and family",
        "photo": "book6.jpg"
    },
    {
        "id": 7,
        "title": "So Late in the Day: Stories of Women and Men ",
        "description": "From Booker Prize Finalist and bestselling author of “pitch perfect” (Boston Globe) Small Things Like These, comes a triptych of stories about love, lust, betrayal, and the ever-intriguing interchanges between women and men",
        "photo": "book7.jpg"
    }
]


    return books
}


/**
 * Checks if the current device is a mobile device.
 * @returns {boolean} Whether the current device is a mobile device.
 * @todo Adjust breakpoint as needed.
 */
function isMobileDevice() {
    return window.innerWidth <= 768; // Adjust breakpoint as needed
}


/**
 * Handles keyboard events for arrow key presses.
 * 
 * This function listens for 'ArrowRight' and 'ArrowLeft' key presses.
 * When the 'ArrowRight' key is pressed, it triggers the action to go
 * to the next slide in the carousel. When the 'ArrowLeft' key is pressed,
 * it triggers the action to go to the previous slide.
 * 
 * @param {Event} event - The keyboard event triggered by a key press.
 */
function handleKeyPress(event) {
    if (event.key === 'ArrowRight') {
        gotoNextSlideAction()
    } else if (event.key === 'ArrowLeft') {
        gotoPrevSlideAction()
    }
}


/**
 * Truncates a string to a specified maximum length and appends an ellipsis if necessary.
 *
 * @param {string} str - The string to be truncated.
 * @param {number} maxLength - The maximum allowed length of the string.
 * @returns {string} - The truncated string with an ellipsis if it exceeds the maxLength, or the original string if it does not.
 */
function clipString(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...'; // Truncate and add ellipsis
    }
    return str; // Return the original string if it's shorter than maxLength
}




/**
 * Creates the carousel with the given list of books.
 * 
 * This function is called whenever the list of books in the carousel needs to be updated.
 * It first empties the carousel and then calls the makeSlides function three times to add
 * the list of books to the carousel three times. Finally, it calls the makePagination
 * function to create the pagination dots.
 * 
 * @param {object[]} books - The list of books to be added to the carousel.
 */
function handleCarouselCreation(books){
    console.log('called handleCarouselCreation')
    const carousel = document.querySelector('#root');
    carousel.innerHTML = '';

    makeSlides(books, carousel)
    makeSlides(books, carousel)
    makeSlides(books, carousel)
    makePagination(books.length)
}


/**
 * Creates pagination dots for the carousel.
 * 
 * This function generates a series of pagination dots and appends them
 * to the pagination container in the DOM. Each dot represents a slide
 * in the carousel, and the number of dots created is determined by the 
 * parameter `n`.
 * 
 * @param {number} n - The number of pagination dots to create.
 */
function makePagination(n){
    const pagination = document.querySelector('#pagination')
    pagination.innerHTML = ''
    for (let i = 0; i < n; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot')
        pagination.appendChild(dot);
    }
}


/**
 * Creates a series of carousel slides from the given list of books.
 * 
 * This function iterates over the given list of books and creates a carousel slide
 * for each one. The slide contains an image of the book, as well as a title and
 * description. Finally, the slide is appended to the given carousel container
 * in the DOM.
 * 
 * @param {object[]} books - The list of books from which to create the carousel slides.
 * @param {HTMLElement} carousel - The container element in the DOM in which to append the slides.
 */
function makeSlides(books, carousel){
    books.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('box')
        card.classList.add('blurr')
        card.innerHTML = `
            <img class="slide" src="./photos/${book.photo}" alt="${book.title}" />
            <div class="slide-content">
                <h5 class="slide-title">${book.title.split(':')[0]}</h5>
                <p class="slide-description">${clipString(book.description, 100)}</p>
            </div>
        `
        carousel.appendChild(card);
    });

}




/**
 * Handles the update button click event.
 * 
 * This function first gets the current values of N and X from the input fields.
 * It then checks if X is between 1 and N-1, and if N is less than or equal to the
 * number of books. If either of these conditions is not met, it alerts the user
 * and sets the value of X to the middle of the range of N.
 * If both conditions are met, it calls the setupVariables, handleCarouselCreation and
 * updatePagination functions to update the carousel.
 */
function handleUpdate(){
    const n = parseInt(document.querySelector('#value-of-n').value)
    let x = parseInt(document.querySelector('#value-of-x').value)


    if(x < 1 || x >= n){
        alert("X should be between 1 and N-1")
        x = Math.floor(n / 2);
    }
    else if(n > getBooks().length){
        alert("N should be less than or equal to the number of books")
    }
    else{
        setupVariables(n, x)
        handleCarouselCreation(books.slice(0,n))
        updatePagination(0,n,x)
    }
}


/**
 * Sets up the global variables N and X, and updates the style of the slider track element based on N and X.
 * 
 * This function first increments X to account for the 0-based indexing used in the CSS calculations.
 * It then sets the global variables N and X to the values passed as arguments.
 * 
 * Finally, it updates the width and transform styles of the slider track element based on the values of N and X.
 * The width of the slider track is set to the width of each slide multiplied by N and divided by X.
 * The transform of the slider track is set to the negative of the width of each slide divided by N and multiplied by 2/3, offset by the width of one slide.
 * 
 * @param {number} n - The number of slides to display in the carousel.
 * @param {number} x - The index of the slide to display as the first slide.
 */
function setupVariables(n, x) { 
    window.N = n
    window.X = x
    document.querySelector('.slider .slide-track').style.width = `calc(100% / ${x+1} * ${n} * 3)`;
    document.querySelector('.slider .slide-track').style.transform = `translateX(calc(100% / ${n}/2/3 - 100% / 3))`;

    removeBoxAnimation()
    setTimeout(() => {
        handleBoxAnimationToggle(n, n, x)
    }, 100);

}


/**
 * Retrieves the current horizontal translation of the slider track.
 * 
 * This function first checks if the slider track has a transform style set.
 * If it does, it then parses the transform matrix to retrieve the horizontal
 * translation of the slider track. If the transform is not set, it defaults
 * to 0.
 * 
 * @returns {number} The current horizontal translation of the slider track.
 */
function getCurrentTranslateX() {
    const slider = document.querySelector('.slider .slide-track');

    const computedStyle = window.getComputedStyle(slider);
    const transform = computedStyle.transform;

    let translateX = 0;

    if (transform !== 'none') {
        const values = transform.match(/matrix\(([^)]+)\)/)[1].split(', ');
        translateX = parseFloat(values[4]);
    }

    return translateX
}

/**
 * Calculates the width of a single slide in the slider track.
 * 
 * This function first selects the slider track element. It then returns the
 * offset width of the slider track divided by the number of slides multiplied
 * by 3. This division is necessary because the slider track is set to be 3
 * times the width of the slider container, and the width of each slide is
 * calculated by dividing the width of the slider track by the number of slides.
 * 
 * @returns {number} The width of a single slide in the slider track.
 */
function getSlidingWidth() {
    const slider = document.querySelector('.slider .slide-track');
    return slider.offsetWidth / (window.N * 3.0);
}


/**
 * Calculates the number of slides to the left of the current position.
 * 
 * This function uses the current horizontal translation of the slider track
 * to calculate the number of slides that are to the left of the current
 * position. It does this by dividing the absolute value of the horizontal
 * translation by the width of a single slide, and then flooring the result
 * to the nearest whole number.
 * 
 * @returns {number} The number of slides to the left of the current position.
 */
function getLeftSlideCount(){
    return Math.floor(getCurrentTranslateX() * -1.0 / getSlidingWidth()) 
}


/**
 * Returns true if the time elapsed since the last anchor time is less than 400ms,
 * and false otherwise.
 * 
 * This function is used to throttle the gotoNextSlideAction and gotoPrevSlideAction
 * functions, so that they are not called more than once every 400ms.
 * 
 * @returns {boolean} - Whether the time elapsed since the last anchor time is less than 400ms.
 */
function throttle(){
    if(!window.anchorTime){
        return false
    }

    if(Date.now() - window.anchorTime < 400){
        return true
    }
    return false
}

/**
 * Moves the slider to the next slide.
 * 
 * This function moves the slider to the next slide by adjusting the horizontal
 * translation of the slider track. It does this by first checking if the time
 * elapsed since the last anchor time is less than 400ms, in which case it does
 * not do anything. If the time elapsed since the last anchor time is greater
 * than 400ms, it sets the new anchor time, and then adjusts the horizontal
 * translation of the slider track. If the number of slides to the left of the
 * current position plus X plus 1 is greater than or equal to N*3-2, it also
 * triggers a left shift after a 250ms delay. Otherwise, it does nothing.
 * 
 * @returns {undefined} - This function does not return anything.
 */
function gotoNextSlideAction() {
    if(throttle()){
        return
    }
    window.anchorTime = Date.now()

    const slider = document.querySelector('.slider .slide-track');

    const N = window.N
    const X = window.X

    if (getLeftSlideCount() + X + 2 >= (N * 3)-2){
        setTimeout(() => {
            console.log("shifting LEFT")
            slider.style.transition = 'none';
            slider.style.transform = `translateX(${getCurrentTranslateX() + slider.offsetWidth/3}px)`;
        }, 250)
    }

    handleBoxAnimationToggle(getLeftSlideCount() + 1, N, X)
    handleBoxAnimationToggle(getLeftSlideCount() + 2, N, X)

    updatePagination(getLeftSlideCount()+1, N, X)
    updatePagination(getLeftSlideCount()+2, N, X)
    slider.style.transition = 'all 200ms ease-in-out';
    slider.style.transform = `translateX(${getCurrentTranslateX() - getSlidingWidth()}px)`;
}



/**
 * Moves the slider to the previous slide.
 * 
 * This function moves the slider to the previous slide by adjusting the horizontal
 * translation of the slider track. It does this by first checking if the time
 * elapsed since the last anchor time is less than 400ms, in which case it does
 * not do anything. If the time elapsed since the last anchor time is greater
 * than 400ms, it sets the new anchor time, and then adjusts the horizontal
 * translation of the slider track. If the number of slides to the left of the
 * current position is less than or equal to 1, it also triggers a right shift
 * after a 250ms delay. Otherwise, it does nothing.
 * 
 * @returns {undefined} - This function does not return anything.
 */
function gotoPrevSlideAction() {
    if(throttle()){
        return
    }
    window.anchorTime = Date.now()
    const slider = document.querySelector('.slider .slide-track');

    if (getLeftSlideCount() <= 1){
        setTimeout(() => {
            console.log("shifting RIGHT")
            slider.style.transition = 'none';
            slider.style.transform = `translateX(${getCurrentTranslateX() - slider.offsetWidth/3}px)`;
        }, 250)
    }

    handleBoxAnimationToggle(getLeftSlideCount() + 1, N, X)
    handleBoxAnimationToggle(getLeftSlideCount(), N, X)

    updatePagination(getLeftSlideCount()+1, N, X)
    updatePagination(getLeftSlideCount(), N, X)
    slider.style.transition = 'all 200ms ease-in-out';
    slider.style.transform = `translateX(${getCurrentTranslateX() + getSlidingWidth()}px)`;
}


/**
 * Adds the 'blurr' class to all elements with the class 'box'.
 * This is used to toggle the box animation when the user navigates to a different slide.
 * 
 * @returns {undefined} - This function does not return anything.
 */
function removeBoxAnimation(){
    const boxes = document.querySelectorAll('.box')
    for(let i = 0; i < boxes.length; i++){
        boxes[i].classList.add('blurr')
    }
}

/**
 * Toggles the 'blurr' class on the boxes that are currently in view.
 * 
 * This function calculates the current box index based on the next target
 * and the number of slides `n`. It then iterates over the boxes in the 
 * carousel and toggles the 'blurr' class on the boxes that should be visible 
 * based on the index `nextTaget` and the number of visible slides `x`.
 * 
 * @param {number} nextTaget - The index of the next target slide.
 * @param {number} n - The total number of slides in one full cycle of the carousel.
 * @param {number} x - The number of slides to display at once.
 */
function handleBoxAnimationToggle(nextTaget, n, x){
    const boxes = document.querySelectorAll('.box')


    let currentBox = nextTaget
    while(currentBox - n >= 0)
        currentBox -= n

    for(let i = currentBox; i < 3*n; i=i+n){
        for(let j = 0;j < x && i+j < 3*n;j++){
            boxes[i+j].classList.toggle('blurr')
        }
    }
}