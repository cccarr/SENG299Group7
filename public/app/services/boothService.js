angular.module('boothService', [])

.factory('Booth', function($http) {

	// create a new object
	var boothFactory = {};

	// get a single booth
	boothFactory.get = function(id) {
		// since this call requires a booth ID we'll add the id to
		// the end of the URL
		return $http.get('/api/booths/' + id);
	};

	// get all booths
	boothFactory.all = function() {
		return $http.get('/api/booths/');
	};

	boothFactory.edit = function(id, boothData) {
		return $http.put('/api/booths/' + id, boothData);
	};
	
	boothFactory.delete = function(id) {
		return $http.delete('/api/booths/' + id);
	};
	boothFactory.create = function(boothData){
		// since this is a post method we need to include boothData
		// from our form
		return $http.post('/api/booths', boothData)	
	};
	
	return boothFactory;

});
