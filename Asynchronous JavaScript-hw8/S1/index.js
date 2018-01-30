var done = [];
var doing;

$(document).ready(function() {
	$("#button").mouseenter(function() {
		done = [];
		$("li>span").hide();
		addEvent();
	});

	$("#button").mouseleave(function() {
		reset();
	});
});

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
	$("span").text("");
	$("#info-bar").text("").removeClass("enabled");
	$("li").removeClass("unactive");
	$("li").unbind();
	if (doing)
		doing.abort();//取消正在执行的异步操作
}