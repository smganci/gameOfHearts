var DumbAI = function (name) {

	var match = null;
	var position = null;
	var current_game = null;
	var player_key = null;

	this.setupMatch = function (hearts_match, pos) {
		match = hearts_match;
		position = pos;
	}

	this.getName = function () {
		return name;
	}

	// ///added in start



	// //display hand takes in an array of cards ie either the result of getDealtCards or getUnplayedCards
	this.displayHand = function (dealt) {
		//var ui_div;
		//model  $("#south_player")
		
		dealt.forEach(function (c) {
			//check to see if what game state is
			// var button = document.createElement("button");
			// button.textContent="testestsetstset";
			// button.setAttribute("class", "dumbCardn");

			if (position === Hearts.NORTH) {
				var button = document.createElement("button");
				// button.textContent="testestsetstset";
				button.setAttribute("class", "dumbCardn");
				$("#north_player").append(button);
	
			} else if (position === Hearts.EAST) {
				var button = document.createElement("button");
				// button.textContent="testestsetstset";
				button.setAttribute("class", "dumbCarde");
				$("#east_player").append(button);
			} else if(position===Hearts.WEST) {
				var button = document.createElement("button");
				// button.textContent="testestsetstset";
				button.setAttribute("class", "dumbCardw");
				$("#west_player").append(button);
			}
			
		})
	}
	//note: add a button that will let you pass and play cards
	this.updateHand = function () {
		if (position === Hearts.NORTH) {
			$(".dumbCardn").remove();
		} else if (position === Hearts.EAST) {
			$(".dumbCarde").remove();
		} else if(position===Hearts.WEST) {
			$(".dumbCardw").remove();			
		}
		
		// $(".selected").remove();
		
		this.displayHand(current_game.getHand(player_key).getUnplayedCards(player_key));
	}


	// ///added in end

	this.setupNextGame = function (game_of_hearts, pkey) {
		current_game = game_of_hearts;
		player_key = pkey;

		current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
			//added begin
			match.getPlayerByPosition(position).updateHand();
			// $("west_player").append("testtestest");
			//added end

			setTimeout(function () {
				// respective if statement in DumbAI.js

				if (e.getPassType() != Hearts.PASS_NONE) {
					var cards = current_game.getHand(player_key).getDealtCards(player_key);

					current_game.passCards(cards.splice(0, 3), player_key);
				}

			}, 2000);

		});

		current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
			
			//added begin
			match.getPlayerByPosition(position).updateHand();
			//added end
			setTimeout(function () {
				// respective if statement in DumbAI.js
				if (e.getStartPos() == position) {
					var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
					current_game.playCard(playable_cards[0], player_key);
				}
			}, 2000);

		});

		current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
			//added begin
			match.getPlayerByPosition(position).updateHand();
			//added end

			setTimeout(function () {
				// respective if statement in DumbAI.js
				if (e.getNextPos() == position) {
					var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
					current_game.playCard(playable_cards[0], player_key);
				}
			  }, 2000);
			
		});
	}
}

