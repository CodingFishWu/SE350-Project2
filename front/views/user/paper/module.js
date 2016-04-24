"use strict";

class UserPaperCtrl {
	constructor($state, paper) {
		this.$state = $state;
		this.paper = paper;
	}
}

angular.module('userPaperModule', [])
.controller('userPaperCtrl', ['$state', 'paper', UserPaperCtrl]);
