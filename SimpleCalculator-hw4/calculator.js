window.onload = function() {
    var status=0;
    var old_result = document.getElementById("old_result");
    var now_result = document.getElementById("now_result");
    var error = document.getElementById("error");

	document.getElementById("now_result").innerHTML = "0";
	for (var i = 0; i <= 9; i++) {
		(function() {
            var tmp = i;
            document.getElementById(tmp+"").onclick = function() {
                getNum(tmp+"");
            }
		})();//一开始因为这样写出现了闭包的问题，后面使用匿名函数避免闭包
	}
	document.getElementById('*').onclick = function() {
		getOperator("*");
	};
	document.getElementById('/').onclick = function() {
        getOperator("/");
	};
	document.getElementById('.').onclick = function() {
		getNum(".");
	};
	document.getElementById('CE').onclick = function() {
        getInstruction("CE");
	};
	document.getElementById('(').onclick = function() {
        getOperator("(");
	};
	document.getElementById(')').onclick = function() {
        getOperator(")")
	};
	document.getElementById('-').onclick = function() {
        getOperator("-");
	};
	document.getElementById('+').onclick = function() {
        getOperator("+");
	};
	document.getElementById('=').onclick = function() {
        getInstruction("=");
	};
	document.getElementById('<-').onclick = function() {
		getInstruction("<-");
	};

    function getNum(option) {
        clearMsg();
        var data = now_result.innerHTML;
        if (status === 0 && data.length >= 28) {
        	showErr("本计算器算式长度最大为28! 请注意算式长度!");
        	return;
		}
        if (status === 1) {
            old_result.innerHTML = data;
            now_result.innerHTML = "0";
            data = "0";
            status = 0;
        }
        if (data === "0") {
            if (option === ".") {
                data += ".";
            } else {
                data = option;
            }
        } else {
            if (isNaN(data[data.length-1]) && option === ".") {
                showErr("输入非法，非数字后面不可以输入小数点，请确认输入！");
            } else {
                if (data[data.length-1] === ')')
                    data += "*";
                data += option;
            }
        }
        now_result.innerHTML = data;
    }

    function getOperator(option) {
        clearMsg();
        var data = now_result.innerHTML;
        if (status === 0 && data.length >=28) {
        	showErr("本计算器算式长度最大为28! 请注意算式长度!");
        	return;
		}
        if (status == 1) {
            old_result.innerHTML = data;
            now_result.innerHTML = data;
            data = data;
            status = 0;
        }
        if (option === ")") {
            var preNum = data.split('(').length - 1;
            var postNum = data.split(')').length - 1;
            if (preNum <= postNum) {
                showErr("输入非法，括号不匹配，请检查后输入!");
                return;
            }
            if (data[data.length-1] === '(') {
                showErr("括号内不可无内容，请检查后继续输入!");
                retrun;
            }
            data += option;
        } else if (option === "(") {
            if (data === "0") {
                data = "";
            } else if (!isNaN(data[data.length-1]) || data[data.length-1] === ")") {
                data += "*";
            }
            data += option;
        } else {
            if (isNaN(data[data.length-1]) && data[data.length-1] !== ")")
                data = data.slice(0, data.length-1);
            data += option;
        }
        now_result.innerHTML = data;
    }



    function getInstruction(option) {
        clearMsg();
        var data = now_result.innerHTML;
        if (option === "CE") {
            now_result.innerHTML = "0";
            old_result.innerHTML = "";
            status = 0;
            return;
        } else if (option === "<-") {
            if (data.length <= 1) {
                data = "0";
            } else {
                data = data.substring(0, data.length-1);
            }
        } else if (option === "=") {
            try {
                data = eval(data).toString();
                if (data == "" || data == "NaN") {
                	showErr("Syntax Error!");
                	status = 1;
                	return;
                }
                if (data.length > 14) {
                    data = parseFloat(data).toExponential(9)+"";
                    var size = data.substring(data.lastIndexOf('e')+1, data.length);
                    if(size >= -3 && size <= 0)
                        data = eval(data)+"";
                }
                status = 1;
            } catch(err) {
                showErr("Syntax Error!");
            }
        }
        now_result.innerHTML = data;
    }

    function showErr(msg) {
        error.innerHTML = msg;
        error.className = "error_show";
    }

    function clearMsg() {
    	error.className = "error_n_show";
       	error.innerHTML = "";
    }
};