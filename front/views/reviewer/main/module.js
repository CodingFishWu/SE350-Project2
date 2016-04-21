"use strict";

class ReviewerMainCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('reviewerMainModule', [])
.controller('reviewerMainCtrl', ['$state', ReviewerMainCtrl]);
