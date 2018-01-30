var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');
var db_address = 'mongodb://localhost/signinDemo_zhongwq';

mongoose.connect(db_address);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + db_address);
});

require('../models/user.js');

var User = mongoose.model('User');

router.get('/', function(req, res, next) {
  if (req.query.username) {
    if (req.session.user){
      if (req.session.user.username === req.query.username) {
        res.redirect('/detail');
      } else {
        var error = [];
        error.push("只能访问自己的数据哦!");
        return showErrInPage(res, 'detail', { title: '用户详情', user: req.session.user }, error);
      }
    }
  }
  res.redirect('/detail');
});

router.get('/regist', function(req, res, next) {
  req.session.user ? res.redirect('/detail'): res.render('signup', { title: '注册' });
});

router.post('/regist', function(req, res, next) {
  var userData = req.body;
  var error = [];
  if (!/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(userData.username))
    error.push("用户名首位为字母,中间为下划线、数字或字母,长度为6-18");
  if (userData.password.length < 6 || userData.password.length > 12)
    error.push("密码长度应为6-12位");
  if (!/^[1-9]\d{7}$/.test(userData.sid))
    error.push("学号应该为8位非零开头数字串");
  if (!/^[1-9]\d{10}$/.test(userData.phone))
    error.push("电话应该为11位非零开头数字串");
  if (!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-]+\.)[a-zA-Z0-9_-]+/.test(userData.email))
    error.push("邮箱不合法");
  if (error.length > 0)
    return showErrInPage(res, 'signup', { title: '注册', user: userData}, error);
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
      error.push("Something wrong with the server! Please try after serveral minutes!");
      return showErrInPage(res, 'signup', { title: '注册', user: userData}, error);
    }
    for (var i = 0; i < users.length; i++) {
      for (var key in userData) {
        if (key == "password" || key == "ensure_password")
          continue;
        if (users[i][key] == userData[key])
          error.push("The " + key + " is Repeated!");
      }
    }
    if (error.length > 0) {
      return showErrInPage(res, 'signup', { title: '注册', user: userData}, error);
    } else {
      var user = new User({
        username: userData.username,
        password: userData.password,
        sid: userData.sid,
        phone: userData.phone,
        email: userData.email
      });
      user.save(function(err, user) {
        if (err) {
          console.log(err);
          error.push("Something wrong with the server! Please try after serveral minutes!");
          return showErrInPage(res, 'signup', { title: '注册', user: userData}, error);
        }
        req.session.user = user;
        res.redirect('/detail');
      });
    } 
  });
});

router.get('/signin', function(req, res, next) {
  req.session.user ? res.redirect('/detail'): res.render('signin', { title: '登陆' });
});

router.post('/signin', function(req, res, next) {
  var signinData = req.body;
  var error = [];
  User.findOne({username: signinData.username}, function(err, user) {
    if (err) {
      console.log(err);
      error.push("Something wrong with the server! Please try after serveral minutes!");
      return showErrInPage(res, 'signin', { title: '登陆' }, error);
    }
    if (!user) {
      console.log("No user");
      error.push("The account is not exist!");
      return showErrInPage(res, 'signin', { title: '登陆' }, error);
    }
    user.comparePassword(signinData.password, function(err, isMatch) {
      if (err) {
        console.log(err);
        error.push("Something wrong with the server! Please try after serveral minutes!");
        return showErrInPage(res, 'signin', { title: '登陆' }, error);
      }
      if (isMatch) {
        req.session.user = user;
        res.redirect('/detail');
      } else {
        error.push("The password is not match!");
        return showErrInPage(res, 'signin', { title: '登陆' }, error);
      }
    });
  });
});

router.all('*', function(req, res, next) {
  req.session.user ? next(): res.redirect('/signin');
});

router.get('/detail', function(req, res, next) {
  res.render('detail', { title: '用户详情', user: req.session.user });
});

router.get('/logout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/signin');
});

function showErrInPage(res, page, data, error) {
  var errorHtml = "";
  for (var i = 0; i < error.length; i++){
    var err = "<div class=\"error\"><div class=\"msg\">"+error[i]+"</div><div class=\"close\">X</div></div>";
    errorHtml += err;
  }
  data.error = errorHtml;
  res.render(page, data);
}

module.exports = router;
