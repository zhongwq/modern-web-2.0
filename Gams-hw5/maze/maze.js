window.onload = function() {
	var walls = document.getElementsByClassName("wall");
	var gameInfo = document.getElementById("gameInfo");
	var start = document.getElementById("start");
	var end = document.getElementById("end");
	var cheat_confirmer = document.getElementById("cheat_confirmer");

	var status = 0;
	var confirmed = 0;

	function showGameInfo(msg) {
        gameInfo.className = "hidden";
        setTimeout(function() {
            gameInfo.className = "show";
            gameInfo.textContent = msg;
		}, 200);
    }

	function startGame() {
		status = 0;
		confirmed = 0;
        showGameInfo("Playing...");

		function turn_lose(event) {
            if (status === 0) {
                event.target.className = event.target.className.replace(/wall wall_formal/, "wall wall_lose");
                status = 1;
                showGameInfo("You Lose!");
            }
        }

        function turn_formal(event) {
            event.target.className = event.target.className.replace(/wall wall_lose/, "wall wall_formal");
        }

		for (var i = 0; i < walls.length; i++) {
			walls[i].addEventListener("mouseover", turn_lose);
			walls[i].addEventListener("mouseout", turn_formal);
		}

        cheat_confirmer.addEventListener("mouseover", function() {
           confirmed  = 1;
        });

	}

	function endGame() {
		if (confirmed === 0 || status === 1) {
			if(status)
				return;
            showGameInfo("Don't cheat, you should start form the 'S' and move to 'E' inside the maze!");
        	status = 1;
        	return;
		} else {
			showGameInfo("You win!");
			status = 1;
		}
	}

	start.addEventListener("mouseover", startGame);
	end.addEventListener("mouseover", endGame);
}