const authController = require('./controllers/authController')
const postController = require('./controllers/postController.js')
const authControllerPolicy = require('./policies/authControllerPolicy')
const uploader = require('./utils/uploader')

module.exports = (app) => {
  /**
  * Auth Part
  */
  app.get('/topusers',
    authController.getTopUsers)
  app.get('/userdata/:id',
    authController.getData)
  app.post('/register',
    authControllerPolicy.register,
    authController.register)
  app.post('/login',
    authController.login)
  app.post('/follow',
    authController.followUser)
  app.post('/unfollow',
    authController.unfollowUser)
  app.post('/updateInfo',
    authController.updateInfo)
  app.post('/updateImg',
    uploader.userImg.single('image'),
    authController.updateImg)
  app.post('/changePower',
    authController.changePower)
  app.get('/followUser/:id',
    authController.getFollowUser)
  app.get('/follower/:id',
    authController.getFollower)
  /**
  * Post Part
  */
  app.post('/admin/posts',
    postController.getAllPostsWithoutBlock)
  app.get('/posts',
    postController.getAllPosts)
  app.get('/posts/user/:id',
    postController.getAllPostsFromOnePerson)
  app.post('/admin/posts/user/:id',
    postController.getAllPostsFromOnePersonWithoutBlock)
  app.get('/post/:id',
    postController.getSinglePost)
  app.post('/admin/post/:id',
    postController.getSinglePostWithoutBlock)
  app.post('/post/favourite',
    postController.favouritePost)
  app.post('/post/unfavourite',
    postController.unfavouritePost)
  app.post('/posts/follow',
    postController.getAllFavouritePosts)
  app.post('/post/add',
    postController.addPost)
  app.post('/post/toggle',
    postController.togglePost)
  app.post('/post/update/:id',
    postController.updatePost)
  app.post('/post/comment/update/:id',
    postController.updateComment)
  app.post('/post/comment/add/:id',
    postController.addComment)
  app.post('/post/comment/toggle',
    postController.toggleComment)
  app.post('/post/comment/favourite',
    postController.favouriteComment)
  app.post('/post/comment/unfavourite',
    postController.unfavouriteComment)
  app.post('/post/delete',
    postController.deletePost)
  app.post('/post/comment/delete',
    postController.deleteComment)
  app.post('/post/image',
    uploader.markdownImg.single('image'),
    postController.uploadMarkdownImage)
}
