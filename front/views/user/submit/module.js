"use strict";

class UserSubmitCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('userSubmitModule', [])
.controller('userSubmitCtrl', ['$state', UserSubmitCtrl]);
