angular.module('mainCtrl', ['ui.bootstrap'])

.controller('mainController', function($rootScope, $location, Auth, User) {

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

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			

				// if a user successfully logs in, redirect to home
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


	// retrieve the security question of a user
	// (mirrors doLogin above) 
	vm.getSecurityQuestion = function() {

		vm.processing = true;

		Auth.getQuestion(vm.forgotData.username)
			.success(function(data) {
				vm.processing = false;

				// if question successfully recieved, display it 
				if(data.success) {
					vm.error = '';
					vm.securityQuestion = data.question;
					vm.securityAnswer 	= data.answer;
					vm.user_id 			= data.user_id;
				} else {
					vm.error = data.message;
				}
			});
	}

	vm.checkSecurityAnswer = function() {
		if(vm.securityAnswer == vm.forgotData.answer) {
			
			// success 
			Auth.resetPassword(vm.forgotData.username, vm.user_id);
			vm.error = '';
			vm.message = "Password reset to password.";
		} else {
			console.log("incorrect answer");
			vm.error = "Answer is not correct";
		}
	} 

});
