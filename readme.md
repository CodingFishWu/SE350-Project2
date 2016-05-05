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

### 测试
- 修改路由到主席页面，目前并未提供切换页面的功能

### 存在的问题
- 由于js使用es6的标准，浏览器支持度不够，所以在操作的时候回出现点一下不够、需要点两下的情况，这是我们设计时候的失误。虽然已经修改了许多地方（例如chrome从49升级到50版本以后，模态框无法弹出的问题，我们把class写法替换成ES5的写法就解决了），但其他地方仍然会有些许问题。
- angular默认所有数据获取都是异步的，为了能获取数据我们强行写成了同步（例如用递归函数的方式获取），导致了有时候获取数据会失败的情况。（详细说明为什么要同步：因为RMP系统好像对同一个session进行了限制，save key的时候只能one by one，不能简单写一个for循环将所有key一个一个全抛出去，这样会导致只有第一个key成功。只能够写成在第一个返回后再扔出第二个
- RMP系统有时候会莫名给一些错误的返回，在浏览器的'network'模块里面能清楚看到这一点
- 综上，操作时候如果遇到失败，可以刷新页面，或者多点两下进行测试。