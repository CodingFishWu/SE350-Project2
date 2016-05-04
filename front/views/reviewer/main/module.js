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

			self.backups = [];
			for (let examine of self.examines) {
				self.backups.push(examine.paper);
			}

			recurGet(0)

			function recurGet(i) {
				if (i >= self.backups.length) {
					// two page change
					self.page(0)
					return
				}
				let paper = self.backups[i]
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
		// find the index of examine
		let examine = null
		for (examine of self.examines) {
			if (examine.paper.id == self.papers[index].id) {
				break
			}
		}
		self.$uibModal.open({
				templateUrl: 'views/reviewer/main/review.html',
				controller: 'reviewerReviewCtrl as ctrl',
				resolve: {
					//paper: self.papers[index]
					examine: examine,
					keys: function() {return self.papers[index].keys}
				}
			})
			.result.then(function() {
				// 防止添加完以后立即修改导致id不存在，所以必须重新获取
				self.getPapers();
		});
	}

	page(i) {
		let self = this;
		self.papers = [];
		console.log(self.backups);
		for (let j in self.backups) {
			if (i==0 && self.examines[j].status=='unfinish') {
				self.papers.push(self.backups[j])
			}
			else if (i==1 && self.examines[j].status=='finished') {
				self.papers.push(self.backups[j])
			}
		}
	}

	editable(paper) {
		for (let examine of this.examines) {
			if (examine.paper == paper)
				if (examine.status=='finished') {
					return false
				}
				else {
					return true
				}
		}
	}
}

angular.module('reviewerMainModule', [])
.controller('reviewerMainCtrl', ['$state','$uibModal', 'PaperService', 'ExamineService', 'KeyService', ReviewerMainCtrl])
.controller('reviewerReviewCtrl', function($state, $uibModalInstance, PaperService, ExamineService, examine, keys) {
	let self = this
	self.examine = examine
	self.keys = keys

	self.paper = self.examine.paper;
		
	self.url = 'http://202.120.40.73:28080/file/Ua46d59e19268fe/PaperServ/Paper/'+this.paper.id;
	self.items1 = ["Strong Accept","Accept","Weak Accept","Borderline Paper","Weak Reject","Reject","Strong Reject"];
	self.items2 = ["expert","high","medium","low","null"];

	self.opinion = self.items1[0];
	self.confidence = self.items2[0];

	self.submit = function() {
		if (!self.checkValid()) {
			alert('输入不合法')
			return
		}

		// 更新examine状态和信息
		let examine = new ExamineService({
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
		examine.$put().$promise
		.then((result)=>{
			return ExamineService.query({
				'Examine.paper.id': self.paper.id,
				'Examine.status': 'finished'
			}).$promise
		})
		.then((result)=>{
			if (result.Examine.length >= 3) {
				// 需要更新paper的状态为judging
				self.PaperService.get({id: self.paper.id}).$promise
				.then((result)=>{
					self.paper.userId = result.user.id
					let paper = new PaperService({
						id: self.paper.id,
						title: self.paper.title,
						author: self.paper.author,
						correspondingauthor: self.paper.correspondingauthor,
						affiliation: self.paper.affiliation,
						correspondingaddress: self.paper.correspondingaddress,
						abstraction: self.paper.abstraction,
						createdtime: self.paper.createdtime,
						status: 'judging',
						serialnumber: self.paper.serialnumber,
						deadline: self.paper.deadline,
						user: {
							type: 'User',
							id: self.paper.userId
						}
					})
					return paper.$put().$promise
				})
				.then((result)=>{
					alert('已提交审核')
					self.$uibModalInstance.close()
				})
			}
			else {
				alert('已提交审核')
				self.$uibModalInstance.close()
			}
		})
	}

	self.checkValid = function() {
		if (!self.remark) {
			return false
		}
		return true
	}
});
