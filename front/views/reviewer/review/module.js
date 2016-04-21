"use strict";

class ReviewerReviewCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('reviewerReviewModule', [])
.controller('reviewerReviewCtrl', ['$state', ReviewerReviewCtrl]);
