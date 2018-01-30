window.onload = function() {
    var gameCtl = document.getElementById("gameCtl");
    var time = document.getElementById("time");
    var status = document.getElementById("status");
    var score = document.getElementById("score");
    var game = document.getElementById("main");
    var game_box = document.getElementById("game_box");
    var gameSizeInfo = document.getElementById("size");
    var gameSizeCtl = document.getElementById("gameSizeCtl");
    var holes;

    var game_status = 0;
    var time_content = 30;
    var score_content = 0;
    var size_select = [3, 5, 10];
    var size_index = 2;

    function makeGameBox() {
        for (var i = 0; i < size_select[size_index]*size_select[size_index]; i++) {
            var new_child = document.createElement("input");
            new_child.type = "radio";
            new_child.className = "hole normal";
            game.appendChild(new_child);
        }
        holes = document.getElementsByClassName("hole normal");
        for (var i = 0; i < size_select[size_index]*size_select[size_index]; i++) {
            holes[i].addEventListener("click", button_click);
        }
    }

    makeGameBox();

    var interval;

    function endGame() {
        clearInterval(interval);
        game_status = 0;
        for (var i = 0; i < size_select[size_index]*size_select[size_index]; i++) {
            holes[i].checked = false;
        }
        alert("Game Over!\nYou get " + score_content +" scores!");
        status.textContent = "Game Over!";
    }

    function status_change() {
        if (game_status) {
            endGame();
        } else {
            gameReset();
            createMole();
            interval = setInterval(function() {
                time_content--;
                time.textContent = time_content;
                if (time_content === 0) {
                    status_change();
                }
            }, 1000);
        }
    }

    function gameReset() {
        time_content = 30;
        score_content = 0;
        time.textContent = time_content;
        score.textContent = score_content;
        game_status = 1;
        status.textContent = "Playing...";
    }

    function createMole() {
        var mole = Math.floor(Math.random()*(size_select[size_index]*size_select[size_index]-1));
        holes[mole].setAttribute("checked", true);
        holes[mole].checked = true;
    }

    function button_click(event) {
        if (game_status) {
            if (event.target.hasAttribute("checked")) {
                score_content++;
                score.textContent = score_content;
                event.target.checked = false;
                event.target.removeAttribute("checked");
                createMole();
            } else {
                score_content--;
                score.textContent = score_content;
                event.target.checked = false;
            }
        } else {
            event.target.checked = false;
        }
    }

    function changeGameSize() {
        if (game_status)
            endGame();
        for (var i = 0; i < size_select[size_index]*size_select[size_index]; i++)
            holes[i].removeEventListener("click", button_click);
        while(game.hasChildNodes()) {
            game.removeChild(game.firstChild);
        }//删除game中所有hole
        size_index = (size_index+1)%3;
        game_box.className = "game size_"+size_select[size_index];
        makeGameBox();
        gameSizeInfo.textContent = size_select[size_index]+"*"+size_select[size_index];
        for (var i = 0; i < size_select[size_index*size_index]; i++) {
            holes[i].addEventListener("click", button_click);
        }
    }//当用户游戏中修改游戏尺寸时，先结束当前游戏，弹出分数信息。不在游戏中时，直接修改游戏尺寸。

    gameCtl.addEventListener("click", status_change);

    gameSizeCtl.addEventListener("click", changeGameSize);

    for (var i = 0; i < size_select[size_index]*size_select[size_index]; i++) {
        holes[i].addEventListener("click", button_click);
    }
};