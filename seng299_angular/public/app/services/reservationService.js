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

	// get all reservations
	reservationFactory.all = function() {
		return $http.get('/api/reservations/');
	};

	reservationFactory.edit = function(id) {
		return $http.put('/api/reservations/' + id);
	};
	
	reservationFactory.delete = function(id) {
		return $http.delete('/api/reservations/' + id);
	};
	reservationFactory.create = function(reservationData){
		// since this is a post method we need to include reservationData
		// from our form
		return $http.post('/api/reservations', userData)	
	};
	
	return reservationFactory;

});
