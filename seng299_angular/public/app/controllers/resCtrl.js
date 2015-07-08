angular.module('resCtrl', ['reservationService'])
.controller('reservationController', function(Reservation,User) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		vm.getUser = function(user_id) {
			User.get(user_id)
			.success(function(data) {
				
				vm.user = data;
			});
		}

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

		vm.deleteUserReservation = function(id) {
			
			vm.processing = true;
			Reservation.get(id)
				.success(function(data) {
					vm.reservationToDel = data;
					var currentDate = new Date();
					var resDate = new Date(vm.reservationToDel.dt_start);
					var timeDiff = resDate.getTime() - (currentDate.getTime()-28800000);

					if(timeDiff<86400000 && timeDiff>0) {
					
						var ban_end = currentDate.getTime()-25200000 + 172800000;
						vm.user.dt_ban_end = new Date(ban_end);
						User.edit(vm.user,vm.user._id)
							.success(function(data) {
								vm.userData = data;
							});
					}

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
				var userBan = new Date(vm.reservationData.dt_ban_end);
				vm.banned =false;
				var currentDate = new Date();
				var timeDiff = userBan.getTime() - (currentDate.getTime()-28800000);

				if(timeDiff>0) {
					vm.banned = true;
				}
			});
		}



		// function to create a reservation
		vm.saveReservation = function() {
			vm.processing = true;
			vm.message = '';
			vm.reservationData.dt_start = new Date(vm.reservationData.dt_start)
			// use the create function in the reservationService
			if(vm.banned){
			console.log("Banned user tried to create a reservation");
			}
			else {
			Reservation.create(vm.reservationData)
			.success(function(data) {
					vm.processing = false;
					vm.reservationData = {};
					vm.message = data.message;
					});
			}
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
