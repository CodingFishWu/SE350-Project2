"use strict";

class UserNavCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('userNavModule', [])
.controller('userNavCtrl', ['$state', UserNavCtrl]);
