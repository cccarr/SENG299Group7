angular.module('userApp', ['app.routes', 'authService','mainCtrl','userService','userCtrl','resCtrl','reservationService','angularMoment','boothService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

})

.run(function(amMoment) {
    amMoment.changeLocale('CA');
})


