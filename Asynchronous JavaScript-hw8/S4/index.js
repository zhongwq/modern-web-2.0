var done = [];
var doList;
var doing = [];

$(document).ready(function() {
	$("#button").mouseenter(function() {
		done = [];
		$("li>span").hide();
		addEvent();
		$(".apb").click(autoClickByOrder);
	});

	$("#button").mouseleave(function() {
		reset();
	});
});

function autoClickByOrder() {
	done = [];
	doList = ['A', 'B', 'C', 'D', 'E'];
	$("li>span").hide();
	doList.sort(function() {
		return (0.5 - Math.random());
	});
	$(".order").text(doList.join('、'));
	addEvent();
	var target = doList.shift();
	getDataRandom.call(getLiByChar(target));
}

function getData() {
	var target = this;
	done.push(target);
	$("li").unbind();
	doing = $.get("/", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (done.indexOf(this) == -1)
				$(this).removeClass("unactive");
		});
		$(target).addClass("unactive");
		addEvent();
		if (done.length == 5)
			allDone();
	});
	$(target).find("span").text("...").show();
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
}

function getDataRandom() {
	var target = this;
	$(".apb").unbind().addClass("unactive");
	done.push(target);
	$("li").unbind();
	doing[doing.length] = $.get("/", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (done.indexOf(this) == -1)
				$(this).removeClass("unactive");
		});
		$(target).addClass("unactive");
		addEvent();
		if (done.length == 5)
			allDone();
		if (doList.length != 0) {
			getDataRandom.call(getLiByChar(doList.shift()));
		} else {
			$("#info-bar").click();
			$(".apb").addClass("unactive");
			$(".apb").unbind();
		}
	});
	$(target).find("span").text("...").show();
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
}

function addEvent() {
	$("li").each(function() {
		if (done.indexOf(this) == -1)
			$(this).click(getData);
	});
}

function getLiByChar(data) {
	switch (data) {
		case 'A':
			return $("li")[0];
		case 'B':
			return $("li")[1];
		case 'C':
			return $("li")[2];
		case "D":
			return $("li")[3];
		case 'E':
			return $("li")[4];
	}
}

function allDone() {
	$("#info-bar").addClass("enabled").click(function() {
		var ans = 0;
		$("span").each(function() {
			ans += parseInt($(this).text());
		});
		$(this).text(ans).unbind().removeClass("enabled");
	});
}

function reset() {
	$(".order").text("");
	$("span").text("");
	$("#info-bar").text("").removeClass("enabled");
	$("li").removeClass("unactive");
	$("li").unbind();
	for (var i = doing.length-1; i >= 0; i--)
		doing[i].abort();//取消正在执行的异步操作
}