var validator = {
    username: {
    	valid: false,
    	errMsg: "用户名首位为字母,中间为下划线、数字或字母,长度为6-18",
		isValid: function (username) {
			this.valid = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(username);
    		return this.valid;
		}
	},
	sid: {
		valid: false,
    	errMsg: "学号为8位非零开头数字串",
		isValid: function(sid) {
            this.valid = /^[1-9]\d{7}$/.test(sid);
            return this.valid;
		}
	},
    phone: {
    	valid: false,
    	errMsg: "电话为11位非零开头数字串",
		isValid: function(phone) {
    		this.valid = /^[1-9]\d{10}$/.test(phone);
    		return this.valid;
		}
    },
    email: {
    	valid: false,
    	errMsg: "请输入合法邮箱",
		isValid: function(email) {
			this.valid = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-]+\.)[a-zA-Z0-9_-]+/.test(email);
			return this.valid;
			//因为讲义上的邮箱规则不可以有数字，所以我自己写了一个邮箱规则
        }
	}
};

function showErr(msg) {
	var err = "<div class=\"error\"><div class=\"msg\">"+msg+"</div><div class=\"close\">X</div></div>";
	$(".errors").append(err);
}

function clearAllMsg() {
	$(".errors>div").remove();
}

$(document).ready(function() {
	$("input:not(.button)").blur(function() {
		clearAllMsg();
		if (!validator[this.id].isValid($(this).val())) {
            showErr(validator[this.id].errMsg);
        }
	});

	$("#submit").click(function() {
		clearAllMsg();
		$("input:not(.button)").blur();
		for (var key in validator) {
			if (!validator[key].valid) {
				showErr(validator[key].errMsg);
				return false;
			}
		}
		return true;
	});

	$("#reset").click(function() {
		clearAllMsg();
	});

	$(document).on("click", ".close", function() {
		$(this).parent().remove();
	});
});