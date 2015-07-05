angular.module('resCtrl', ['reservationService'])
.controller('reservationController', function(Reservation) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the reservations at page load
		Reservation.all()
		.success(function(data) {

				// when all the reservations come back, remove the processing variable
				vm.processing = false;

				// bind the reservations that come back to vm.reservations
				vm.reservations = data;
				});

		vm.deleteReservation = function(id) {
		vm.processing = true;

		Reservation.delete(id)
			.success(function(data) {

					// get all reservations to update the table
					// you can also set up your api 
					// to return the list of reservations with the delete call
					Reservation.all()
					.success(function(data) {
							vm.processing = false;
							vm.reservations = data;
							});

					});
		};
})

.controller('reservationCreateController', function(Reservation,Booth,User, $location) {

		var vm = this;

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'create';
	

		Booth.all()
		.success(function(data) {
				vm.booths = data;
				});

		vm.getUser = function(user_id) {
			User.get(user_id)
			.success(function(data) {
				vm.reservationData = data;
				vm.reservationData.user_id = data._id;
			});
		}
		// function to create a reservation
		vm.saveReservation = function() {
			vm.processing = true;
			vm.message = '';
			// use the create function in the reservationService
			Reservation.create(vm.reservationData)
			.success(function(data) {
					vm.processing = false;
					vm.reservationData = {};
					vm.message = data.message;
					});
		}

})	

.controller('reservationEditController', function(Reservation,Booth,$routeParams) {

		var vm = this;

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'edit';

		Reservation.get($routeParams.reservation_id)
		.success(function(data) {
				vm.reservationData = data;
				});
		Booth.all()
		.success(function(data) {
				vm.booths = data;
				});

		vm.saveReservation = function() {
		vm.processing = true;
		vm.message = '';


		Reservation.edit($routeParams.reservation_id,vm.reservationData)
			.success(function(data) {
				vm.processing = false;
				vm.reservationData = data;
				vm.message = data.message;
			});
	}
});
