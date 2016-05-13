angular.module('hello', [ 'ngRoute' ]).config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home',
		controllerAs: 'controller'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'navigation',
		controllerAs: 'controller'
	}).otherwise('/');

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}).controller('navigation',[ '$rootScope', '$http', '$location', '$route',

		function($rootScope, $http, $location, $route) {
		    //variable self 
			var self = this;

			self.tab = function(route) {
				return $route.current && route === $route.current.controller; // no lo entiendo 
			};
			
			//llama metodo de autenticar
			var authenticate = function(credentials, callback) {
				//crea el header con la infomracion registrada
				
				var headers = credentials ? {
					authorization : "Basic "
							+ btoa(credentials.username + ":"
									+ credentials.password)
				} : {};
				
				//imprime el header  , se envia cifrado  usando  btoa 
				console.log("header ==>");
				console.log( angular.toJson(headers));
				
				//hace el llamada  la servicio rest 
				$http.get('user', {
					headers : headers //se le concatenan   el header 
				}).then(function(response) {
					//se retorna un principal con nombre 
					if (response.data.name) {
						// se hace el set  en  true 
						$rootScope.authenticated = true;
						alert("entro 1");
						
					} else {
						//no autenticacion
						$rootScope.authenticated = false;
						alert("entro 2");
					}
					callback && callback($rootScope.authenticated);
				}, function() {
					$rootScope.authenticated = false;
					callback && callback(false);  // no  lo entiendo 
					
				});

			}
			//lama al metodo de autenticacion.
			authenticate();
			//credenciales en  ""
			self.credentials = {};
			//metodo login
			self.login = function() {
				//llama al metodo autenticar 
				authenticate(self.credentials, function(authenticated) {
					//authenticated  boolean 
					if (authenticated) {
						console.log("Login succeeded")
						//redirige
						$location.path("/");
						//no hay error
						self.error = false;
						//setea en true
						$rootScope.authenticated = true;
					} else {						
						console.log("Login failed")
						//redirige
						$location.path("/login");
						//tiene error 
						self.error = true;
						//no fue autenticado 
						$rootScope.authenticated = false;
					}
				})
			};

			self.logout = function() {
				//llama rest logout 
				$http.post('logout', {}).finally(function() {
					$rootScope.authenticated = false;
					$location.path("/");
				});
			}

		}]).controller('home',['$http',function($http) {
	var self = this;
	$http.get('/resource/').then(function(response) {
		self.greeting = response.data;
	})
}]);
