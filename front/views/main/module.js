'use strict'

angular.module('mainModule', [])
.controller('mainCtrl', function($state, PaperService, KeyService, TagService) {
	let self = this

	// dropdown
	self.dropdown = {isopen: false}
	self.types = ['title', 'author', 'key', 'tag']
	self.type = self.types[0]
	self.typeClicked = (index)=>{
		self.type = self.types[index]
	}

	self.search = ()=>{
		if (!checkInput()) {
			alert('请输入搜索词语')
			return
		}
		self.papers = []

		switch(self.type) {
			case 'title':
			case 'author':
				let params = {}
				params[getSearchKey()] = self.word
				params['Paper.status'] = 'accepted'
				PaperService.query(params, function(result) {
					self.papers = result.Paper
					getKeys(self.papers)
				})
				break
			case 'key':
				KeyService.query({
					'Key.word': '(like)'+self.word,
					'Key.paper.status': 'accepted'
				}, function(result) {
					if (!result.Key)
						return
					for (let key of result.Key) {
						self.papers.push(key.paper)
					}
					getKeys(self.papers)
				})
				break
			case 'tag':
				TagService.query({
					'Tag.tag': '(like)'+self.word,
					'Tag.paper.status': 'accepted'
				}, function(result) {
					if (!result.Tag)
						return
					for (let tag of result.Tag) {
						self.papers.push(tag.paper)
					}
					getKeys(self.papers)
				})
				break
		}

		function getKeys(papers) {
			if (!papers) 
				return
			recurGet(0)

			function recurGet(i) {
				if (i >= papers.length) {
					return 
				}
				KeyService.query({
					'Key.paper.id': papers[i].id
				}, function(result) {
					papers[i].keys = result.Key
				})
			}
		}
	}

	function getSearchKey() {
		switch(self.type) {
			case 'title':
				return 'Paper.title'
			case 'author':
				return 'Paper.user.name'
		}
	}

	function checkInput() {
		if (!self.word) {
			return false
		}
		else {
			return true
		}
	}
	self.toLogin = function() {
		$state.go('login')
	}
})