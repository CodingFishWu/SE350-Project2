"use strict";

class ChairmanNavCtrl {
	constructor($state) {
		this.$state = $state;
	}
}

angular.module('chairmanNavModule', ['ui.router'])
.controller('chairmanNavCtrl', ['$state', ChairmanNavCtrl]);
