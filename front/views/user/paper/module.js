"use strict";

class UserPaperCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('userPaperModule', [])
.controller('userPaperCtrl', ['$state', UserPaperCtrl]);
