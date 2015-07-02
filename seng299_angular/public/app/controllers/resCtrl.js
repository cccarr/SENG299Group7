angular.module('resCtrl', [])
.controller('reservationController', function(Reservation,Booth) {
		
		var vm = this;
		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the reservations at page load
		Reservation.all()
			.success(function(data) {
				vm.processing = false;
				var booth;
				vm.reservations = data;
				angular.forEach(vm.reservations, function(item){
					booth = Booth.get(item.booth_id);
					item.booth_title = booth.booth_title;
				 })
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

.controller('reservationCreateController', function(Reservation,moment) {

		var vm = this;

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'create';

		// function to create a reservation
		vm.saveReservation = function() {
		vm.processing = true;
		vm.message = '';
		var now= moment();
		vm.reservationData.dt_booked=now;
		
		// use the create function in the reservationService
		Reservation.create(vm.reservationData)
		.success(function(data) {
				vm.processing = false;
				vm.reservationData = {};
				vm.message = data.message;
				});
		}

})	

.controller('reservationEditController', function(Reservation,Booth,$routeParams,moment) {

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
			var now= moment();
			vm.reservationData.dt_booked=now;
			Reservation.edit($routeParams.reservation_id,vm.reservationData)
				.success(function(data) {
					vm.processing = false;
					vm.reservationData = data;
					vm.message = data.message;
				});
	}
});
