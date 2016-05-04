"use strict";

angular.module('userMainModule', [])
.controller('userMainCtrl', function($state, $uibModal, PaperService, KeyService){
	let self = this
	//获取url里的user id
	self.userId = $state.params.userId;
	//获取初始paper
	getPapers();

	// 获取paper
	function getPapers(){
		PaperService.query({'Paper.user.id': self.userId}).$promise
		.then((result)=>{
			self.papers = result.Paper;
			//根据用户id查keyword，并绑定到paper中
			return KeyService.query({'Key.paper.user.id': self.userId}).$promise
		})
		.then((result)=>{
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
		});
	}

	//跳转到查看详情页
	self.viewDetail = function(index) {
		$uibModal.open({
			templateUrl: 'views/user/main/paper.html',
			controller: 'userPaperCtrl as ctrl',
			resolve: {
				paper: self.papers[index]
			}
		})
		.result.then(function() {
			// 防止添加完以后立即修改导致id不存在，所以必须重新获取
			getPapers();
		});
	}

	//跳转到编辑页
	self.edit = function(index) {
		$uibModal.open({
			templateUrl: 'views/user/main/edit.html',
			controller: 'userEditCtrl as ctrl',
			resolve: {
				paper: self.papers[index]
			}
		})
		.result.then(function() {
			// 防止添加完以后立即修改导致id不存在，所以必须重新获取
			getPapers();
		});
	}

	self.add = function() {
		$state.go('user.nav.submit',{userId: self.userId});
	}

	self.editable = function(status) {
		if (status=='created' || status=='commenting' || status=='judging' ||
			status=='resubmitted') {
			return true
		}
		else
			return false
	}
})
.controller('userPaperCtrl', function($state, $uibModalInstance, PaperService, ExamineService, TagService, paper){
	let self = this
	//传入模态框的paper
	self.paper = paper
	//获取url里的用户id
	self.userId = $state.params.userId;
	//file的url
	self.url = 'http://202.120.40.73:28080/file/Ua46d59e19268fe/PaperServ/Paper/'+self.paper.id;

	//获取审阅信息
	ExamineService.query({
		'Examine.paper.id': self.paper.id,
		'Examine.status': 'finished'
	}).$promise
	.then((result)=>{
		console.log(result)
		self.examines = result.Examine
		//获取需要显示的tag
		getTags()
	})

	function getTags() {
		TagService.query({'Tag.paper.id': self.paper.id}).$promise
		.then((result)=>{
			self.tags = result.Tag;
		});
	}

	self.revoke = function() {
		let paper = new PaperService({
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
		paper.$put((result)=>{
			alert('撤销成功');
			$uibModalInstance.close()
		})
	}

	self.revokable = function(status) {
		if (status=='accepted') {
			return true
		}
		else
			return false
	}

	self.showTag = function() {
		if (self.paper.status=='accepted' || self.paper.status=='revoked')
			return true
		else
			return false
	}
})
.controller('userEditCtrl', function($state, $uibModalInstance, PaperService, KeyService, paper) {
	let self = this
	self.paper = paper;
	self.userId = $state.params.userId;

	function getKeys() {
		KeyService.query({'Key.paper.id': self.paper.id}).$promise
		.then((result)=>{
			self.paper.keys = result.Key;
		});
	}

	self.remove = function(index) {
		KeyService.delete({id: self.paper.keys[index].id}).$promise
		.then((result)=>{
			alert('删除成功');
			getKeys();
		})
	}

	self.add = function() {
		// key为空 不允许
		if (!self.word) {
			alert("关键字不能为空");
			return;
		}
		let key = new KeyService({
			word: self.word,
			paper: {
				type: 'Paper',
				id: self.paper.id
			}
		});
		key.$save((result)=>{
			alert('添加成功');
			self.getKeys();
		})
	}

	self.submit = function() {
		let paper = new PaperService({
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
		paper.$put((result)=>{
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
			$uibModalInstance.close();
		})
	}
})