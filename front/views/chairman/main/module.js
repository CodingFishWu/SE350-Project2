"use strict";

class ChairmanMainCtrl {
	constructor($state, $uibModal) {
		this.$state = $state
		this.$uibModal = $uibModal
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

class ChairmanDistributeCtrl {
	constructor (){

	}
}

class ChairmanEditCtrl {
	constructor() {

	}
}

angular.module('chairmanMainModule', [])
.controller('chairmanMainCtrl', ['$state', '$uibModal', ChairmanMainCtrl])
.controller('chairmanEditCtrl', [ChairmanEditCtrl])
.controller('chairmanDistributeCtrl', [ChairmanDistributeCtrl])
