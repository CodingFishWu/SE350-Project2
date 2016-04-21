"use strict";

class UserMainCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('userMainModule', [])
.controller('userMainCtrl', ['$state', UserMainCtrl]);
