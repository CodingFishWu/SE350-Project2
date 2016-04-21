"use strict";

class ChairmanMainCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('chairmanMainModule', [])
.controller('chairmanMainCtrl', ['$state', ChairmanMainCtrl]);
