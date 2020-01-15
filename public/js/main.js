'use strict';

var lastPage; //Stores the last page visited (ID)
var nextPageAfterError;
var userToken = localStorage.getItem('access_Token');
var gpsAccepted = false;

$(function () {
	//setLoading(true);
	navigate_to('home');
});

function setLoading(isLoading) {
	if (isLoading) {
		$('#loadingScreen').addClass('active');
	} else {
		$('#loadingScreen').removeClass('active');
	}
}

function showError(msg, next) {
	nextPageAfterError = next;

	$('#errorMsg').html(msg);
	navigate_to('errorScreen');
}

function navigate_to(pageName) {
	if (lastPage) {
		$('#page_' + lastPage).removeClass('active');
	}

	$('#page_' + pageName).addClass('active');
	lastPage = pageName;
}

function createCrew() {
	socket_createCrew();
}

function updateCrew() {
	//@TODO validate
	socket_updateCrew($('#input_crewDestination').val());
}

function leaveCrew() {
	socket_leaveCrew();
}

function joinCrew() {
	socket_joinCrew($('#input_joinGroup').val());
}

function checkGPS() {
	getLocation(function (pos) {
		if (pos.gpsAcc != 0) {
			initSocket();
			gpsAccepted = true;
		} else {
			console.log("GPS MISSING!");
			navigate_to('gpsMissing');
			setTimeout(checkGPS, 5000);
		}
	}, true);
}

/*var lock = new Auth0Lock('IpRU9hp7uAMeBXc2FplC5NScThnawEdr', 'drauscher.eu.auth0.com', {
	theme: {
		//logo: "test-icon.png",
		primaryColor: "#736C8B"
	}
});*/

function login() {
	
	//Workaround 
	localStorage.setItem('access_Token', "test");
	navigate_to('gpsMissing');
	checkGPS();
	//initSocket();
	app.user = {name: "UserX"};
	/*
	lock.show();*/
}

lock.on("authenticated", function (authResult) {
	/*lock.getUserInfo(authResult.accessToken, function(error, profile) { DEPRICATED!
	  if (error) {
	    console.log(error);
	    return;
	  }
	  localStorage.setItem('access_Token', authResult.accessToken);
	    console.log(profile);
	    navigate_to('gpsMissing');
	    checkGPS();
	    //initSocket();
	    app.user = profile;
	});*/

});