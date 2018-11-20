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
    liEle.classList.add("card", "open", "show"); // FIXME: Remove "open" & "show" here.
    
    for(let cardClass of cardsArr) {
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

// TEST
createCardsElements(getRandomCards());

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
