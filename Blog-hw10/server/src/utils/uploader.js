const multer = require('multer')

const userStorage = multer.diskStorage({
  destination: 'public/images/',
  filename: function (req, file, cb) {
    var fileformat = (file.originalname).split('.');
    console.log(req.body.username+'-'+Date.now()+'.'+fileformat[fileformat.length-1])
    cb(null, req.body.username+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
  }
})

const markdownStorage = multer.diskStorage({
  destination: 'public/markdownImage/',
  filename: function (req, file, cb) {
    var fileformat = (file.originalname).split('.');
    console.log(req.body.username+'-'+Date.now()+'.'+fileformat[fileformat.length-1])
    cb(null, req.body.username+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
  }
})

module.exports = {
  userImg: multer({
    storage: userStorage
  }),
  markdownImg: multer({
    storage: markdownStorage
  })
}