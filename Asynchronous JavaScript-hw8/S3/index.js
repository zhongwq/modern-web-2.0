var done = [];
var doing = [];

$(document).ready(function() {
	$("#button").mouseenter(function() {
		done = [];
		addEvent();
		$("li>span").hide();
		$(".apb").click(autoClickAll);
	});

	$("#button").mouseleave(function() {
		reset();
	});
});

function autoClickAll() {
	done = [];
	$(".apb").unbind().addClass("unactive");
	$("li").unbind();
	$("li").each(function() {
		getData_All.call($(this));
	});
}

function getData_All() {
	var target = this;
	doing[doing.length] = $.get("/"+$(this).text(), function(data) {
		done.push(target);
		$(target).find("span").text(data);
		$(target).addClass("unactive");
		if (done.length == 5)
			allDone();
	});//get同样的地址会导致读取一样的返回值，所以这里在get的地址后加了相应的字母
	$(target).find("span").text("...").show();
	$("li").removeClass("unactive");
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
	var ans = 0;
	$("span").each(function() {
		ans += parseInt($(this).text());
	});
	$("#info-bar").text(ans);
}

function reset() {
	$("span").text("");
	$("#info-bar").text("").removeClass("enabled");
	$("li").removeClass("unactive");
	$("li").unbind();
	for (var i = 0; i < doing.length; i++) {
		doing[i].abort();//取消正在执行的异步操作
	}
}