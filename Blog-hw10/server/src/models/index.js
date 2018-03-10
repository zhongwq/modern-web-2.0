const Sequelize = require('sequelize')
const config = require('../config/config')

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

var User = sequelize.import('./User.js')
var Post = sequelize.import('./Post.js')
var Comment = sequelize.import('./Comment.js')
var Role = sequelize.import('./Role.js')
var Favourite = sequelize.define('Favourite')
var Role = sequelize.import('./Role.js')
var commentFavourite = sequelize.define('commentFavourite')
var userRelation = sequelize.define('userRelation')

User.belongsTo(Role, { as: 'UserRole' });
User.belongsToMany(User, { as: 'follower', through: 'userRelation' })
Post.hasMany(Comment, { as: 'comments' })
Post.hasMany(Favourite, {as: 'favourite'})
Post.belongsTo(User, { as: 'author' })
Comment.belongsTo(User, { as: 'author' })
Comment.hasMany(commentFavourite, {as: 'favourite'})
Favourite.belongsTo(User, { as: 'giver' })
commentFavourite.belongsTo(User, { as: 'giver' })


module.exports = {
  User: User,
  Post: Post,
  Comment: Comment,
  Role: Role,
  Favourite: Favourite,
  commentFavourite: commentFavourite,
  userRelation: userRelation,
  sequelize: sequelize,
  Sequelize: Sequelize
}