'use strict'

angular.module('mainModule', [])
.controller('mainCtrl', function() {
	let self = this

	// dropdown
	self.dropdown = {isopen: false}
	self.types = ['title', 'author', 'key', 'tag']
	self.type = self.types[0]
	self.typeClicked = (index)=>{
		self.type = self.types[index]
	}

	self.search = ()=>{
		
	}
})