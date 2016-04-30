"use strict";

class ChairmanMainCtrl {
	constructor($state, $uibModal, PaperService, KeyService) {
		this.$state = $state
		this.$uibModal = $uibModal
		this.PaperService = PaperService
		this.KeyService = KeyService

		this.getPapers()
	}

	getPapers() {
		let self = this;
		// 获得等待审核的列表
		self.PaperService.query({'Paper.status': 'created'}, function(result) {
			self.backups = result.Paper?result.Paper:[];
			// 获得通过审核的列表
			self.PaperService.query({'Paper.status': 'judging'}, function(result) {
				for (let i in result.Paper) {
					self.backups.push(i);
				}

				console.log(self.backups)

				// 获得Keyword
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
		})
	}

	edit(index) {
		let self = this;
		if (self.pageIndex == 0) {
			self.distribute(index)
		}
		else if (self.pageIndex == 1) {
			self.judge(index)
		}
	}

	judge(index) {
		let self = this
		self.$uibModal.open({
			templateUrl: 'views/chairman/main/judge.html',
			controller: 'chairmanJudgeCtrl as ctrl',
			resolve: {
				paper: self.papers[index]
			}
		})
		.result.then(function() {
			// 防止添加完以后立即修改导致id不存在，所以必须重新获取
			self.getPapers();
		});
	}

	distribute(index) {
		let self = this
		self.$uibModal.open({
			templateUrl: 'views/chairman/main/distribute.html',
			controller: 'chairmanDistributeCtrl as ctrl',
			resolve: {
				paper: self.papers[index]
			}
		})
		.result.then(function() {
			// 防止添加完以后立即修改导致id不存在，所以必须重新获取
			self.getPapers();
		});
	}

	page(i) {
		let self = this;
		if(!self.backups || self.backups.length == 0)
			return
		self.pageIndex = i;
		self.papers = [];
		for (let paper of self.backups) {
			if (i==0 && paper.status=='created') {
				self.papers.push(paper)
			}
			else if (i==1 && paper.status=='judging') {
				self.papers.push(paper)
			}
		}
	}
}

class ChairmanDistributeCtrl {
	constructor ($uibModalInstance, PaperService, UserService, ExamineService, paper){
		this.$uibModalInstance = $uibModalInstance
		this.PaperService = PaperService
		this.UserService = UserService
		this.ExamineService = ExamineService
		this.paper = paper

		this.keys = ''
		if (paper.keys) {
			for (let key of paper.keys) {
				this.keys += key.word + '; '
			}
		}

		this.getReviewers()
		this.checkReviewers = []
	}

	getReviewers() {
		let self = this
		self.UserService.query({'User.role': 'reviewer'}, function(result) {
			self.reviewers = result.User
		})
	}

	add() {
		let self = this;
		self.checkReviewers.push(self.reviewer)
		let i = 0
		for (i in self.reviewers) {
			if (self.reviewers[i] == self.reviewer) {
				break
			}
		}
		self.reviewers.splice(i, 1)
	}

	remove(index) {
		let self = this
		self.reviewers.push(self.checkReviewers[index])
		self.checkReviewers.splice(index, 1)
	}

	submit() {
		let self = this
		if (!self.checkValid)
			return

		console.log(self.paper)
		let paper = new self.PaperService({
			id: self.paper.id,
			title: self.paper.title,
			author: self.paper.author,
			correspondingauthor: self.paper.correspondingauthor,
			affiliation: self.paper.affiliation,
			correspondingaddress: self.paper.correspondingaddress,
			abstraction: self.paper.abstraction,
			createdtime: self.paper.createdtime,
			status: 'commenting',
			serialnumber: self.serialNumber,
			deadline: self.deadline.getTime() / 1000,
			user: {
				type: 'User',
				id: self.paper.user.id
			}
		})
		paper.$put(function(result) {
			recurSave(0)
			// 保存审阅人 one by one
			function recurSave(i) {
				if (i >= self.checkReviewers.length) {
					alert('分配成功')
					self.$uibModalInstance.close()
				}
				let examine = new self.ExamineService({
					status: 'unfinish',
					paper: {
						type: 'Paper',
						id: self.paper.id
					},
					reviewer: {
						type: 'User',
						id: self.checkReviewers[i].id
					}
				})
				examine.$save(function(result) {
					recurSave(i + 1)
				})
			}
		})
	}

	checkValid() {
		let self = this
		if (!self.deadline) {
			alert('请输入截止时间')
			return false
		}
		if (self.checkReviewers.length != 3) {
			alert('请分配3个审阅人')
			return false
		}
		if (!self.serialNumber) {
			alert('请输入序列号')
			return false
		}
		return true
	}
}

class ChairmanJudgeCtrl {
	constructor($uibModalInstance, PaperService, ExamineService, paper) {
		this.$uibModalInstance = $uibModalInstance
		this.PaperService = PaperService
		this.ExamineService = ExamineService
		this.paper = paper

		this.getExamines()
		this.judgements = ['accepted', 'rejected']
		this.judgement = this.judgements[0]
	}

	getExamines() {
		let self = this
		self.ExamineService.query({
			'paper.id': self.paper.id
			'status': 'finished'
		}, function(result) {
			self.examines = result.Examine
		})
	}

	submit() {
		let self = this
		let paper = new self.PaperService({
			id: self.paper.id,
			title: self.paper.title,
			author: self.paper.author,
			correspondingauthor: self.paper.correspondingauthor,
			affiliation: self.paper.affiliation,
			correspondingaddress: self.paper.correspondingaddress,
			abstraction: self.paper.abstraction,
			createdtime: self.paper.createdtime,
			status: self.judgement,
			serialnumber: self.paper.serialNumber,
			deadline: self.paper.deadline,
			user: {
				type: 'User',
				id: self.paper.user.id
			}
		})
		paper.$put(function(result) {
			alert('提交成功')
			self.$uibModalInstance.close()
		})
	}
}

angular.module('chairmanMainModule', [])
.controller('chairmanMainCtrl', ['$state', '$uibModal', 'PaperService', 'KeyService', ChairmanMainCtrl])
.controller('chairmanJudgeCtrl', ['$uibModalInstance', 'PaperService', 'ExamineService', 'paper', ChairmanJudgeCtrl])
.controller('chairmanDistributeCtrl', ['$uibModalInstance', 'PaperService', 'UserService', 'ExamineService', 'paper', ChairmanDistributeCtrl])
