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
		let user = new this.UserService({
			name: self.name,
			password: self.password
		});
		user.$login(function(result, err) {
			self.$state.go('nav.book');
		}, function(error) {
			if (error.status == 403)
				alert("密码错误");
		});
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
			return;
		}
		let user = new this.UserService({
			name: self.name,
			password: self.password
		});
		user.$signup(function(result) {
			self.$state.go('nav.book');
		}, function(result) {
			if (result.status == 403) {
				alert("用户名已被使用");
			}
		});
	}
}

angular.module('loginModule', [])
.controller('loginCtrl', ['$state', 'UserService', loginCtrl])
.controller('signupCtrl', ['$state', 'UserService', signupCtrl]);
