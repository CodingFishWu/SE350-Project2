"use strict";

class UserSubmitCtrl {
	constructor($state,PaperService) {
		this.$state = $state;
		this.PaperService = PaperService;

		let self = this;
		this.PaperService.query(function(result) {
			console.log(result);
			self.papers = result.Paper;
		})

	}


}

angular.module('userSubmitModule', [])
.controller('userSubmitCtrl', ['$state', 'PaperService', UserSubmitCtrl]);
