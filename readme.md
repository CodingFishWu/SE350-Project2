### 运行程序
- 1，确保node 4.x以上版本
- 2，安装bower： npm install -g bower
- 3，克隆项目：https://github.com/CodingFishWu/SE350-Project2.git
- 4，进入项目根目录，安装node的依赖包：npm install，再安装前端的依赖包：bower install （以后所需依赖包都用bower来装，例如：bower install jquery --save-dev，后面的参数--save-dev意思是会把jquery和它的版本号写入bower.json文件里面，以便其他人方便安装）
- 5，npm start运行，常驻即可（因为angularJs会有跨域访问的问题，所以需要借助服务器来调试）
- 6，主页地址是：localhost:3000/index.html


### 框架
- angularjs官网的[tutorial](https://docs.angularjs.org/tutorial) 
- 主要用了[angular-ui-route](https://github.com/angular-ui/ui-router)来组织，直接问我会方便一点
- ui用bootstrap，类似modal这种用到jquery的组件用了[angular-bootstap](http://angular-ui.github.io/bootstrap/)作替代，不得不用的时候问我
- 所有涉及到资源请求的全部用[angular-resource](https://docs.angularjs.org/api/ngResource/service/$resource)进行了抽象，文件位置在js/resources.js，用法去看文档或问我


### 注意点
- 代码用了ES6的风格，所以需要在js文件最开始加"use strict"，具体不同体现在一些关键字上：class, let, const等
- 每个controller和tutorial上不太一样，因为把function剥离出来形成了一个类（在命令行里面对一个class用typeof检测时会发现，class其实就是function)
- 不懂问我

### 添加和查看数据
- 推荐使用postman(chrome插件),用post、put方法时，注意使用application/json，不然系统不会接受

