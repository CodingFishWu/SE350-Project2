"use strict";

angular.module('userSubmitModule', [])
.controller('userSubmitCtrl', function($state, PaperService, KeyService) {
	//从url获取用户id
	let self = this
	self.userId = $state.params.userId;
	self.keys = [];

	self.add = function() {
		if (!self.word) {
			alert("关键字不能为空");
			return;
		}
		self.keys.push(self.word);
		self.word = '';
		console.log(self.keys);
	}

	self.remove = function(index) {
		self.keys.splice(index, 1);
		console.log(self.keys);
	}

	self.submit = function() {
		if (!self.checkValid())
			return

		let paper = new PaperService({
			title: self.title,
			author: self.author,
			correspondingauthor: self.correspondingauthor,
			affiliation: self.affiliation,
			correspondingaddress: self.correspondingaddress,
			abstraction: self.abstraction,
			createdtime: Math.floor(new Date().getTime() / 1000),
			status: 'created',
			user: {
				type: 'User',
				id: self.userId
			}
		});
		paper.$save().$promise
		.then((result)=>{
			console.log("add paper");
			console.log(result);
			let id = result.id;

			//添加key word（异步）
			// for (let key in self.keys) {
			// 	let tmp = new self.KeyService({
			// 		word: key
			// 	});
			// 	tmp.$save(function(result) {
			// 		console.log("add keywords");
			// 		console.log(result);
			// 	});
			// }
			//异步会失败，改为同步
			let i = 0;
			recurSave(i);
			function recurSave(i) {
				if (i >= self.keys.length) {
					alert('提交成功')
					return;
				}
				let tmp = new KeyService({
					word: self.keys[i],
					paper: {
						type: 'Paper',
						id: id
					}
				});
				tmp.$save().$promise
				.then((result)=>{
					recurSave(i+1);
				})
			}

			//添加文件
			let file = document.getElementsByName('file');
			let formData = new FormData();
			formData.append('file', file[0].files[0]);

			//用jquery的文件上传
			$.ajax({
				url: 'http://202.120.40.73:28080/Entity/Ua46d59e19268fe/PaperServ/Paper/'+id,
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				success: function (data) {
					console.log("添加文件");
					console.log(data);
				}
			})

		})
		// 用angularjs的文件上传
		// let req = {
		// 	method: 'GET',
		// 	url: 'http://202.120.40.73:28080/Entity/Ua46d59e19268fe/PaperServ/Paper/1461426940702',
		// 	headers: {
  //  				'Content-Type': undefined,
  //  				'ProcessData'
  //  			},
  //  			data: formData
 	// 	}
 	// 	self.$http(req).then(function(result) {
 	// 		console.log(result);
 	// 	}, function(err) {
 	// 		console.log(err);
 	// 	})
		
	}

	self.checkValid = function() {
		let files = document.getElementsByName('file')[0].files;
		if (files.length == 0) {
			alert('没有文件');
			return false;
		}
		if (!(/(.\.pdf)$/.test(files[0].name))) {
			alert('文件格式不对');
			return false;
		}

		if (!self.title || !self.author || !self.correspondingauthor || !self.affiliation ||
			!self.correspondingaddress || !self.abstraction || self.keys.length == 0 ||
			document.getElementsByName('file')[0].files.length == 0) {
			alert('内容不完整')
			return false;
		}
		return true;
	}
})
