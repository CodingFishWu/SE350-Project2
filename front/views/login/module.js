'use strict'
/* log in modules */

class loginCtrl {
	constructor($state, UserService) {
		this.$state = $state;
		this.UserService = UserService;

		this.name = "";
		this.password = "";
	}

	login() {
		let self = this;
		if (self.name == "" || self.password == "") {
			return;
		}
		
		self.UserService.query({'User.name': self.name}, function(result) {
			if (result.User != null && result.User[0].password == self.password) {
				alert('登录成功');

				// 根据不同的role  进入不同的页面
				let user = result.User[0];
				switch(user.role) {
				case 'user':
					self.$state.go('user.nav.main', {userId: user.id});
					break;
				case 'reviewer':
					self.$state.go('reviewer.nav.main', {userId: user.id});
					break;
				case 'chairman':
					self.$state.go('chairman.nav.main', {userId: user.id});
					break;
				}
			}
			else {
				alert('密码错误');
			}
		})
	}
}

class signupCtrl {
	constructor($state, UserService) {
		this.$state = $state;
		this.UserService = UserService;

		this.name = "";
		this.password = "";
	}

	signup() {
		let self = this;

		if (self.name == "" || self.password == "") {
			alert("用户名和密码不能为空");
			return;
		}

		// first check if the user name exists
		self.UserService.query({'User.name': self.name}, function(result) {
			if (result.User != null) {
				alert('用户名已被注册');
				return;
			}

			// new user
			let user = new self.UserService({
				name: self.name,
				password: self.password,
				role: 'user'
			});
			// create a user
			user.$save(function(result) {
				alert('注册成功，请登录');
				self.$state.go('login');
			}, function(err) {
				console.log(err);
			});

		}, function(err) {
			console.log(err);
		})

		
	}
}

angular.module('loginModule', [])
.controller('loginCtrl', ['$state', 'UserService', loginCtrl])
.controller('signupCtrl', ['$state', 'UserService', signupCtrl]);
