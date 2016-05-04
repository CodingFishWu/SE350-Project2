"use strict";

angular.module('userNavModule', [])
.controller('userNavCtrl', function($state) {
	let self = this
	self.$state = $state
	self.userId = $state.params.userId
})
