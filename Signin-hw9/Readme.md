# Signin Demo
在该路径下输入命令`npm install`后, 再输入`npm start`即可启用该Demo, 因为加上node_modules文件大小大于10M个人觉得有点大,所以就麻烦TA自己`npm install`一下啦!

    注：我在服务器进行测试的时候，我执行`npm install`出现错误，
    提示我node-gyp权限不足安装不了bcrypt@1.0.3这个包
    出错信息如下
    sh: 1: node-gyp: Permission denied
    通过谷歌得到一个较简单的解决方案
    通过输入命令
    npm config set unsafe-perm true再运行npm install
    就成功完成npm install了
 


