angular.module('userService', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(id) {
		// since this call requires a user ID we'll add the id to
		// the end of the URL
		return $http.get('/api/users/' + id);
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	userFactory.edit = function(userData,user_id) {
		return $http.put('/api/users/' + user_id, userData);
	};
	
	userFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};
	userFactory.create = function(userData){
		// since this is a post method we need to include userData
		// from our form
		return $http.post('/api/users', userData)	
	};
	
	return userFactory;

});
