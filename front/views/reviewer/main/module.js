"use strict";

class ReviewerMainCtrl {
	constructor($state,$uibModal) {
		this.$state = $state;
		this.$uibModal = $uibModal;
	}

	review(index) {
		let self = this;
		self.$uibModal.open({
				templateUrl: 'views/reviewer/main/review.html',
				controller: 'reviewerReviewCtrl as ctrl',
				resolve: {
					//paper: self.papers[index]
					paper: {}
				}
			})
			.result.then(function() {
				// 防止添加完以后立即修改导致id不存在，所以必须重新获取
				self.getPapers();
		});
	}
}

class ReviewerReviewCtrl {
	constructor($state) {
		this.$state = $state;
		this.items1 = ["Strong Accept","Accept","Weak Accept","Borderline Paper","Weak Reject","Reject","Strong Reject"];
		this.items2 = ["expert","high","medium","low","null"];

		this.opinion = this.items1[0];
		this.confidence = this.items2[0];
	}
}

angular.module('reviewerMainModule', [])
.controller('reviewerMainCtrl', ['$state','$uibModal', ReviewerMainCtrl])
.controller('reviewerReviewCtrl', ['$state', ReviewerReviewCtrl]);
