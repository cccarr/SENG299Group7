angular.module('userCtrl', ['userService', 'angularUtils.directives.dirPagination'])

.controller('userController', function($location, User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;
	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;		
		});

	vm.deleteUser = function(id) {
		vm.processing = true

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api 
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};

})

.controller('userCreateController', function(User, $location) {
	
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';
		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.message;

				$location.path('/users');
			});
	}
			
})	

.controller('userEditController', function(User,$routeParams, $location) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';
	

	vm.getUser = function(user_id) {
		User.get(user_id)
			.success(function(data) {
				vm.userData = data;
				var userBan = new Date(data.dt_ban_end);
				vm.currentDate= new Date();
				vm.currentDateMilli= vm.currentDate.getTime()-25200000;
				vm.userBanMilli= userBan.getTime();
				if((vm.userBanMilli - vm.currentDateMilli)>0)
					vm.banned=true;
				else
					vm.banned=false;
					
			});
	}

	// if user data wasn't set by visiting profile...
	if($routeParams.user_id) {
		User.get($routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
		});		
	}

	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		User.edit(vm.userData,$routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
				vm.message = data.message;
 				
				$location.path('/users/' + $routeParams.user_id);
			});
	}
})


.controller('userProfileController', function(User,$routeParams) {

	var vm = this;

	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;

			var userBan = new Date(data.dt_ban_end);
			vm.currentDate= new Date();
			vm.currentDateMilli= vm.currentDate.getTime()-25200000;
			vm.userBanMilli= userBan.getTime();
			if((vm.userBanMilli - vm.currentDateMilli)>0)
				vm.banned=true;
			else
				vm.banned=false;
	});
})

