'use strict'

const baseUrl = 'http://202.120.40.73:28080/Entity/Ua46d59e19268fe/PaperServ'

angular.module('resources', ['ngResource'])

.factory('UserService', ['$resource', function($resource) {
	return $resource(baseUrl + '/User/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false
		},
		put: {
			method: 'PUT',
		}
	});
}])

.factory('PaperService', ['$resource', function($resource) {
	return $resource(baseUrl + '/Paper/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false
		},
		put: {
			method: 'PUT'
		}
	});
}])

.factory('KeyService', ['$resource', function($resource) {
	return $resource(baseUrl + '/Key/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false
		},
		put: {
			method: 'PUT'
		}
	});
}])
.factory('ExamineService', ['$resource', function($resource) {
	return $resource(baseUrl + '/Examine/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false
		},
		put: {
			method: 'PUT'
		}
	})
}])
.factory('TagService', ['$resource', function($resource) {
	return $resource(baseUrl + '/Tag/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false
		},
		put: {
			method: 'PUT'
		}
	})
}])
.factory('RespondService', ['$resource', function($resource) {
	return $resource(baseUrl + '/Respond/:id', {id: '@id'}, {
		query: {
			method: 'GET',
			isArray: false
		},
		put: {
			method: 'PUT'
		}
	})
}]);