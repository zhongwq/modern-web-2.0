const {User, userRelation, Post, Comment, Favourite, commentFavourite, Sequelize} = require('../models')
const blockPost = require('../utils/dataBlocker').blockFalsePosts
const blockComment = require('../utils/dataBlocker').blockFalseComments
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const Op = Sequelize.Op

module.exports = {
  async getAllPosts (req, res) {
    try {
      var posts = await Post.findAll({
        include: [{ model: User, as: 'author' },
                  { model: Comment, as: 'comments' },
                  { model: Favourite, as: 'favourite' }]
      })
      blockPost(posts)
      res.send({posts: posts})
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getAllPostsWithoutBlock (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result || result.UserRoleId > 1) {
        return res.status(400).send({
          err: "Not allow to get the data!"
        })
      }
      var posts = await Post.findAll({
        include: [{ model: User, as: 'author' },
                  { model: Comment, as: 'comments' },
                  { model: Favourite, as: 'favourite' }]
      })
      res.send({posts: posts})
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getAllPostsFromOnePerson (req, res) {
    try {
      var posts = await Post.findAll({
        where: { authorId: req.params.id },
        include: [{ model: User, as: 'author' },
                  { model: Comment, as: 'comments' },
                  { model: Favourite, as: 'favourite' }]
      })
      blockPost(posts)
      res.send({posts: posts})
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getAllPostsFromOnePersonWithoutBlock (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result || result.UserRoleId > 1) {
        return res.status(401).send({
          err: "Not allow to get the data!"
        })
      }
      var posts = await Post.findAll({
        where: { authorId: req.params.id },
        include: [{ model: User, as: 'author' },
                  { model: Comment, as: 'comments' },
                  { model: Favourite, as: 'favourite' }]
      })
      res.send({posts: posts})
    } catch (err) {
      console.log('error: ', err)
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getAllFavouritePosts (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      const follow = await userRelation.findAll({
        where: {
          followerId: result.id
        }  
      }).map(relation => {
        return {
          authorId: relation.UserId
        }
      })
      var posts = await Post.findAll({
        where: {
          [Op.or]: follow
        },
        include: [{ model: User, as: 'author' },
                  { model: Comment, as: 'comments' },
                  { model: Favourite, as: 'favourite' }]
      })
      if (result.UserRoleId > 1)  
        blockPost(posts)
      res.send({posts: posts})
    } catch (err) {
      console.log("Error: ", err)
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getSinglePost (req, res) {
    try {
      var post = await Post.findOne({
        where: {id: req.params.id},
        include: [{ model: User, as: 'author' },
                  { model: Favourite, as: 'favourite' }]
      })
      var comments = await Comment.findAll({
        where: {postId: req.params.id},
        include: [{ model: User, as: 'author' },
                  { model: commentFavourite, as: 'favourite' }]
      })
      blockComment(comments)
      if (post.status == false) {
        post = {id: post.id, title: '', content: '', block: true}
        res.send({post: post, comments: comments})
      } else {
        res.send({post: post.toJSON(), comments: comments})
      }
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async getSinglePostWithoutBlock (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result || result.UserRoleId > 1) {
        return res.status(400).send({
          err: "Not allow to get the data!"
        })
      }
      var post = await Post.findOne({
        where: {id: req.params.id},
        include: [{ model: User, as: 'author' },
                  { model: Favourite, as: 'favourite' }]
      })
      var comments = await Comment.findAll({
        where: {postId: req.params.id},
        include: [{ model: User, as: 'author' },
                  { model: commentFavourite, as: 'favourite' }]
      })
      res.send({post: post.toJSON(), comments: comments})
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when getting data!'
      })
    }
  },
  async addPost (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.id !== req.body.author) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const user = await User.findOne({
        where: {
          id: req.body.author
        }
      })
      if(!user) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        favourite: 0,
        authorId: req.body.author
      })
      res.send({
        post: post,
        info: 'Add post successfully!'
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when adding post! Please post the valid token!'
      })
    }
  },
  async updatePost (req, res) {
    try {
      const post = await Post.findOne({ where: {id: req.params.id}, include: [{ model: User, as: 'author' }] })
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.id !== post.author.id) {
        return res.status(400).send({
          err: 'The token is not valid or you are not the author! Please sign in and try again!'
        })
      }
      await post.update(req.body)
      res.send({
        info: 'Update post successfully!'
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when adding post!'
      })
    }
  },
  async updateComment (req, res) {
    try  {
      const comment = await Comment.findOne({ where: {id: req.body.id}, include: [{ model: User, as: 'author' }] })
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.id !== comment.author.id) {
        return res.status(400).send({
          err: 'The token is not valid or you are not the author! Please sign in and try again!'
        })
      }
      await comment.update(req.body)
      res.send({
        info: 'Update comment successfully!'
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when adding post!'
      })
    }
  },
  async favouritePost (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const user = await User.findOne({
        where: {
          id: result.id
        }
      })
      if(!user) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const favourite = await Favourite.create({
        PostId: req.body.postId,
        giverId: result.id
      })
      res.send({
        info: "Favourite successfully!"
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when add favourite to post!'
      })
    }
  },
  async favouriteComment (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      console.log(token, !result)
      if (!result) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const user = await User.findOne({
        where: {
          id: result.id
        }
      })
      if(!user) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const favourite = await commentFavourite.create({
        CommentId: req.body.commentId,
        giverId: result.id
      })
      res.send({
        info: "Favourite successfully!"
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when add favourite to comment!'
      })
    }
  },
  async unfavouritePost (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      var favourite = await Favourite.findOne({
        where: {
          PostId: req.body.postId,
          giverId: result.id
        }
      })
      await favourite.destroy()
      res.send({
        info: "Unfavourite successfully!"
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when remove favourite to post!'
      })
    }
  },
  async unfavouriteComment (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (!result) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      var favourite = await commentFavourite.findOne({
        where: {
          commentId: req.body.commentId,
          giverId: result.id
        }
      })
      await favourite.destroy()
      res.send({
        info: "Unfavourite successfully!"
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        err: 'Some wrong occured when remove favourite to comment!'
      })
    }
  },
  async addComment (req, res) {
    try {
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.id !== req.body.authorId) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const user = await User.findOne({
        where: {
          id: req.body.authorId
        }
      })
      if(!user) {
        return res.status(400).send({
          err: 'The token is not valid! Please sign in and try again!'
        })
      }
      const post = await Post.findOne({ where: {id: req.params.id} })
      if(!post) {
        return res.status(400).send({
          err: 'The post is not exist!'
        })
      }

      const comment = await Comment.create({
        content: req.body.comment,
        favourite: 0,
        authorId: req.body.authorId,
        PostId: req.params.id
      })
      res.send({
        info: 'Add comment successfully!'
      })
    } catch (err) {
      console.log("ERROR: ", err)
      res.status(400).send({
        err: 'Some wrong occured when adding post! Please post the valid token!'
      })
    }
  },
  async togglePost (req, res) {
    try {
      const post = await Post.findOne({ where: {id: req.body.id} })
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.UserRoleId > 1) {
        return res.status(400).send({
          err: 'You are not the admin! Please check your info!'
        })
      }
      await post.update({status: !post.status})
      res.send({
        info: 'Toggle post successfully!'
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when toggling post!'
      })
    }
  },
  async toggleComment (req, res) {
    try {
      const comment = await Comment.findOne({ where: {id: req.body.id} })
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.UserRoleId > 1) {
        return res.status(400).send({
          err: 'You are not the admin! Please check your info!'
        })
      }
      await comment.update({status: !comment.status})
      res.send({
        info: 'Toggle comment successfully!'
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when toggling post!'
      })
    }
  },
  async deletePost (req, res) {
    try {
      const post = await Post.findOne({ where: {id: req.body.id}, include: [{ model: User, as: 'author' }] })
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.id !== post.author.id) {
        return res.status(400).send({
          err: 'The token is not valid or you are not the author! Please sign in and try again!'
        })
      }
      await post.destroy()
      res.send({
        info: "Delete post successfully!"
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when deleting post!'
      })
    }
  },
  async deleteComment (req, res) {
    try {
      const comment = await Comment.findOne({ where: {id: req.body.id}, include: [{ model: User, as: 'author' }] })
      const token = req.body.token
      const result = jwt.verify(token, config.authServiceToken.secretKey)
      if (result.id !== comment.author.id) {
        return res.status(401).send({
          err: 'The token is not valid or you are not the author! Please sign in and try again!'
        })
      }
      await comment.destroy()
      res.send({
        info: "Delete comment Successfully!"
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when deleting comment!'
      })
    }
  },
  async uploadMarkdownImage (req, res) {
    try {
      res.send({
        url: req.file.path
      })
    } catch (err) {
      res.status(400).send({
        err: 'Some wrong occured when deleting comment!'
      })
    }
  }
}
