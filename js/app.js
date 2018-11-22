/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * Create a list that holds all of your cards
 */

function getRandomCards() {
    let cards = ['fa-diamond', 'fa-anchor', 'fa-paper-plane-o', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    cards = cards.concat(cards);
    // console.log("ORI cards: ", cards);

    let shuffledCards = shuffle(cards);
    console.log("Shuffled cards:", shuffledCards);
    return shuffledCards;
}

function createCardsElements(cardsArr) {
    const fragment = document.createDocumentFragment();
    // Create card's <li> element
    let liEle = document.createElement("li");
    liEle.classList.add("card");

    for (let cardClass of cardsArr) {
        liEle = liEle.cloneNode();
        // Created <i> and put into created <li>      
        let i = document.createElement("i");
        i.classList.add("fa", cardClass);
        liEle.appendChild(i);

        fragment.appendChild(liEle);
    }
    // document.body.appendChild(fragment);
    // Append all card's <li> to <ul class= "deck">
    let deck = document.querySelector(".deck");
    deck.appendChild(fragment);
}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function addEventToCard() {
    let deck = document.querySelector(".deck");
    deck.addEventListener('click', showCard);
}


function getICardContent(targetEle) {
    let i = targetEle.querySelector("i");
    let cls = i.classList;
    console.log("cls:", cls[1]);
    return cls[1];
}

let TMP_FIRST_GUESS_TARGET = "";
let COUNT_GUESS = 0;

const guess = {
    compare(guessTarget) {
        let thisGuess = getICardContent(guessTarget);
        let lastGuess = getICardContent(TMP_FIRST_GUESS_TARGET);

        // console.log("1: ", lastGuess, ", 2: ", thisGuess);

        if (lastGuess === thisGuess) {
            console.log("match!");
            // Show match correct CSS effect
            return true;
        } else {
            // Hide these two already guessed cards.            
            console.log("not correct.");
            return false;
        }

    }
};

/**
 * If guess doesn't not match serveral times (e.g. 3 times), remove one star.
 */
function removeStar() {
    CURRENT_ERROR_COUNTS++;
    if (CURRENT_ERROR_COUNTS === KEEP_START_LIMIT) {
        let starLis = document.querySelectorAll(".stars li");
        for (star of starLis) {
            if (star.style.display != "none") {
                star.style.display = "none";
                break;
            }
        }

        CURRENT_ERROR_COUNTS = 0;
    }
}

let KEEP_START_LIMIT = 4;
let CURRENT_ERROR_COUNTS = 0;

function showCard(event) {
    // console.log("click event fired", event.target);
    if (event.target && event.target.nodeName === "LI") {
        let classList = event.target.classList;

        // When user click the same card (which is already opend) twice, to avoid match the same card instance.
        if (classList.contains("open")) {
            console.log("Please click another card!");
            return;
        }

        toggleCardsOpenAndShow(event.target);

        if (TMP_FIRST_GUESS_TARGET === "") {
            // Assign first guess card
            TMP_FIRST_GUESS_TARGET = event.target;
        } else {
            // Guess flow
            let guessResult = guess.compare(event.target);
            if (guessResult) {
                TMP_FIRST_GUESS_TARGET.classList.toggle("match");
                event.target.classList.toggle("match");

                TMP_FIRST_GUESS_TARGET = "";
            } else {

                // 如果結果不相等就要把這兩張都蓋回去
                setTimeout(() => {
                    TMP_FIRST_GUESS_TARGET.classList.toggle("not-match");
                    event.target.classList.toggle("not-match");

                    event.target.classList.toggle("open");
                    event.target.classList.toggle("show");

                    TMP_FIRST_GUESS_TARGET.classList.toggle("open");
                    TMP_FIRST_GUESS_TARGET.classList.toggle("show");

                    TMP_FIRST_GUESS_TARGET = "";
                }, 500);

                // Must remove guess not match css class again
                TMP_FIRST_GUESS_TARGET.classList.toggle("not-match");
                event.target.classList.toggle("not-match");

                removeStar();

            }
            COUNT_GUESS++;
            document.querySelector(".moves").textContent = COUNT_GUESS;
        }

    }
}


function toggleCardsOpenAndShow(eventTarget) {
    eventTarget.classList.toggle("open");
    // FIXME: This setTimeout is only for css rotateY ?
    setTimeout(() => {
        eventTarget.classList.toggle("show");
    }, 200);

}

function restart() {
    COUNT_GUESS = 0;
    document.querySelector(".moves").textContent = COUNT_GUESS;

    clearCards();
    initGame();
}

function initGame() {
    createCardsElements(getRandomCards());
    addEventToCard();
}

function clearCards() {
    const deck = document.getElementsByClassName("deck");
    deck[0].innerHTML = "";
    /*
    const deckChilds = deck[0].getElementsByTagName("li");
    while(deckChilds.length > 0) {
        // console.log("item(0):", deckChilds.item(0));
        document.querySelector(".deck").removeChild(deckChilds.item(0));
    }
    */
}


/** Flow start */
document.querySelector(".restart").addEventListener('click', function () {
    let r = confirm("Do your really wnat to restart game?");
    if (r) {
        restart();
    }
});

initGame();

// createCardsElements(getRandomCards());
// addEventToCard();
