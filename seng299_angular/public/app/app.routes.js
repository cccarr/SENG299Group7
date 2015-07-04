angular.module('app.routes', ['ngRoute'])

// Configuring the routes
.config(function($routeProvider, $locationProvider){

	$routeProvider

	// Route for home page
	.when("/", {
		templateUrl: 'app/views/pages/home.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
	
	.when('/login', {
		templateUrl : 'app/views/pages/login.html',
   		controller  : 'mainController',
    		controllerAs: 'login'
	})

	.when("/users", {
		templateUrl: 'app/views/pages/users/all.html',
		controller: 'userController',
		controllerAs: 'user'
	})

	.when("/users/create", {
		templateUrl: 'app/views/pages/users/single.html',
		controller: 'userCreateController',
		controllerAs: 'user'
	})
	
	.when("/users/:user_id", {
		templateUrl: 'app/views/pages/users/single.html',
		controller: 'userEditController',
		controllerAs: 'user'
	})

	.when("/profile", {
                templateUrl: 'app/views/pages/profile.html',
                controller: 'userEditController',
                controllerAs: 'user'
        })


	.when("/reservations", {
		templateUrl: 'app/views/pages/reservations/all.html',
		controller: 'reservationController',
		controllerAs: 'reservation'
	})

	.when("/reservations/create", {
		templateUrl: 'app/views/pages/reservations/single.html',
		controller: 'reservationCreateController',
		controllerAs: 'reservation'
	})
	
	.when("/reservations/:reservation_id", {
		templateUrl: 'app/views/pages/reservations/single.html',
		controller: 'reservationEditController',
		controllerAs: 'reservation'
	});
	// Added to remove the # from URLs
	$locationProvider.html5Mode(true);
});

