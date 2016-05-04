var myApp = angular.module('myApp',[
  'ui.router',
	'ui.bootstrap',
  'resources',
  'myFilters',
  'myUtils',

  'mainModule',

	'loginModule',

  'userNavModule',
  'userMainModule',
  'userSubmitModule',

  'reviewerNavModule',
  'reviewerMainModule',

  'chairmanNavModule',
  'chairmanMainModule',
  'chairmanPermissionModule'
  ]);

 
myApp.config(($stateProvider, $urlRouterProvider)=>{

  $urlRouterProvider.otherwise('404')
  .when('', 'main');

  // set up the states
  $stateProvider
    // main search page
    .state('main', {
      url: '/main',
      templateUrl: 'views/main/main.html',
      controller: 'mainCtrl as ctrl'
    })


    // login
    .state('login', {
      url: '/login',
      templateUrl: 'views/login/login.html',
      controller: 'loginCtrl as ctrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/login/signup.html',
      controller: 'signupCtrl as ctrl'
    })

    // for user page
    .state('user', {
      url: '/user/:userId',
      abstract: true,
      templateUrl: 'views/user/user.html'
    })
    .state('user.nav', {
      url: '/nav',
      templateUrl: 'views/user/nav.html',
      controller: 'userNavCtrl as ctrl',
      abstract: true
    })
    .state('user.nav.main', {
      url: '/main',
      templateUrl: 'views/user/main/main.html',
      controller: 'userMainCtrl as ctrl',
      data: {
        nav: 'main'
      }
    })
    .state('user.nav.submit', {
      url: '/submit',
      templateUrl: 'views/user/submit/submit.html',
      controller: 'userSubmitCtrl as ctrl',
      data: {
        nav: 'submit'
      }
    })

    // for reviewer page
    .state('reviewer', {
      url: '/reviewer/:userId',
      abstract: true,
      templateUrl: 'views/reviewer/reviewer.html'
    })
    .state('reviewer.nav', {
      url: '/nav',
      templateUrl: 'views/reviewer/nav.html',
      controller: 'reviewerNavCtrl as ctrl',
      abstract: true
    })
    .state('reviewer.nav.main', {
      url: '/main',
      templateUrl: 'views/reviewer/main/main.html',
      controller: 'reviewerMainCtrl as ctrl',
      data: {
        nav: 'main'
      }
    })

    // for chairman page
    .state('chairman', {
      url: '/chairman/:userId',
      abstract: true,
      templateUrl: 'views/chairman/chairman.html'
    })
    .state('chairman.nav', {
      url: '/nav',
      templateUrl: 'views/chairman/nav.html',
      controller: 'chairmanNavCtrl as ctrl',
      abstract: true
    })
    .state('chairman.nav.main', {
      url: '/main',
      templateUrl: 'views/chairman/main/main.html',
      controller: 'chairmanMainCtrl as ctrl',
      data: {
        nav: 'main'
      }
    })
    .state('chairman.nav.permission', {
      url: '/permission',
      templateUrl: 'views/chairman/permission/permission.html',
      controller: 'chairmanPermissionCtrl as ctrl',
      data: {
        nav: 'permission'
      }
    })

    /*
    **  not found
    */
    .state('404', {
      url: '/404',
      templateUrl: '404.html'
    });
});