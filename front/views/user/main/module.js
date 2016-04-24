"use strict";

class UserMainCtrl {
	constructor($state, $uibModal, PaperService, KeyWordService) {
		this.$state = $state;
		this.$uibModal = $uibModal;
		this.PaperService = PaperService;
		this.KeyWordService = KeyWordService;

		this.userId = $state.params.userId;

		this.getPapers();
	}

	getPapers() {
		let self = this;
		self.PaperService.query({'Paper.user.id': self.userId}, function(result) {
			self.papers = result.Paper;

			//根据用户id查keyword，并绑定到paper中
			self.KeyWordService.query({'KeyWord.paper.user.id': self.userId}, function(result) {
				for (let paper of self.papers) {
					paper.keyWords = [];
					for (let keyWord of result.KeyWord) {
						if (paper.id == keyWord.paper.id) {
							paper.keyWords.push(keyWord);
						}
					}
				}
			})
		});
	}

	edit(index) {
		let self = this;
		self.$uibModal.open({
				templateUrl: 'views/user/paper/paper.html',
				controller: 'userPaperCtrl as ctrl',
				resolve: {
					paper: self.papers[index]
				}
			})
			.result.then(function() {
				// 防止添加完以后立即修改导致id不存在，所以必须重新获取
				self.getPapers();
		});
	}


}

angular.module('userMainModule', [])
.controller('userMainCtrl', ['$state', '$uibModal', 'PaperService', 'KeyWordService', UserMainCtrl]);
