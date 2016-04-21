angular.module('resources', ['ngResource'])

.factory('UserService', ['$resource', function($resource) {
	return $resource('/users/:id', {id: '@_id}'}, {

	});
}])

.factory('Power', ['$resource', function($resource) {
	return $resource('/api/powers/:id', {id: '@_id'}, {
		latest: {method: 'GET', params: {latest: true}}
	});
}])

.factory('Temperature', ['$resource', function($resource) {
	return $resource('/api/Temperatures/:id', {id: '@_id'}, {
		latest: {method: 'GET', params: {latest: true}}
	});
}]);