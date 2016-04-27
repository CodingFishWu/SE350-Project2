"use strict";

class ReviewerMainCtrl {
	constructor($state, $uibModal, PaperService, ExamineService, KeyService) {
		this.$state = $state;
		this.$uibModal = $uibModal;
		this.PaperService = PaperService;
		this.ExamineService = ExamineService;
		this.KeyService = KeyService;

		this.userId = $state.params.userId;

		this.getPapers();
	}

	getPapers() {
		let self = this;
		self.ExamineService.query({'Examine.reviewer.id': self.userId}, function(result) {
			self.examines = result.Examine;

			self.papers = [];
			for (let examine of self.examines) {
				self.papers.push(examine.paper);
			}

			recurGet(0)

			function recurGet(i) {
				if (i >= self.papers.length) {
					return
				}
				let paper = self.papers[i]
				self.KeyService.query({'Key.paper.id': paper.id}, function(result) {
					console.log(result);
					paper.keys = result.Key;
					recurGet(i + 1);
				})
			}
		})
	}

	review(index) {
		let self = this;
		self.$uibModal.open({
				templateUrl: 'views/reviewer/main/review.html',
				controller: 'reviewerReviewCtrl as ctrl',
				resolve: {
					//paper: self.papers[index]
					examine: self.examines[index],
					keys: function() {return self.papers[index].keys}
				}
			})
			.result.then(function() {
				// 防止添加完以后立即修改导致id不存在，所以必须重新获取
				self.getPapers();
		});
	}
}

class ReviewerReviewCtrl {
	constructor($state, $uibModalInstance, ExamineService, examine, keys) {
		this.$state = $state;
		this.$uibModalInstance = $uibModalInstance
		this.ExamineService = ExamineService
		this.examine = examine
		this.keys = keys

		this.paper = this.examine.paper;
		this.userId = $state.params.userId;
		this.url = 'http://202.120.40.73:28080/file/Ua46d59e19268fe/PaperServ/Paper/'+this.paper.id;
		this.items1 = ["Strong Accept","Accept","Weak Accept","Borderline Paper","Weak Reject","Reject","Strong Reject"];
		this.items2 = ["expert","high","medium","low","null"];

		this.opinion = this.items1[0];
		this.confidence = this.items2[0];
	}

	submit() {
		let self = this;
		if (!self.checkValid()) {
			alert('输入不合法')
			return
		}
		let examine = new self.ExamineService({
			id: self.examine.id,
			opinion: self.opinion,
			confidence: self.confidence,
			remark: self.remark,
			status: 'finished',
			reviewer: {
				id: self.examine.reviewer.id,
				type: 'User'
			},
			paper: {
				id: self.paper.id,
				type: 'Paper'
			}
		})
		examine.$put(function(result) {
			alert('已提交审核')
			self.$uibModalInstance.close()
		})
	}

	checkValid() {
		if (!this.remark) {
			return false
		}
		return true
	}
}

angular.module('reviewerMainModule', [])
.controller('reviewerMainCtrl', ['$state','$uibModal', 'PaperService', 'ExamineService', 'KeyService', ReviewerMainCtrl])
.controller('reviewerReviewCtrl', ['$state', '$uibModalInstance', 'ExamineService', 'examine', 'keys', ReviewerReviewCtrl]);
