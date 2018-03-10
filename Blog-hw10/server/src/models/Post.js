module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: { type: DataTypes.STRING, allowNull: false },
    content: DataTypes.STRING,
    status: { type: DataTypes.BOOLEAN, defaultValue: true }
  })

  return Post
}