var profileapp = angular.module("profilemain", ["profilemain.controllers", "ui.router"]);

profileapp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

	//$urlRouterProvider.otherwise("/");

	$stateProvider.state("home", {
		url: "/",
		templateUrl:"/templates/login.html",
		controller: "AuthController",
		controllerAs: "authCtrl"
	}).state("login", {
		url: "/login",
		templateUrl:"/templates/login.html",
		controller: "AuthController",
		controllerAs: "authCtrl"
	}).state("register", {
		url: "/register",
		templateUrl:"/templates/register.html",
		controller: "AuthController",
		controllerAs: "authCtrl"
	}).state("adminInfo", {
		url: "/adminInfo",
		templateUrl: "/templates/adminInfo.html",
		controller: "AuthController",
		controllerAs: "authCtrl"
	}).state("publicSearch", {
		url: "/public",
		templateUrl: "/templates/publicProfile.html",
		controller: "PublicController",
		controllerAs: "pubCtrl"
	}).
	state("public", {
		url: "/public/:id",
		templateUrl: "/templates/publicProfileMain.html",
		controller: "PublicController",
		controllerAs: "pubCtrl"
	}).state("profileInfo", {
		url: "/profileInfo",
		templateUrl: "/templates/profileInfo.html",
		controller: "PublicController",
		controllerAs: "pubCtrl"
	});



	$locationProvider.html5Mode(true);	
}]);