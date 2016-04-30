'use strict'

angular.module('myFilters', [])
.filter('filtStatus', function() {
	return function(input) {
		switch (input) {
			case 'created':
				return '等待审核'
			case 'commenting':
				return '正在审核'
			case 'judging':
				return '正在裁决'
			case 'resubmitted':
				return '被重审'
			case 'accepted':
				return '已通过'
			case 'rejected':
				return '被拒绝'
			case 'revoked':
				return '已撤销'
			default:
				return '出错'
		}
	}
})
.filter('judgeOpinion', function() {
	return function(input) {
		switch (input) {
			case 'accepted':
				return '同意接收'
			case 'rejected':
				return '拒绝接收'
			default:
				return '出错'
		}
	}
})