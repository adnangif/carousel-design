window.onload = main

/**
 * Initializes the carousel by getting the list of books, setting up the initial variables,
 * adding event listeners to the navigation buttons, and creating the carousel elements.
 * 
 * Called automatically when the window finishes loading.
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
};


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
 * Creates a carousel by appending card elements to the root element.
 * 
 * Each card is created by iterating over the books array and setting the innerHTML
 * of the card to a template literal containing the book's photo, title and description.
 * The card is then appended to the root element.
 * 
 * @param {Array<Object>} books - An array of book objects, each containing id, title, description, and photo attributes.
 */
function handleCarouselCreation(books){
    console.log('called handleCarouselCreation')
    const carousel = document.querySelector('#root');
    carousel.innerHTML = '';

    makeSlides(books, carousel)
    makeSlides(books, carousel)
    makeSlides(books, carousel)
}

function makeSlides(books, carousel){
    books.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('box')
        card.classList.add('blurr')
        card.innerHTML = `
            <img class="slide" src="${window.location.pathname}photos/${book.photo}" alt="${book.title}" />
            <div class="slide-content">
                <h5 class="slide-title">${book.title.split(':')[0]}</h5>
                <p class="slide-description">${clipString(book.description, 100)}</p>
            </div>
        `
        carousel.appendChild(card);
    });

}

/**
 * Updates the carousel based on the values of N and X in the inputs.
 * 
 * This function is called whenever the user updates the values of N and X.
 * It first parses the values of N and X from the inputs.
 * 
 * If X is not within the range of 1 to N-1, it is set to the midpoint of N.
 * If N is greater than the number of books, an alert is thrown.
 * 
 * Otherwise, the global variables N and X are set, and the carousel is recreated
 * with the first N books.
 */
function handleUpdate(){
    const n = parseInt(document.querySelector('#value-of-n').value)
    const x = parseInt(document.querySelector('#value-of-x').value)


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
    x++
    window.N = n
    window.X = x
    document.querySelector('.slider .slide-track').style.width = `calc(100% / ${x} * ${n} * 3)`;
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

    if (getLeftSlideCount() + X + 1 >= (N * 3)-2){
        setTimeout(() => {
            console.log("shifting LEFT")
            slider.style.transition = 'none';
            slider.style.transform = `translateX(${getCurrentTranslateX() + slider.offsetWidth/3}px)`;
        }, 250)
    }

    handleBoxAnimationToggle(getLeftSlideCount() + 1, N, X)
    handleBoxAnimationToggle(getLeftSlideCount() + 2, N, X)
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
    slider.style.transition = 'all 200ms ease-in-out';
    slider.style.transform = `translateX(${getCurrentTranslateX()+ getSlidingWidth()}px)`;
}


function removeBoxAnimation(){
    const boxes = document.querySelectorAll('.box')
    for(let i = 0; i < boxes.length; i++){
        boxes[i].classList.add('blurr')
    }
}

function handleBoxAnimationToggle(nextTaget, n, x){
    x--
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