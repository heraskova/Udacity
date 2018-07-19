/*
 * Create a list that holds all of your cards
 */
const icons = ['fa fa-diamond', 'fa fa-diamond',
    'fa fa-paper-plane-o', 'fa fa-paper-plane-o',
    'fa fa-anchor', 'fa fa-anchor',
    'fa fa-bolt', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-cube',
    'fa fa-leaf', 'fa fa-leaf',
    'fa fa-bicycle', 'fa fa-bicycle',
    'fa fa-bomb', 'fa fa-bomb'
];

const bestMoves = Math.ceil(icons.length * 2 / 3);
const goodMoves = Math.ceil(bestMoves * 1.5);
const poorMoves = Math.ceil(bestMoves * 2);

const cardsContainer = document.querySelector(".deck");
const starsContainer = document.querySelector(".stars");
const movesContainer = document.querySelector(".moves");
const restartButton = document.querySelector(".restart");
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");

let moves = 0;
let firstCard = null;
let matchedCards = [];
let totalSeconds = 0;
let firstClick = true;
let timeTimer = null;

/**
 * Main function to initialize the game.
 */
function init() {
    let allCards = [];
    cardsContainer.innerHTML = "";
    movesContainer.innerHTML = '0';
    minutesLabel.innerHTML = '00';
    secondsLabel.innerHTML = '00';
    for (var i = 0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.innerHTML = `<i class="${icons[i]}"></i>`;
        allCards.push(card);
        addClickListener(card);
    }
    shuffle(allCards);
    for (var i = 0; i < allCards.length; i++) {
        cardsContainer.appendChild(allCards[i]);
    }
}

/**
 * Adds eventListener to a card.
 * 
 * @param card
 */
function addClickListener(card) {
    card.addEventListener("click", function() {
        if (firstCard != card) { //ignore same card click
            openCard(card);
            if (firstCard != null) {
                checkSame(firstCard, card);
                firstCard = null;
            } else {
                firstCard = card;
            }
        }
    });
}

restartButton.addEventListener("click", restart);
/**
 * Restart the game
 */
function restart() {
    init();
    firstClick = true;
    matchedCards = [];
    moves = 0;
    totalSeconds = 0;
    updateRating();
}

/**
 * Converts integer to 2 digits string.
 * @param val
 * @returns
 */
function pad(val) {
    return val > 9 ? val : "0" + val;
}

/**
 * Check cards have same icon
 * 
 * @param card1
 * @param card2
 */
function checkSame(card1, card2) {
    incMove();
    if (card1.innerHTML === card2.innerHTML) {
        setMatched(card1);
        setMatched(card2);
        checkFinished();

    } else {
        setTimeout(function() {
            resetCard(card1);
            resetCard(card2);
        }, 500);
    }
}

/**
 * Marks card as matched.
 * 
 * @param card
 */
function setMatched(card) {
    card.classList.add("match");
    matchedCards.push(card);
}

/**
 * Opens card icon.
 * 
 * @param card
 */
function openCard(card) {
    card.classList.add("open", "show");
    if (firstClick) {
        timeTimer = setInterval(function() {
            secondsLabel.innerHTML = pad(++totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60, 10));
        }, 1000);
        firstClick = false;
    }
}

/**
 * Closes card icon.
 * 
 * @param card
 */
function resetCard(card) {
    card.classList.remove("open", "show");
}

/**
 * Checks if all cards are matched. Restarts the game if user wants.
 */
function checkFinished() {
    if (matchedCards.length === icons.length) {
        clearInterval(timeTimer);
        if (confirm("Congratulation! You won with " + moves + " moves in " + totalSeconds + " seconds! Play again?")) {
            restart();
        }
    }
}

/**
 * Increment numbers of moves. Calls for "stars" update.
 */
function incMove() {
    moves++;
    updateRating();
}

/**
 * Calculates number of stars to show depending on current number of moves.
 */
function updateRating() {
    var rating = 0;
    if (moves <= poorMoves) {
        rating++;
        if (moves <= goodMoves) {
            rating++;
            if (moves <= bestMoves) {
                rating++;
            }
        }
    }
    setRating(rating);
    movesContainer.innerHTML = moves;
}

/**
 * Updates number of filled "stars"
 * 
 * @param rating
 */
function setRating(rating) {
    var stars = starsContainer.children;
    for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        // console.log(star);
        if (i < rating) {
            star.innerHTML = `<i class="fa fa-star"></i>`;
        } else {
            star.innerHTML = `<i class="fa fa-star-o"></i>`;
            console.log("Removed one star")
        }
    }
}

/*
 * Display the cards on the page - shuffle the list of cards using the provided
 * "shuffle" method below - loop through each card and create its HTML - add
 * each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


init();