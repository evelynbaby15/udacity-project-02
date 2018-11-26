/* This anonymous function will wrap around your app/module's code */
(function () {
    'use strict'; // turn on Strict Mode

    /* then start your app/module's code */
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


    function getCardClassContent(targetEle) {
        let i = targetEle.querySelector("i");
        let cls = i.classList;
        // console.log("cls:", cls[1]);
        // e.g. "fa fa-diamond", only want the second class name
        return cls[1];
    }

    // Global variables
    let TMP_FIRST_GUESS_TARGET = "";
    let COUNT_GUESS = 0;

    const KEEP_STAR_LIMIT = 4;
    let ERROR_COUNTS = 0;
    let TOTAL_GUESS_PAIRS = 8;

    /**
     * oh...I don't have any idea how to handle these ugly global variables
     */
    function resetGlobalVars() {
        TMP_FIRST_GUESS_TARGET = "";
        COUNT_GUESS = 0;
        ERROR_COUNTS = 0;
        TOTAL_GUESS_PAIRS = 8;
    }

    const guess = {
        compare(guessTarget) {
            let thisGuess = getCardClassContent(guessTarget);
            let lastGuess = getCardClassContent(TMP_FIRST_GUESS_TARGET);

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
    function checkIfRemoveStar() {
        ERROR_COUNTS++;
        if (ERROR_COUNTS === KEEP_STAR_LIMIT) {
            let starLis = document.querySelectorAll(".stars li");
            if (starLis !== null) {
                starLis[0].remove();
            }
            ERROR_COUNTS = 0;
        }
    }

    function showCard(event) {
        // console.log("click event fired", event.target);
        if (event.target && event.target.nodeName === "LI") {
            let classList = event.target.classList;

            // When user click the same card (which is already opend) twice, to avoid match the same card instance.
            if (classList.contains("open")) {
                console.log("Please click another card!");
                return;
            }

            openCard(event.target);

            if (TMP_FIRST_GUESS_TARGET === "") {
                // Assign first guess card
                TMP_FIRST_GUESS_TARGET = event.target;
            } else {
                // Guess flow
                let guessResult = guess.compare(event.target);
                if (guessResult) {
                    displayMatch(event.target);

                    TOTAL_GUESS_PAIRS--;
                    if (TOTAL_GUESS_PAIRS === 0) {
                        showCongratulations();
                    }

                } else {
                    displayNoMatch(event.target);
                    checkIfRemoveStar();
                }
                // COUNT_GUESS++;
                document.querySelector(".moves").textContent = COUNT_GUESS++;
            }

        }
    }

    function showCongratulations() {
        stopTimer();

        document.querySelector(".modal-bk").style.display = "block";
        document.querySelector("#move-count").innerHTML = COUNT_GUESS;

        var eles = document.querySelectorAll(".stars li");
        document.querySelector("#star-count").innerHTML = eles.length;

        resetGlobalVars();
    }


    function displayMatch(target) {
        TMP_FIRST_GUESS_TARGET.classList.toggle("match");
        target.classList.toggle("match");

        TMP_FIRST_GUESS_TARGET = "";
    }

    function displayNoMatch(target) {
        // If 2 guessed are not match, then close these 2 cards at the same time
        setTimeout(() => {
            // Show not-match style effect
            TMP_FIRST_GUESS_TARGET.classList.toggle("not-match");
            target.classList.toggle("not-match");

            // Close 2 guessed cards
            target.classList.toggle("open");
            target.classList.toggle("show");

            TMP_FIRST_GUESS_TARGET.classList.toggle("open");
            TMP_FIRST_GUESS_TARGET.classList.toggle("show");

            // Reset first guess card
            TMP_FIRST_GUESS_TARGET = "";
        }, 500);

        // Must remove guess not match css class again
        TMP_FIRST_GUESS_TARGET.classList.toggle("not-match");
        target.classList.toggle("not-match");
    }

    function openCard(target) {
        target.classList.toggle("open");
        setTimeout(() => {
            target.classList.toggle("show");
        }, 200);

    }

    function restart() {
        // COUNT_GUESS = 0;
        clearCards();
        initGame();

        document.querySelector(".moves").textContent = COUNT_GUESS;
    }

    function initGame() {
        createCardsElements(getRandomCards());
        addEventToCard();
        createStars();
        resetGlobalVars();
        timer();
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


    function createStars() {
        document.querySelector(".stars").innerHTML = "";
        let stars = document.querySelector(".stars");
        for (let i = 0; i < 3; i++) {
            let li = document.createElement("li");
            let i = document.createElement("i");
            i.classList.add("fa", "fa-star");
            li.appendChild(i);
            stars.appendChild(li);
        }

    }

    let TIMER_ID = "";
    function stopTimer() {
        if (TIMER_ID !== "") {
            clearInterval(TIMER_ID);
        }
    }

    function timer() {
        // clear original timer id if exist older timer.
        stopTimer();

        var now = new Date().getTime();
        TIMER_ID = setInterval(function tick() {
            var current = new Date().getTime();
            let elapase = current - now;

            var h = Math.floor((elapase % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var m = Math.floor((elapase % (1000 * 60 * 60)) / (1000 * 60));
            var s = Math.floor((elapase % (1000 * 60)) / 1000);

            const time = `${h = (h < 10) ? "0" + h : h}:${m = (m < 10) ? "0" + m : m}:${s = (s < 10) ? "0" + s : s}`;
            document.querySelector(".timer").textContent = time;
            document.querySelector("#time_counts").innerHTML = time;

        }, 1000);
    }

    /** Bind event listener */
    document.querySelector(".restart").addEventListener('click', function () {
        let r = confirm("Do your really wnat to restart game?");
        if (r) {
            restart();
        }
    });

    document.querySelector(".modal-close").addEventListener('click', function () {
        document.querySelector(".modal-bk").style.display = "none";
    });

    document.querySelector(".btn-play").addEventListener('click', function () {
        document.querySelector(".modal-bk").style.display = "none";
        restart();
        createStars();
    });


    /** Flow start */
    initGame();

}()); // end of file