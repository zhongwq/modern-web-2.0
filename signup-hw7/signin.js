var http = require('http');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var PORT = 8000;
var users = (fs.existsSync('data.json'))? JSON.parse(fs.readFileSync('data.json')): {};
//本版本做了简单的数据的持久化，没有使用数据库，只是通过JSON的方式存储users的数据
//当程序以ctrl-c或crtl-z退出时，程序会自动保存数据

http.createServer(function(req, res) {
	switch(req.url) {
		case '/client.js':
			sendFile(res, 'client.js', 'text/javascript');
			break;
		case '/style.css':
			sendFile(res, 'style.css', 'text/css');
			break;
		case '/Logo.jpeg':
			sendFile(res, 'Logo.jpeg', 'image/jpeg');
		default:
			if (req.method === 'POST') {
				createUser(req, res);
			} else {
				showWebPage(req, res);
			}
	}
}).listen(PORT);

function sendFile(res, filepath, mime) {
	res.writeHead(200, {"Content-Type": mime});
	res.end(fs.readFileSync(filepath));
}

function getUserNameFromReq(req) {
	return querystring.parse(url.parse(req.url).query).username;
}

function showWebPage(req, res) {
	var username = getUserNameFromReq(req);
	if (!username || !isRegisteredUser(username)) {
		showSignUp(res);
	} else {
		showDetail(res, users[username]);
	}
}

function showSignUp(res) {
	sendHtml(res, "signup.html");
}

function showDetail(res, user) {
	sendHtml(res, "info.html", user);
}

function isRegisteredUser(username) {
	return !!users[username];
}

function isInvalid(userData, error) {
	if (!/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(userData.username)) {
		error.push("用户名首位为字母,中间为下划线、数字或字母,长度为6-18");
		return true;
	}
	if (!/^[1-9]\d{7}$/.test(userData.sid)) {
		error.push("学号应该为8位非零开头数字串");
		return true;
	}
	if (!/^[1-9]\d{10}$/.test(userData.phone)) {
		error.push("电话应该为11位非零开头数字串");
		return true;
	}
	if (!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-]+\.)[a-zA-Z0-9_-]+/.test(userData.email)) {
		error.push("邮箱不合法");
		return true;
	}
	for (var key in userData) {
		if (key === "username") {
			if (isRegisteredUser(userData.username)) {
				error.push("The username is Repeated!");
				return true;
			}
			continue;
		}
		for (var user in users) {
			if (users.hasOwnProperty(user) && users[user][key] == userData[key]) {
				error.push("The " + key + " is Repeated!");
				return true;
			}
		}
	}
	return false;
}

function createUser(req, res) {
	req.on('data', function(chunk) {
		var userData = getUserDataFromChunk(decodeURIComponent(chunk.toString()));
        var error = [];
		if (isInvalid(userData, error)) {
			sendHtml(res, 'signup.html', {errors: error});
			return;
		}
		users[userData.username] = userData;
		res.writeHead(301, {Location: '?username='+userData.username});
		res.end();
	})
}

function getUserDataFromChunk(chunk) {
	var params = chunk.match(/username=(.+)&sid=(.+)&phone=(.+)&email=(.+)/);
	return {
		username: params[1],
		sid: params[2],
		phone: params[3],
		email: params[4]
	};
}

function sendHtml(res, template, data) {
	res.writeHead(200, {"Content-Type": "text/html"});
	fs.readFile(template, function (err, page) {
		if (err)
			throw err;
		var pageContent = page.toString();
		for (var key in data) {
			if (key == "errors") {
				var errDiv = "";
				for (var i = 0; i < data.errors.length; i++)
					errDiv += "<div class=\"error\"><div class=\"msg\">"+data.errors[i]+"</div><div class=\"close\">X</div></div>";
				pageContent = pageContent.replace("<!--Error Div-->", errDiv);
			} else {
				pageContent = pageContent.replace("{{ "+key+" }}", data[key]);
			}
		}
		res.end(pageContent);
	});
}

process.on('SIGINT', function () {
	fs.writeFileSync('data.json', JSON.stringify(users));
  	console.log("Signin demo stopped. The data has been saved.");
  	process.exit();
});

process.on('SIGTERM', function () {
	fs.writeFileSync('data.json', JSON.stringify(users));
  	console.log("Signin demo stopped. The data has been saved.");
  	process.exit();
});

console.log('The server is listening to http://localhost:' + PORT);