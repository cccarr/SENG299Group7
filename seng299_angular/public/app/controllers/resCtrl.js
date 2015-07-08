angular.module('resCtrl', ['reservationService'])
.controller('reservationController', function(Reservation) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;
 
			vm.temp_name = "booth name";

		
		vm.getBoothName = function(booth_id) {
		var dict = {"5585d170e4b000778c02c05d": "Lunch Booth 1",
			    "5594725fe4b05a4f296971b5": "Lunch Booth 2", 
			    "5594729fe4b05a4f296971bc": "Lunch Booth 3",
			    "559472bae4b05a4f296971bd": "Merchandise Booth 3",
			    "559472dae4b05a4f296971bf": "Merchandise Booth 1",
			    "559472f1e4b05a4f296971c2": "Merchandise Booth 4",
			    "55947317e4b05a4f296971c5": "Merchandise Booth 5",
			    "559472e6e4b05a4f296971c1": "Merchandise Booth 2",
			    "5594733fe4b05a4f296971c7": "Produce Booth 1",
			    "55947349e4b05a4f296971c8": "Produce Booth 2",
			    "55947362e4b05a4f296971cb": "Produce Booth 3",
			    "55947374e4b05a4f296971cf": "Produce Booth 4"};

			return dict[booth_id];			
		};




		// grab all the reservations at page load
		Reservation.all()
		.success(function(data) {

				// when all the reservations come back, remove the processing variable
				vm.processing = false;

				// bind the reservations that come back to vm.reservations
				vm.reservations = data;
				console.log(vm.reservations);
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
