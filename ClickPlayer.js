var ClickPlayer = function (name, ui_div) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    //stores selected cards for pass
    var cache = [];
    var playersCards = [];
    var pile = [];

    //variable to hold whether or not a card has been selected and played
    //if it is false then we do want to color
    //if it is true no color
    var selectPlay = false;

    //this should be the selected card dummy value is 0
    //stores selected card for play card
    var cardToPlay = 0;

    this.setupMatch = function (hearts_match, pos) {
        match = hearts_match;
        position = pos;
    }

    this.getName = function () {
        return name;
    }

    /*      
        full credit:
   yes  1. Other than providing a value for your player's name, --provide name via alert box in very beginning
   yes  2. the entire game should be operable via mouse operations. --ex: clicking to select cards and clicking pass and play
   yes  3. indication of when it is the user's turn. --message box says its your turn and cards light up indicatign you can select
   yes  4. visual representation of all of the remaining unplayed cards in your user's hand.--cards update after every turn and light up green if you can play them during your turn and red other wise
   yes  5. visual indication of which cards in your user's hand are eligible to be played and which are not.-- green font indicates you can play that card--only green cards can be selected red cannot
   yes  6. While a trick is played, there should be some sort of visual representation of which cards have been played by which player.--the four gray boxes in center display who played what card--white indicates that a card was just played and is on top
   yes  7. When a trick is over, there should be some sort of indication of which player won the trick.---trick winner on score bored and winner of trick displayed in message bxox
   yes  8. There should be a way to see what the current overall hearts match scoreboard totals are. --scoreboard at top displayes points after every round is finished
    */

    //display hand takes in an array of cards ie either the result of getDealtCards or getUnplayedCards
    this.dispayHand = function (dealt) {
        //every type you displayHand store the array of cards in playersCards
        playersCards = dealt;
        cache = [];
        var state = current_game.getStatus();

        var playableCards = current_game.getHand(player_key).getPlayableCards(player_key);

        dealt.forEach(function (c) {
            //check to see if what game state is
            var button = document.createElement("button");
            button.setAttribute("class", "card");
            button.textContent = c.toString();
            if (state === Hearts.PASSING) {
                button.onclick = function () {
                    //don't allow to toggle to selected if too much in cache
                    //if already already selected unselect and remove from cache
                    if (button.classList.contains("selected")) {
                        button.classList.toggle("selected");
                        var removeIndex;
                        for (var i = 0; i < cache.length; i++) {
                            if (cache[i] === c) {
                                removeIndex = i;
                            }
                        }
                        //splice out the card you want to remove and then concat back together
                        var front = cache.splice(0, removeIndex);
                        var end = cache.splice(removeIndex + 1, cache.length);
                        cache = front.concat(end);
                    } else {
                        //only add to cache and toggle if cache is less than 3
                        if (cache.length < 3) {
                            button.classList.toggle("selected");
                            cache.push(c);
                        }
                    }
                }
            } 
            
            else{
                
               
                if (playableCards.includes(c)) {

                    button.classList.toggle("enabled");
                } else {
                    button.classList.toggle("disabled");
                }

                ///done with highlight

                cache = [];
                button.onclick = function () {
                    if (button.classList.contains("selected")) {
                        button.classList.toggle("selected");
                        //dummy value
                        cardToPlay = 0;
                    } else if (cardToPlay == 0) {
                        if (button.classList.contains("enabled")) {
                            button.classList.toggle("selected");
                            cardToPlay = c;
                        }

                    }
                }
            }
            ui_div.append(button);
        })
    }
    //note: add a button that will let you pass and play cards
    this.updateHand = function () {
        cache = [];
        $(".card").remove();
        this.dispayHand(current_game.getHand(player_key).getUnplayedCards(player_key));
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
        current_game = game_of_hearts;
        player_key = pkey;
        game_of_hearts.registerEventHandler(Hearts.ALL_EVENTS, function (e) {
            console.log(e.toString());
            //scoreboard update
            var sb = match.getScoreboard();
            $("#North").text(match.getPlayerName(Hearts.NORTH) + ": " +
                sb[Hearts.NORTH]);
            $("#South").text(match.getPlayerName(Hearts.SOUTH) + ": " +
                sb[Hearts.SOUTH]);
            $("#East").text(match.getPlayerName(Hearts.EAST) + ": " +
                sb[Hearts.EAST]);
            $("#West").text(match.getPlayerName(Hearts.WEST) + ": " +
                sb[Hearts.WEST]);
        
        });

        //want to update who is leading
        game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
           
            $("#Leading").text("Leading: " + e.getStartPos());

            var leadingPlayer = e.getStartPos();
            // console.log("in trick start event leading player is "+leadingPlayer+" and position is : "+ position);
            //basically for trick start and continue 
            cache = [];

            var equality=leadingPlayer==position;
            console.log("the result of checking equality of leading player and position is " +equality);
            match.getPlayerByPosition(position).updateHand();
            if (leadingPlayer == position) {
                console.log("went into if statement checking to see if leading player equals position");


                $("#playCard").click(function () {
                    //on click we want to check to see if cache is equal to one
                    if (cardToPlay !== 0) {

                        current_game.playCard(cardToPlay, player_key);
                        cache = [];
                        cardToPlay = 0;
                    } else {
                    }
                });
            }else{
                $(".card").removeClass("enabled");
                $(".card").removeClass("disabled");
            }
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
            //if its your turn then display the playable cards and toggle them to class playable
            cache = [];

            match.getPlayerByPosition(position).updateHand();
            console.log("In Trick continue the position is: " + e.getNextPos());
            if (e.getNextPos() === position) {
                $("#messageBox").text("It is your turn.  Pick a green card and click play card!");

                $("#playCard").click(function () {

                    //on click we want to check to see if cache is equal to one
                    if (cardToPlay !== 0) {
                        //need to get the actual card
                        current_game.playCard(cardToPlay, player_key);
                        cache = [];
                        cardToPlay = 0;
                    }
                });
            }else{
                $("#messageBox").text("");
                match.getPlayerByPosition(position).updateHand();
                $(".card").removeClass("enabled");
                $(".card").removeClass("disabled");
            }
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
            var sb = match.getScoreboard();
           

            $("#North").text(match.getPlayerName(Hearts.NORTH) + ": " +
                sb[Hearts.NORTH]);
            $("#South").text(match.getPlayerName(Hearts.SOUTH) + ": " +
                sb[Hearts.SOUTH]);
            $("#East").text(match.getPlayerName(Hearts.EAST) + ": " +
                sb[Hearts.EAST]);
            $("#West").text(match.getPlayerName(Hearts.WEST) + ": " +
                sb[Hearts.WEST]);            
            $("#TrickWinner").text("Trick Winner: " + e.getTrick().getWinner());

            
            match.getPlayerByPosition(position).updateHand();

            if (e.getTrick().getWinner() === Hearts.SOUTH) {
                $("#messageBox").text("You won the trick! Pick any card.");
            } else {
                $("#messageBox").text(e.getTrick().getWinner() + " won the trick!");
            }
            //empty cardpile
            $(".northPlay").removeClass("top");
            $(".southPlay").removeClass("top");
            $(".eastPlay").removeClass("top");
            $(".westPlay").removeClass("top");
            $(".northPlay").text("");
            $(".southPlay").text("");
            $(".eastPlay").text("");
            $(".westPlay").text("");
        });

        //idea remove classes enabled and disabeld if not turn

        game_of_hearts.registerEventHandler(Hearts.CARD_PLAYED_EVENT, function (e) {
       
            var player = e.getPosition();
            var card = e.getCard();
           
            $("#messageBox").text("");

            if (player === Hearts.NORTH) {
                $(".northPlay").text("North played: " + card.toString());
                $(".northPlay").addClass("top");
       
                $(".westPlay").removeClass("top");
                $(".eastPlay").removeClass("top");
                $(".southPlay").removeClass("top");
            } else if (player === Hearts.WEST) {
                $(".westPlay").text("West played: " + card.toString());
                $(".westPlay").addClass("top");

                $(".northPlay").removeClass("top");
                $(".southPlay").removeClass("top");
                $(".eastPlay").removeClass("top");
            } else if (player === Hearts.EAST) {
                $(".eastPlay").text("East played: " + card.toString());
                $(".eastPlay").addClass("top");

                $(".northPlay").removeClass("top");
                $(".southPlay").removeClass("top");
                $(".westPlay").removeClass("top");
            } else {
                $(".southPlay").text("South played: " + card.toString());
                $(".southPlay").addClass("top");

                $(".northPlay").removeClass("top");
                $(".westPlay").removeClass("top");
                $(".eastPlay").removeClass("top");
            }


        });

        game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
            match.getPlayerByPosition(position).dispayHand(current_game.getHand(player_key).getDealtCards(player_key), position);
            var state = current_game.getStatus();
            if (state === Hearts.PASSING) {
                //if passing update pass type in scorebar
                $("#messageBox").text("Pick three cards to pass!");
                var pt = e.getPassType();
                var passType;
                if (pt === Hearts.PASS_LEFT) {
                    passType = "Left";
                } else if (pt === Hearts.PASS_RIGHT) {
                    passType = "Right";
                } else if (pt == Hearts.PASS_ACROSS) {
                    passType = "Across";
                } else if (pt === Hearts.PASS_NONE) {
                    passType = "None";
                }
                $("#Pass").text("Pass: " + passType);
            
                $("#passCards").click(function () {
                    if (cache.length === 3) {
                        if (pt !== Hearts.PASS_NONE) {
                            current_game.passCards(cache, player_key);
                        }
                        cache = [];
                        if (pt !== Hearts.PASS_NONE) {
                            $("#messageBox").text("You have passed three cards!");
                        } else {
                            $("#messageBox").text("The pass type is none.");
                        }

                    }
                });
            }
        });
    }
}
