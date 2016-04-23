"use strict";

class UserMainCtrl {
	constructor($state, PaperService) {
		this.$state = $state;
		this.PaperService = PaperService;

		this.userId = $state.params.userId;

		this.getPapers();
	}

	getPapers() {
		let self = this;
		console.log("test");
		self.PaperService.query({'Paper.user.id': self.userId}, function(result) {
			self.papers = result.Paper;
		});
	}
}

angular.module('userMainModule', [])
.controller('userMainCtrl', ['$state', 'PaperService', UserMainCtrl]);
