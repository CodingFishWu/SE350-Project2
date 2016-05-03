'use strict'
/* log in modules */

class loginCtrl {
	constructor($state, UserService) {
		this.$state = $state;
		this.UserService = UserService;

		this.name = "";
		this.password = "";
		this.roles=[{
			name: '普通用户',
			role: 'user'
		}, {
			name: '主席',
			role: 'chairman'
		}, {
			name: '审阅人',
			role: 'reviewer'
		}]
		this.role = this.roles[0]
	}

	login() {
		let self = this;
		if (self.name == "" || self.password == "") {
			return;
		}
		
		self.UserService.query({'User.name': self.name}, function(result) {
			if (result.User != null && result.User[0].password == self.password) {

				// 根据不同的role  进入不同的页面
				let user = result.User[0];
				switch(self.role.role) {
				case 'user':
					self.$state.go('user.nav.main', {userId: user.id});
					break
				case 'reviewer':
					if (user.role == 'user') {
						alert('你不是审阅者')
						return
					}
					self.$state.go('reviewer.nav.main', {userId: user.id})
					break
				case 'chairman':
					if (user.role != 'chairman') {
						alert('你不是主席')
						return
					}
					self.$state.go('chairman.nav.main', {userId: user.id})
					break
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
