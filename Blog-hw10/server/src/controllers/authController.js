const {User, userRelation, Post} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const fs = require('fs')
const path = require('path')

function jwtSignUser(user) {
  const ONE_WEEK = 60*60*24*7
  return jwt.sign(user, config.authServiceToken.secretKey, {
    expiresIn: ONE_WEEK
  })
}

function top(arr,comp){ 
  if(arr.length === 0)
    return
  var i = arr.length / 2 | 0
  for(; i >= 0; i--){ 
    if(comp(arr[i], arr[i * 2])) {
      exch(arr, i, i*2)
    }
    if(comp(arr[i], arr[i * 2 + 1])) {
      exch(arr, i, i*2 + 1)
    } 
  } 
  return arr[0];   
} 
    
function exch(arr,i,j){ 
  var t = arr[i]; 
  arr[i] = arr[j]; 
  arr[j] = t; 
}

function topK(arr,n,comp){ 
  if(!arr || arr.length == 0 || n <=0 || n > arr.length)
    return -1
  var ret = new Array(); 
  for(var i = 0; i < n; i++){ 
    var max = top(arr,comp); 
    ret.push(max); 
    arr.splice(0,1); 
  } 
  return ret; 
}

module.exports = {
  async register (req, res) {
    try {
      const imgDefault = 'public/images/default.jpg'
      var user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        path: imgDefault
      })
      if (user.email === 'admin@test.com')
        await user.update({UserRoleId: 0})
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch(err) {
      res.status(400).send({
        error: 'The email is in use!'
      })
    }
  },
  async login (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        include: [{ model: User, as: 'follower'}],
        where: {
          email: email
        }  
      })

      if (!user) {
        return res.status(400).send({
          error: "Can't find the user!"
        })
      }

      const follow = await userRelation.findAll({
        where: {
          followerId: user.id
        }  
      }).map(relation => {
        return relation.UserId
      })

      const userJson = user.toJSON()
      const isPasswordValid = await user.comparePassword(password)

      if (isPasswordValid) {
        res.send({
          user: userJson,
          follow: follow,
          token: jwtSignUser(userJson)
        })
      } else {
        res.status(400).send({
          error: "The password is wrong!"
        })
      }
    } catch(err) {
      res.status(400).send({
        error: "Somthing wrong with the server!"
      })
    }
  },
  async getData (req, res) {
    try {
      const user = await User.findOne({ where: {id: req.params.id}, include: [{ model: User, as: 'follower' }] })
      if (!user) {
        return res.status(400).send({
          err: "Wrong id!"
        })
      }

      const posts = await Post.findAll({
        where: {
          authorId: user.id
        }
      })

      const follow = await userRelation.findAll({
        where: {
          followerId: user.id
        }  
      }).map(relation => {
        return relation.UserId
      })

      res.send({user: user.toJSON(), posts: posts, follow: follow})
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async followUser (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const relation = await userRelation.create({
        UserId: req.body.id,
        followerId: result.id
      })
      res.send({
        info: "Follow success!"
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when following!'
      })
    }
  },
  async unfollowUser (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      var relation = await userRelation.findOne({
        where: {
          UserId: req.body.id,
          followerId: result.id
        }
      })
      await relation.destroy()
      res.send({
        info: "Unfollow success!"
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when unfollowing!'
      })
    }
  },
  async getTopUsers (req, res) {
    try {
      const users = await User.findAll({include: [{ model: User, as: 'follower' }]})
      const result = topK(users, (users.length > 5) ? 5 : users.length, function (a,b) {
        if (!b)
          return false
        return a.follower.length < b.follower.length
      }); 
      res.send({result: result})
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async updateInfo (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!(result && (result.id == req.body.id))) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const user = await User.findOne({where: {id: req.body.id}})
      await user.update(req.body)
      res.send({user: user})
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async changePower (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!(result && (result.UserRoleId === 0))) {
        return res.status(401).send({
          err: 'Not allow to change Power!'
        })
      }
      const user = await User.findOne({where: {id: req.body.id}})
      if (user.UserRoleId === 2) {
        await user.update({UserRoleId: 1})
      } else {
        await user.update({UserRoleId: 2})
      }
      res.send({info: "Change user power successfully!"})
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when changing power!'
      })
    }
  },
  async updateImg (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result) {
        await fs.unlink(path.join(__dirname, '../..', req.file.path))
        return res.status(400).send({
          err: 'User is not exist or is not signin!'
        })
      }
      const user = await User.findOne({
        where: {
          id: result.id
        }
      })
      if (!user) {
        await fs.unlink(path.join(__dirname, '../..', req.file.path))
        return res.status(400).send({
          err: 'User is not exist or is not signin!'
        })
      }
      if (user.path !== 'public/images/default.jpg')
        await fs.unlink(path.join(__dirname, '../..', user.path))
      await user.update({
        path: req.file.path
      })
      res.send({
        info: 'User image upload success'
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when upload img!'
      })
    }
  },
  async getFollowUser (req, res) {
    try {
      const follow = await userRelation.findAll({
        where: {
          followerId: req.params.id
        }  
      }).map(async (relation) => {
        return await User.findOne({
          where: {
            id: relation.UserId
          }
        })
      })
      res.send({
        follow: follow
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getFollower (req, res) {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.id
        },
        include: [{ model: User, as: 'follower' }]
      })
      res.send({
        follower: user.follower
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  }
}
