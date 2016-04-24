"use strict";

class ReviewerPaperCtrl {
	constructor($state, paper) {
		this.$state = $state;
		this.paper = paper;
	}
}

angular.module('reviewerPaperModule', [])
.controller('reviewerPaperCtrl', ['$state', ReviewerPaperCtrl]);
