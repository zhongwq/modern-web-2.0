module.exports = {
  port: 8081,
  db: {
    database: process.env.DB_NAME || 'vue-blog',
    user: process.env.DB_USER || 'vue-blog',
    password: process.env.DB_PASSWD || 'vue-blog',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: './vue-blog.sqlite'
    }
  },
  authServiceToken: {
    secretKey: process.env.SECRET || 'secret'
  }
}