"use strict";

class ChairmanNavCtrl {
	constructor($state) {
		this.$state = $state;

		this.userId = $state.params.userId;
	}
}

angular.module('chairmanNavModule', ['ui.router'])
.controller('chairmanNavCtrl', ['$state', ChairmanNavCtrl]);
