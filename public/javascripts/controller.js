var controllerModule = angular.module("profilemain.controllers", ['ngFileUpload']);

var extractId = function(){
	var urlData = window.location.href.toString().split('/');
	var uid = urlData[urlData.length - 1];
	return uid;
}

controllerModule.controller('HomeController', ['$scope', function($scope){

	$scope.desc = "developer";
	//setInterval(console.log($scope.name), 3000);
	
}]);



controllerModule.controller('PublicController', ['$scope', '$http', '$window', '$stateParams', function($scope, $http, $window, $stateParams){
	$scope.id = $stateParams.id;
	$scope.publicUserName = "";
	$scope.publicCity = "";
	$scope.publicDetails = "";
	$scope.carrier = "";

	$scope.name = "";
	$scope.email = "";
	$scope.msg = "";


	$scope.publicInfo = function(){

		console.log($stateParams.id);
		var publicData = {
			userId : extractId()
		}

		console.log(publicData);
		$http.post("/public", publicData).then(function(response){
			console.log(response.data);
			if(response.data.s == 'p'){
				console.log('response.data.d');	//redirects the client to /adminInfo


				$scope.publicUserName = response.data.d.name;
				$scope.publicCity = response.data.d.city;
				$scope.publicDetails = response.data.d.details;
				$scope.publicInstagram = response.data.d.instagram;
				$scope.publicProfilePic = response.data.d.profilePic.url;

				console.log("USERNAME:" +$scope.publicUserName);
				//$window.location = '/profileInfo';	//redirects the client to /adminInfo


			}else{
				alert("ERROR");
			}


		});
	}


	$scope.contact = function() {
		var contactData = {
			userId : $scope.id,
			name: $scope.name,
			email: $scope.email,
			message: $scope.msg
		}

		//console.log(publicData);
		$http.post("/public/contact", contactData).then(function(response){
			console.log(response.data);
			if(response.data.s == 'p'){
				
				alert("Message Sent");
				//$window.location = '/profileInfo';	//redirects the client to /adminInfo


			}else{
				alert("ERROR");
			}


		});
	}

	// $scope.getUser = function(){
		
	// 	console.log("The value is:" +$scope.carrier);
	// 	$scope.publicUserName = $scope.carrier;
	// }
	
}]);


//$window is a reference to the browser's window object
//The $http service is a core AngularJS service that facilitates communication with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
//$scope defines the scope of the controller

controllerModule.controller('AuthController', ['$scope', '$http', '$window', 'Upload', function($scope, $http, $window, Upload){

	$scope.email = "";
	$scope.pass = "";

	$scope.uid = "";
	$scope.user = "";
	$scope.userEmail = "";
	$scope.userDetails = "";
	$scope.userCity = "";
	$scope.userInstagram = "";
	$scope.profilePic = "/images/avatar.png";

	$scope.fetch = function(){
		$http.get("/admin/fetch").then(function(response){
			console.log(response.data);
			if(response.data.s == 'p'){
				$scope.user = response.data.d.name;
				// if(response.data.d.local.email)
				// 	$scope.userEmail = response.data.d.local.email;
				if("local" in response.data.d)
					$scope.userEmail = response.data.d.local.email;
				else
					$scope.userEmail = response.data.d.facebook.email;

				$scope.userDetails = response.data.d.details;
				$scope.userCity = response.data.d.city;
				$scope.userInstagram = response.data.d.instagram;
				if(response.data.d.profilePic)
					$scope.profilePic = response.data.d.profilePic.url;
				$scope.uid = response.data.d._id;
			}
			


		});
	}

	$scope.login = function(){

		var loginData = {
			email : $scope.email,
			password : $scope.pass
		}

		$http.post("/login", loginData).then(function(response){
			console.log(response.data);
			if(response.data.s == 'p'){
				$window.location = '/adminInfo';	//redirects the client to /adminInfo
			}else{
				alert("ERROR: unable to login. Check your Credentials.");
			}


		});
	};



	$scope.register = function(){

		var registerData = {
			email : $scope.email,
			password : $scope.pass
		}

		$http.post("/register" , registerData).then(function(response){
			//console.log(data);
			if(response.data.s == 'p'){
				$window.location = '/login';		//redirects the client to /login
			}else{
				if(response.data.d == 'user_exist')
					alert("ERROR: User Exist.Try to use another account or Login.");
			}


		});
	};

	// upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/admin/profilePicUpload',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };


	$scope.adminInfo = function(){

		var adminInfoData = {

			username : $scope.user,
			email : $scope.userEmail,
			paragraph: $scope.userDetails,
			cityName : $scope.userCity,
			instagramUsername : $scope.userInstagram
		}

		$http.post("/adminInfo" , adminInfoData).then(function(response){

			if(response.data.s == 'p'){
				console.log("here")
				Upload.upload({
		            url: '/admin/profilePicUpload',
		            data: {file: $scope.file}
		        }).then(function (resp) {
		        	alert("Profile Updated with New Info");
		            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
		        }, function (resp) {
		            console.log('Error status: ' + resp.status);
		        }, function (evt) {
		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		        });
			}else{
				alert("ERROR");
			}

		});


	};

	$scope.logout = function(){
		$http.get('/logout').then(function(response){
			if(response.data.s == 'p')
				$window.location = '/login';
		})
	}
	
}])



