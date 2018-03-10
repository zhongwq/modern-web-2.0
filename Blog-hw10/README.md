# Blog using Vue2

> It's the final project of modern web programming 2.0

博客的主要功能有

* 基本的Blog功能
* 用户的注册、登录、登出
* blog的评论、点赞，评论的点赞
* 权限管理
    * 普通用户
        1. 能够看到和评论所有人的blog
        2. 只能够修改自己的blog和评论
    * 管理员
        1. 可以隐藏所有人的blog或者评论，隐藏后显示“该内容已被管理员隐藏”
        2. 高级管理员可以赋予(撤销)普通用户普通管理员的职务
* 博客分页
* 博客搜索
* **站内热门推荐(使用Top-K算法进行筛选)**
* **用户头像设置，个人基本信息修改**
* **关注与粉丝的实现**

## Client Part

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
## Server Part
为了方便配置服务端环境，使得不需要进行mongoDB等数据库的安装、配置就可以启用该后端进行使用，我的后端服务器尝试应用的数据库是SQLite3，相关的Node.js库则使用了Sequelize，后端监听的端口为8081，具体命令操作如下:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm start

# Check the code style using eslint
npm run lint
```


