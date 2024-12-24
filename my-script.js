
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

function clipString(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...'; // Truncate and add ellipsis
    }
    return str; // Return the original string if it's shorter than maxLength
}

window.onload = main

function main() {
    books = getBooks()
    const TOTAL_BOOKS = books.length
    const DISPLAYED_BOOKS = 4

    const carousel = document.querySelector('#root');

    const btnLeft = document.querySelector('.nav-btn.btn-left');
    const btnRight = document.querySelector('.nav-btn.btn-right');

    btnRight.addEventListener('click', gotoNextSlideAction)
    btnLeft.addEventListener('click', gotoPrevSlideAction)


    books.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('box')
        card.innerHTML = `
            <img class="slide" src="/photos/${book.photo}" alt="${book.title}" />
            <div class="slide-content">
                <h5 class="slide-title">${book.title.split(':')[0]}</h5>
                <p class="slide-description">${clipString(book.description, 100)}</p>
            </div>
        `
        carousel.appendChild(card);
    });
};



function getCurrentTranslateX(){
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

function getSlidingWidth() {
    const slider = document.querySelector('.slider .slide-track');
    return slider.offsetWidth / window.getComputedStyle(slider).getPropertyValue('--N');
}

function gotoNextSlideAction() {
    const slideWidth = getSlidingWidth();
    const slider = document.querySelector('.slider .slide-track');

    const currentTranslateX = getCurrentTranslateX();

    slider.style.transform = `translateX(${currentTranslateX - slideWidth}px)`;
}


function gotoPrevSlideAction() {
    const slideWidth = getSlidingWidth();
    const slider = document.querySelector('.slider .slide-track');

    const currentTranslateX = getCurrentTranslateX();

    slider.style.transform = `translateX(${currentTranslateX + slideWidth}px)`;
}