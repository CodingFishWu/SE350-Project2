"use strict";

class UserMainCtrl {
	constructor($state, $uibModal, PaperService, KeyService) {
		this.$state = $state;
		this.$uibModal = $uibModal;
		this.PaperService = PaperService;
		this.KeyService = KeyService;

		this.userId = $state.params.userId;

		this.getPapers();
	}

	getPapers() {
		let self = this;
		self.PaperService.query({'Paper.user.id': self.userId}, function(result) {
			self.papers = result.Paper;

			//根据用户id查keyword，并绑定到paper中
			self.KeyService.query({'Key.paper.user.id': self.userId}, function(result) {
				console.log(result);
				// no key words
				if (result.Key == null) {
					return;
				}

				for (let paper of self.papers) {
					paper.keys = [];
					
					for (let key of result.Key) {
						if (paper.id == key.paper.id) {
							paper.keys.push(key);
						}
					}
				}
			})
		});
	}

	viewDetail(index) {
		let self = this;
		self.$uibModal.open({
			templateUrl: 'views/user/main/paper.html',
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

	edit(index) {
		let self = this;
		self.$uibModal.open({
			templateUrl: 'views/user/main/edit.html',
			controller: 'userEditCtrl as ctrl',
			resolve: {
				paper: self.papers[index]
			}
		})
		.result.then(function() {
			// 防止添加完以后立即修改导致id不存在，所以必须重新获取
			self.getPapers();
		});
	}

	add() {
		this.$state.go('user.nav.submit',{userId: this.userId});
	}

	editable(status) {
		if (status=='created' || status=='commenting' || status=='judging' ||
			status=='resubmitted') {
			return true
		}
		else
			return false
	}
}

class UserPaperCtrl {
	constructor($state, $uibModalInstance, PaperService, TagService, paper) {
		this.$state = $state;
		this.$uibModalInstance = $uibModalInstance
		this.PaperService = PaperService
		this.TagService = TagService;
		this.paper = paper;

		this.userId = $state.params.userId;
		this.url = 'http://202.120.40.73:28080/file/Ua46d59e19268fe/PaperServ/Paper/'+this.paper.id;
		this.keys = '';
		for (let key of paper.keys) {
			this.keys += key.word + ', ';
		}

		this.getTags();
	}

	getTags() {
		let self = this;
		self.TagService.query({'Tag.paper.id': self.paper.id}, function(result) {
			self.tags = result.Tag;
		});
	}

	remove(index) {
		let self = this;
		if (self.paper.status!='accepted') {
			return
		}
		self.TagService.delete({id: self.tags[index].id}, function(result) {
			self.getTags();
			alert('删除成功');
		})
	}

	add() {
		let self = this;
		if (!self.tag) {
			alert('标签不能为空');
			return;
		}
		let tag = new self.TagService({
			tag: self.tag,
			paper: {
				type: 'Paper',
				id: self.paper.id
			}
		});
		tag.$save(function(result) {
			self.getTags();
			alert('添加成功');
		})
	}

	revoke() {
		let self = this;
		let paper = new self.PaperService({
			id: self.paper.id,
			title: self.paper.title,
			author: self.paper.author,
			correspondingauthor: self.paper.correspondingauthor,
			affiliation: self.paper.affiliation,
			correspondingaddress: self.paper.correspondingaddress,
			abstraction: self.paper.abstraction,
			createdtime: self.paper.createdtime,
			status: 'revoked',
			serialnumber: self.paper.serialnumber,
			deadline: self.paper.deadline,
			user: {
				type: 'User',
				id: self.userId
			}
		})
		paper.$put(function(result) {
			alert('撤销成功');
			self.$uibModalInstance.close()
		})
	}

	revokable(status) {
		if (status=='accepted') {
			return true
		}
		else
			return false
	}


}

class UserEditCtrl {
	constructor($state, $uibModalInstance, PaperService, KeyService, paper) {
		this.$state = $state;
		this.$uibModalInstance = $uibModalInstance;
		this.PaperService = PaperService;
		this.KeyService = KeyService;
		this.paper = paper;

		this.userId = $state.params.userId;
	}

	getKeys() {
		let self = this;
		self.KeyService.query({'Key.paper.id': self.paper.id}, function(result) {
			self.paper.keys = result.Key;
		});
	}

	remove(index) {
		let self = this;
		self.KeyService.delete({id: self.paper.keys[index].id}, function(result) {
			self.getKeys();
			alert('删除成功');
		})
	}

	add() {
		let self = this;
		// key为空 不允许
		if (!self.word) {
			alert("关键字不能为空");
			return;
		}
		let key = new self.KeyService({
			word: self.word,
			paper: {
				type: 'Paper',
				id: self.paper.id
			}
		});
		key.$save(function(result) {
			self.getKeys();
			alert('添加成功');
		})
	}

	submit() {
		let self = this;
		let paper = new self.PaperService({
			id: self.paper.id,
			title: self.paper.title,
			author: self.paper.author,
			correspondingauthor: self.paper.correspondingauthor,
			affiliation: self.paper.affiliation,
			correspondingaddress: self.paper.correspondingaddress,
			abstraction: self.paper.abstraction,
			createdtime: self.paper.createdtime,
			status: self.paper.status,
			serialnumber: self.paper.serialnumber,
			user: {
				type: 'User',
				id: self.userId
			}
		});
		paper.$put(function(result) {
			// paper修改成功
			// 判断文件是否需要修改
			let files = document.getElementsByName('file')[0].files;
			if (files.length > 0) {
				if (!(/(.\.pdf)$/.test(files[0].name))) {
					alert('文件格式不对,将不会保存文件');
					return;
				}
				let formData = new FormData();
				formData.append('file', files[0]);
				//用jquery的文件上传
				$.ajax({
					url: 'http://202.120.40.73:28080/Entity/Ua46d59e19268fe/PaperServ/Paper/'+self.paper.id,
					type: 'POST',
					data: formData,
					contentType: false,
					processData: false,
					success: function (data) {
						console.log("添加文件");
						console.log(data);
					}
				})
			}

			alert('保存成功');
			self.$uibModalInstance.close();
		})
	}
}

angular.module('userMainModule', [])
.controller('userMainCtrl', ['$state', '$uibModal', 'PaperService', 'KeyService', UserMainCtrl])
.controller('userPaperCtrl', ['$state', '$uibModalInstance', 'PaperService', 'TagService', 'paper', UserPaperCtrl])
.controller('userEditCtrl', ['$state', '$uibModalInstance', 'PaperService', 'KeyService', 'paper', UserEditCtrl])