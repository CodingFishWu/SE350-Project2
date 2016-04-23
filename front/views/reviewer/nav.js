"use strict";

class ReviewerNavCtrl {
	constructor($state) {
		this.$state = $state;
		
		this.userId = $state.params.userId;
	}
}

angular.module('reviewerNavModule', ['ui.router'])
.controller('reviewerNavCtrl', ['$state', ReviewerNavCtrl]);
