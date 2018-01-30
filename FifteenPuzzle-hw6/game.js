var count = 0;//步数统计
var time = 0;//时间完成统计
var empty = new Array(16);//用于查看位置是否为空
var images = ["images/panda.jpg", "images/huoyin.jpeg", "images/longzhu.jpeg", "images/xiaomai.jpeg", "images/xiaomai1.jpeg"];
var image_index = 0;
var status = 0;
var timeInfo;
var countInfo;
var timeInterval;//用于时间计数

window.onload = function() {
    timeInfo = document.getElementById("time");
    countInfo = document.getElementById("count")
    document.getElementById("changeImg").addEventListener("click", changeImg);
    document.getElementById("replay").addEventListener("click", distribute);
    document.getElementById("refresh").addEventListener("click", reset);
    document.getElementById("uploadImg").addEventListener("click", chooseImg);
    document.getElementById("image").addEventListener("change", uploadImg);
    makeGameBox();
};

function makeGameBox() {
    status = 0;
    for (var i = 0; i < 15; i++)
        empty[i] = false;
    empty[15] = true;
    var map = document.getElementById("map");
    while(map.firstChild)
        map.removeChild(map.firstChild);
    var ans = document.getElementById("answer");
    ans.style.backgroundImage = "url(" + images[image_index] + ")";
    for (var i = 0; i < 16; i++) {
        var puzzle = document.createElement("li");
        puzzle.setAttribute("id", ("img"+i));
        puzzle.setAttribute("class", ("pos"+i));
        puzzle.setAttribute("pos", i);
        if (i < 15) {
            puzzle.style.backgroundImage = "url(" + images[image_index] + ")";
        }
        map.appendChild(puzzle);
    }

    var puzzles = document.getElementsByTagName("li");
    for (var i = 0; i < 16; i++) {
        puzzles[i].onclick = function(i) {
            return function() {
                if (status == 0) {
                    alert("Please click the Play button to Play!");
                } else {
                    var nowPos = parseInt(puzzles[i].getAttribute("pos"));
                    var posx = parseInt(nowPos / 4);
                    var posy = nowPos % 4;
                    if (canMove(posx + 1, posy))
                        move(4*(posx + 1)+posy, nowPos);
                    else if (canMove(posx, posy - 1))
                        move(4*posx+(posy - 1), nowPos);
                    else if (canMove(posx - 1, posy))
                        move(4*(posx - 1)+posy, nowPos);
                    else if (canMove(posx, posy + 1))
                        move(4*posx+(posy+1), nowPos);
                    isWin();
                }
            }
        }(i);
    }
};//生成基本游戏界面

function canMove(posx, posy) {
    if (posx < 0 || posx > 3 || posy < 0 || posy > 3)
        return false;
    return empty[4*posx+posy];
}

function move(newPos, nowPos) {
    temp = empty[newPos];
    empty[newPos] = empty[nowPos];
    empty[nowPos] = temp;

    var nowPuzzle, newPuzzle;
    var puzzles = document.getElementsByTagName("li");
    for (var i = 0; i < 16; i++) {
        if (puzzles[i].getAttribute("pos") == newPos) {
            newPuzzle = puzzles[i];
        }
        if (puzzles[i].getAttribute("pos") == nowPos) {
            nowPuzzle = puzzles[i];
        }
    }
    var temp = nowPuzzle.getAttribute("class");
    nowPuzzle.setAttribute("class", newPuzzle.getAttribute("class"));
    nowPuzzle.setAttribute("pos", newPos);
    newPuzzle.setAttribute("class", temp);
    newPuzzle.setAttribute("pos", nowPos);
    ++count;
    countInfo.textContent = count;
}

function distribute() {
    clearInterval(timeInterval);
    makeGameBox();
    var puzzle = document.createElement("li");
    var temp_array = new Array(15);
    for (var i = 0; i < 15; i++)
        temp_array[i] = i;
    for (var i = 0; i < 5; i++) {
        temp_array.sort(function() {
            return Math.random() - 0.5;
        });
        for (var j = 0; j < 15; j += 3) {
            move(temp_array[i+1], temp_array[i]);
            move(temp_array[i+2], temp_array[i+1]);
        }
    }
    count = 0;
    countInfo.textContent = count;
    time = 0;
    timeInfo.textContent = time;
    status = 1;
    timeInterval = setInterval(function () {
        ++time;
        timeInfo.textContent = time;
    }, 1000);
};//通过三轮换可还原算法打乱图片编排

function reset() {
    count = 0;
    countInfo.textContent = count;
    time = 0;
    timeInfo.textContent = time;
    clearInterval(timeInterval);
    makeGameBox();
};//复原图片

function isWin() {
    if (status == 1) {
        var flag = true;
        var puzzles = document.getElementsByTagName("li");
        for (var i = 0; i < 16; i++) {
            if (puzzles[i].getAttribute("pos") != i) {
                flag = false;
                break;
            }
        }
        if (flag) {
            setTimeout(function() {
                alert("Win in " + time + "s with " + count + " steps!");
            },300);
            clearInterval(timeInterval);
            status = 0;
        }
    }
};//检查是否完成

function changeImg() {
    image_index = (image_index+1)%images.length;
    reset();
};//更换游戏图片

function chooseImg() {
   document.getElementById("image").click();
}

function uploadImg() {
    var file = document.getElementById("image");
    var urlReader = new FileReader(); 
    urlReader.onload = function(f){
        images[images.length] = f.target.result;
        image_index = images.length-1;
        reset();
    }
    urlReader.readAsDataURL(file.files[0])
}