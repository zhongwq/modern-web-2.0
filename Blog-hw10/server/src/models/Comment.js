module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: DataTypes.STRING,
    status: { type: DataTypes.BOOLEAN, defaultValue: true }
  })

  return Comment
}