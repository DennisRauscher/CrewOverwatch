function getLocation2(callback) {
    var pos = {gpsLat: 0, gpsLng: 0, gpsAcc:0};
    navigator.geolocation.getCurrentPosition(function(position){
      pos.gpsLat = position.coords.latitude;
      pos.gpsLng = position.coords.longitude;
      pos.gpsAcc = position.coords.accuracy;
      callback(pos);
    });
}

function getLocation(funcCallBack, isGPStest)
{
  var pos = {gpsLat: 0, gpsLng: 0, gpsAcc:0};

   if (navigator.geolocation)
   {
     //var timeoutVal = getCookie("GPSTimeout");
     navigator.geolocation.getCurrentPosition(sucess
                                             ,error
                                             ,{enableHighAccuracy: true
                                              ,maximumAge: 0
                                              ,timeout : 5000}
                                             );
   }
   else{
     alert('GPS is turned off, or was not possible to find it. Now, doing the login without localization.');

     pos.gpsLat = 0;
     pos.gpsLng = 0;
     pos.gpsAcc = 0;
     funcCallBack(pos);
   }
   function sucess(position) //sucess
   {
      pos.gpsLat = position.coords.latitude;
      pos.gpsLng = position.coords.longitude;
      pos.gpsAcc = position.coords.accuracy;
      funcCallBack(pos);
    }
    function error()         //error
    {
      alert("Error while getting your GPS data!");
      if(!isGPStest)
      {
        socket_leaveCrew();
        navigate_to('gpsMissing');
        checkGPS();
      }

      pos.gpsLat   = 0;
      pos.gpsLng   = 0;
      pos.gpsAcc   = 0;
      funcCallBack(pos);
    }
}

function gpsAvailable()
{
  return navigator.geolocation;
}

function processPositions(members, callback)
{
  var toFinish = 0, finished = 0, done = false;
  members.forEach(function(member){
    toFinish++;
    getDistance(member.userData.position.lat+","+member.userData.position.long, app.crew.settings.destination, function(data){
      finished++;

      if(data.rows[0].elements[0].status == "NOT_FOUND")
      {
        member.distanceDisplay = "N/A";
        member.currentPoint = "-"
      }
      else
      {
        member.distanceDisplay = data.rows[0].elements[0].distance.text;
        member.currentPoint = data.origin_addresses[0];
      }

      if(finished == toFinish && done)
      {
        callback(members);
      }
    });
  });
  done = true;
}

  function getDistance(from, to, callback)
{
  $.getJSON("/getDistance?from=" + from + "&to="+ to, callback);
}

getDistance("Siegen", " Hagen", function(data){
  console.log(data)
});
