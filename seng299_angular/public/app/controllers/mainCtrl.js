<<<<<<< HEAD
angular.module('mainCtrl', ['ui.bootstrap'])
=======
angular.module('mainCtrl', [])
>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;
	
	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();	

		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});	
	});	
	Auth.getUser()
		.then(function(data) {
			vm.user = data.data;
		});	

	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

<<<<<<< HEAD
=======
	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();	

		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});	
	});	

	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			

<<<<<<< HEAD
				// if a user successfully logs in, redirect to home
=======
				// if a user successfully logs in, redirect to users page
>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9
				if (data.success)			
					$location.path('/');
				else 
					vm.error = data.message;
				
			});
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';
		
		$location.path('/login');
	};

<<<<<<< HEAD
=======
	vm.createSample = function() {
		Auth.createSampleUser();
	};

>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9
});
