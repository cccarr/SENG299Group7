angular.module('resCtrl', ['reservationService','ui.bootstrap'])
.controller('reservationController', function(Reservation,User) {

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




		vm.getUser = function(user_id) {
			User.get(user_id)
			.success(function(data) {
				
				vm.user = data;
			});
		}

		// grab all the reservations at page load
		User.all()
		.success(function(data) {

				// when all the reservations come back, remove the processing variable
				vm.processing = false;

				// bind the reservations that come back to vm.reservations
				vm.users = data;
				console.log(vm.users);
				});

		vm.getUserName = function(user_id) {
			var log=[];
			var username="";
			angular.forEach(vm.users, function(user,key) {
			  if(user._id==user_id) {
				console.log("HERE"+user.username);
				username =user.username
				}
			},log);
			return username;
		};

		Reservation.all()
		.success(function(data) {

				// when all the reservations come back, remove the processing variable
				vm.processing = false;

				// bind the reservations that come back to vm.reservations
				vm.reservations = data;
				//console.log(vm.reservations);
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

.controller('reservationCreateController', function(Reservation,Booth,User, $location,$timeout,$scope,$modal) {

	var vm = this;
	 $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.showWeeks = false;
	  $scope.toggleWeeks = function () {
	    $scope.showWeeks = ! $scope.showWeeks;
	  };

	  $scope.clear = function () {
	    $scope.dt = null;
	  };

	  // Disable weekend selection
	  $scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 1 ) );
	  };

	  $scope.toggleMin = function() {
	    $scope.minDate = ( $scope.minDate ) ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	      $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    'year-format': "'yy'",
	    'starting-day': 1
	  };

	  
		$scope.$watch('dt',function() {
			Booth.all()
			.success(function(data) {
					vm.booths = data;
						console.log(vm.booths);
					Reservation.getForDay($scope.dt)
					.success(function(data) {
						angular.forEach(data,function(res) {
							var i = 0;
							angular.forEach(vm.booths, function(booth) {
							if(res.booth_id==booth._id){
								vm.booths.splice(i,1);
							}
								console.log(vm.booths);
							i =i+1;
							});
						});
						$scope.booth_id=vm.booths[0];
						console.log($scope.booth_id);
						console.log(vm.booths);
					});
			});
		});	
		vm.getResForDay= function() {
			Booth.all()
			.success(function(data) {
					vm.booths = data;
						console.log(vm.booths);
					Reservation.getForDay($scope.dt)
					.success(function(data) {
						angular.forEach(data,function(res) {
							var i = 0;
							angular.forEach(vm.booths, function(booth) {
							if(res.booth_id==booth._id){
								vm.booths.splice(i,1);
							}
								console.log(vm.booths);
							i =i+1;
							});
						});
						console.log(vm.booths);
						console.log(data);
					});
			});
		};

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'create';
		$scope.status = {
		    isopen: false
		  };

		  $scope.toggled = function(open) {
		  };

		  $scope.toggleDropdown = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.status.isopen = !$scope.status.isopen;
		  };

	
		vm.time  = { "10": "10",
			     "2": "2", 
		}

		vm.setTime = function(time) {
			$scope.dt = new Date($scope.dt);
			$scope.dt.setHours(time,0,0,0);
			console.log("here"+$scope.dt);
			
		}

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
			vm.reservationData.dt_start = new Date($scope.dt.getTime()-25200000);
			vm.reservationData.booth_id = $scope.booth_id;
			// use the create function in the reservationService
			if(vm.banned){
			console.log("Banned user tried to create a reservation");
			}
			else {
			Reservation.create(vm.reservationData)
			.success(function(data) {
					vm.processing = false;
					vm.message = data.message;
					vm.getResForDay();
					$location.path('/users/'+vm.reservationData.user_id);
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
})

