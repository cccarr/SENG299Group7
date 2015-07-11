<<<<<<< HEAD
angular.module('userApp', ['ui.bootstrap','app.routes', 'authService','mainCtrl','userService','userCtrl','resCtrl','reservationService','angularMoment','boothService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

})

.run(function(amMoment) {
    amMoment.changeLocale('CA');
})

=======
angular.module('userApp', ['app.routes','authService','mainCtrl','userService','userCtrl','resCtrl','reservationService','ngAnimate'])
// application configuration to integrate token into requests
.config(function($httpProvider) {

        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');

});
>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9

