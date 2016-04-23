"use strict";

class UserNavCtrl {
	constructor($state) {
		this.$state = $state;
		this.userId = $state.params.userId;
	}
}

angular.module('userNavModule', [])
.controller('userNavCtrl', ['$state', UserNavCtrl]);
