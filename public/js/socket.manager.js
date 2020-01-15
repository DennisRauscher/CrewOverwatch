var socket;
var lastPos;

function initSocket(token)
{
  window.onbeforeunload = function()
  {
        app.$forceUpdate();
        return "Are you sure you want to reload this page? You will lose youre session!";
  }

  socket = io.connect('localhost:8080'); //192.168.10.89 //80.149.190.214

  setLoading(true);

  socket.on('connect', function () {
      setLoading(false);
      navigate_to('profile');

      getLocation(function(pos){
        alert("accuracy GPS: " + pos.gpsAcc);
        if(pos.gpsAcc == 0)
        {
          alert("Sorry, but your GPS-Location could not be recognised");
          checkGPS();
        }
        else
        {
          console.log("Verification");
          socket.emit('setUserInformation', {user: app.user, position: {lat: pos.gpsLat, long: pos.gpsLng}});
        }
      });

      socket.on('msg', onSocketMsg);
      socket.on('error', onSocketError);
  });
}

function socket_createCrew()
{
  socket.emit('create_crew');
}

function socket_joinCrew(crewID)
{
  socket.emit('join_crew', {crewID: crewID});
}

function socket_leaveCrew()
{
  if(socket)
  {
    socket.emit('leave_crew');
    console.log("left the crew!");
  }
}

function socket_updateCrew(destination)
{
  socket.emit('update_crew', {destination: destination});
}

function onSocketMsg(data)
{
  switch(data.name)
  {
    case 'connectionVerification':
      console.log("Your ID is: " + data.data.socketID);
      app.selfID = data.data.socketID;

      setInterval(function(){
        getLocation(function(pos){
          console.log(pos);
          if(pos.gpsAcc != 0)
          {
            socket.emit('updateUserInformation', {user: app.user, position: {lat: pos.gpsLat, long: pos.gpsLng}});
          }
        });
      }, 3000);
    break;

    case 'join_successfull':
      updateData(data.data);
      if(app.crew.leader == app.selfID)
      {
        navigate_to('groupSettings');
      }
      else
      {
        navigate_to('driveSession');
      }
    break;

    case 'leave_successfull':
      navigate_to('profile');
    break;

    case 'change_successfull':
      navigate_to('driveSession');
    break;

    case 'update_crew':
      updateData(data.data);
    break;

    default:
      showError("Unknown response: " + data.name + " # " + data.data, "profile");
    break;
  }
}

function updateData(data)
{
  console.log(data);
  app.crew = data;
  processPositions(data.members, function(data){
    app.crew.members = data;
    app.$forceUpdate();
  });
}

function onSocketError(data)
{
  switch(data.error)
  {
    default:
      showError(data.msg, "profile");
    break;
  }
}
