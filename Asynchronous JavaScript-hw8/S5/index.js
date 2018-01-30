$(document).ready(function() {
	$("#button").mouseenter(function() {
		$("li>span").hide();
		$(".apb").unbind("click").click(autoClickByOrder);//防止多次绑定导致出问题
	});
});

function stopXhr(xhr) {
	$("#button").unbind("mouseleave").mouseleave(function () {
		if (xhr) {
		 	xhr.abort();
		}
		reset();
	});
}

$(document).ajaxSend(function(e, xhr, opt) {
	stopXhr(xhr);
});

function autoClickByOrder() {
	reset();
	$(".apb").unbind();
	var doList = $.makeArray($("li"));
	doList.sort(function () {
		return (Math.random() < 0.5);
	});
	var order = [];
	for (var i = 0; i < doList.length; i++){
		order.push($(doList[i]).text());
	};
	$(".order").text(order.join("、"));
	selectHaddler(order, doList, 0);
}


function selectHaddler(order, doList, currentSum) {
	var handlers = {
		"A" : aHaddler,
		"B" : bHaddler,
		"C" : cHaddler,
		"D" : dHaddler,
		"E" : eHaddler
	};
	try {
		if (order.length != 0) {
			var command = order.shift();
			var target = doList.shift();
			handlers[command].call(target, order, doList, currentSum);
		} else {
			bubbleHandler.call($("#info-bar"), currentSum);
		}
	} catch(e) {
		showMsg(e.msg);
		$.get("/fail"+command, function() {
			$(target).addClass("unactive");
			$(target).find("span").text("?");
			selectHaddler(order, doList, currentSum);
		});
	}
}

function aHaddler(order, doList, currentSum) {
	var target = this;
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
	$(target).find("span").text("...").show();
	if (Math.random() < 0.3)
		throw {msg: getFailMsg("A"), currentSum: currentSum};
	$.get("/A", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (doList.indexOf(this) != -1)
				$("li").removeClass("unactive");
		});
		$(target).addClass("unactive");
		showMsg(getMsg("A"));
		selectHaddler(order, doList, currentSum + parseInt(data));
	});
}

function bHaddler(order, doList, currentSum) {
	var target = this;
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
	$(target).find("span").text("...").show();
	if (Math.random() < 0.2)
		throw {msg: getFailMsg("B"), currentSum: currentSum};
	$.get("/B", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (doList.indexOf(this) != -1)
				$("li").removeClass("unactive");
		});
		$(target).addClass("unactive");
		showMsg(getMsg("B"));
		selectHaddler(order, doList, currentSum + parseInt(data));
	});
}

function cHaddler(order, doList, currentSum) {
	var target = this;
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
	$(target).find("span").text("...").show();
	if (Math.random() < 0.2)
		throw {msg: getFailMsg("C"), currentSum: currentSum};
	$.get("/C", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (doList.indexOf(this) != -1)
				$("li").removeClass("unactive");
		});
		$(target).addClass("unactive");
		showMsg(getMsg("C"));
		selectHaddler(order, doList, currentSum + parseInt(data));
	});
}

function dHaddler(order, doList, currentSum) {
	var target = this;
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
	$(target).find("span").text("...").show();
	if (Math.random() < 0.3)
		throw {msg: getFailMsg("D"), currentSum: currentSum};
	$.get("/D", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (doList.indexOf(this) != -1)
				$("li").removeClass("unactive");
		});
		$(target).addClass("unactive");
		showMsg(getMsg("D"));
		selectHaddler(order, doList, currentSum + parseInt(data));
	});
}

function eHaddler(order, doList, currentSum) {
	var target = this;
	$("li").addClass("unactive");
	$(target).removeClass("unactive");
	$(target).find("span").text("...").show();
	if (Math.random() < 0.3)
		throw {msg: getFailMsg("E"), currentSum: currentSum};
	$.get("/E", function(data) {
		$(target).find("span").text(data);
		$("li").each(function() {
			if (doList.indexOf(this) != -1)
				$("li").removeClass("unactive");
		});
		$(target).addClass("unactive");
		showMsg(getMsg("E"));
		selectHaddler(order, doList, currentSum + parseInt(data));
	});
}

function bubbleHandler(currentSum) {
	$(this).text(currentSum);
	showMsg("楼主异步调用战斗力感人，目测不超过" + currentSum);
	$(".apb").click(autoClickByOrder);
}

function showMsg(msg) {
	$(".message").html($(".message").html() + "<br/><br/>" + msg);//累计信息
	//$(".message").text(msg);//只显示最新信息
}


function getMsg(data) {
	if (data == "A")
		return "这是个天大的秘密";
	else if (data == "B")
		return "我不知道";
	else if (data == "C") 
		return "你不知道";
	else if (data == "D")
		return "他不知道";
	else if (data == "E")
		return "才怪";
}

function getFailMsg(data) {
	if (data == "A")
		return "这不是个天大的秘密";
	else if (data == "B")
		return "我知道";
	else if (data == "C") 
		return "你知道";
	else if (data == "D")
		return "他知道";
	else if (data == "E")
		return "才不怪";
}

function reset() {
	$(".message").text("");
	$(".order").text("");
	$("span").text("");
	$("li>span").hide();
	$("#info-bar").text("").removeClass("enabled");
	$("li").removeClass("unactive");
	$("li").unbind();
}