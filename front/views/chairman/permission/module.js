"use strict";

class ChairmanPermissionCtrl {
	constructor($state) {
		this.$state = $state
	}

	edit(index) {
		this.$uibModal.open({
			templateUrl: 'views/chairman/main/edit.html',
			controller: 'chairmanEditCtrl as ctrl',
			resolve: {
				//paper: self.papers[index]
				paper: {}
			}
		})
		.result.then(function() {
			// 防止添加完以后立即修改导致id不存在，所以必须重新获取
			// self.getPapers();
		});
	}

	distribute(index) {
		this.$uibModal.open({
			templateUrl: 'views/chairman/main/distribute.html',
			controller: 'chairmanDistributeCtrl as ctrl',
			resolve: {
				//paper: self.papers[index]
				paper: {}
			}
		})
	}
}

angular.module('chairmanPermissionModule', [])
.controller('chairmanPermissionCtrl', ['$state', ChairmanPermissionCtrl])
