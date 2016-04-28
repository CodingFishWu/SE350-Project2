"use strict";

class ChairmanPermissionCtrl {
	constructor($state, UserService) {
		this.$state = $state
		this.UserService = UserService;

		this.getUsers()
	}

	getUsers() {
		let self = this;
		self.users = []
		self.reviewers = []

		self.UserService.query(function(result) {
			console.log(result)
			for (let user of result.User) {
				if (user.role=='reviewer') {
					self.reviewers.push(user)
				}
				else if (user.role=='user') {
					self.users.push(user)
				}
			}
			console.log(self.users)
		})
	}

	remove(index) {
		let self = this
		let user = new self.UserService({
			id: self.reviewers[index].id,
			name: self.reviewers[index].name,
			role: 'user'
		})
		user.$put(function(result) {
			alert('删除成功，该用户不再是审阅人')
			self.getUsers()
		})
	}

	add() {
		let self = this
		if (!self.user)
			return
		let user = new self.UserService({
			id: self.user.id,
			name: self.user.name,
			role: 'reviewer'
		})
		user.$put(function(result) {
			alert('授权成功，该用户成为了审阅人')
			self.getUsers()
		})
	}
}

angular.module('chairmanPermissionModule', [])
.controller('chairmanPermissionCtrl', ['$state', 'UserService', ChairmanPermissionCtrl])
