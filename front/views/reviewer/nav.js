"use strict";

class ReviewerNavCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('reviewerNavModule', ['ui.router'])
.controller('reviewerNavCtrl', ['$state', ReviewerNavCtrl]);
