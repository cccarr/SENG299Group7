angular.module('reservationService', [])

.factory('Reservation', function($http) {

	// create a new object
	var reservationFactory = {};

	// get a single reservation
	reservationFactory.get = function(id) {
		// since this call requires a reservation ID we'll add the id to
		// the end of the URL
		return $http.get('/api/reservations/' + id);
	};
	
	reservationFactory.getForUser = function(user_id) {
		// since this call requires a user ID we'll add the id to
		// the end of the URL
		return $http.get('/api/reservationsByUser/' + user_id);
	};

	reservationFactory.getForDay = function(dt_start) {
		// since this call requires a user ID we'll add the id to
		// the end of the URL
		dt_start_date = new Date(dt_start);
		return $http.get('/api/reservationsForDay/' + dt_start_date);
	};
	// get all reservations
	reservationFactory.all = function() {
		return $http.get('/api/reservations/');
	};

	reservationFactory.edit = function(id, reservationData) {
		return $http.put('/api/reservations/' + id, reservationData);
	};
	
	reservationFactory.delete = function(id) {
		return $http.delete('/api/reservations/' + id);
	};
	reservationFactory.create = function(reservationData){
		// since this is a post method we need to include reservationData
		// from our form
		return $http.post('/api/reservations', reservationData)	
	};
	
	return reservationFactory;

});
