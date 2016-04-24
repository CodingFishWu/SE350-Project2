"use strict";

class UserSubmitCtrl {
	constructor($state,PaperService) {
		this.$state = $state;
		this.PaperService = PaperService;

	}

	submit() {
		let self = this;
		let paper = new self.PaperService({
			title: self.title,
			author: self.author,
			correspondingauthor: self.correspondingauthor,
			affiliation: self.affiliation,
			correspondingaddress: self.correspondingaddress,
			abstraction: self.abstraction,
			createdtime: Math.floor(new Date().getTime() / 1000),
			status: 'created'
		});
		paper.$save(function(result) {
			let id = result.id;
		})
	}


}

angular.module('userSubmitModule', [])
.controller('userSubmitCtrl', ['$state', 'PaperService', UserSubmitCtrl]);
