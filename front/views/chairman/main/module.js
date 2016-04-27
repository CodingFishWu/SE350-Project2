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
		if (self.page == 0) {
			self.distribute(index)
		}
		else if (self.page == 1) {
			self.judge(index)
		}
	}

	judge(index) {
		this.$uibModal.open({
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
		this.$uibModal.open({
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
		self.pageIndex = i;
		self.papers = [];
		console.log(self.backups);
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
	constructor (){

	}
}

class ChairmanJudgeCtrl {
	constructor() {

	}
}

angular.module('chairmanMainModule', [])
.controller('chairmanMainCtrl', ['$state', '$uibModal', 'PaperService', 'KeyService', ChairmanMainCtrl])
.controller('chairmanJudgeCtrl', [ChairmanJudgeCtrl])
.controller('chairmanDistributeCtrl', [ChairmanDistributeCtrl])
