var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);
var cors = require('cors');
var request = require("request");

var crews = []; //Keeps track of all crews;
var users = [];

server.use(cors({origin: 'null'}));

// Add headers
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // This headers are important for Auth0 etc.
    // Pass to next layer of middleware
    next();
});

server.use(express.static("public"));

server.get('/getDistance', function(req, res){
  var from = req.query.from?req.query.from:"Siegen";
  var to = req.query.to?req.query.to:"Berlin";

  console.log("http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + from + "&destinations="+ to + "&mode=walkling&language=de-DE&sensor=false");
  request("http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + from + "&destinations="+ to + "&mode=walkling&language=de-DE&sensor=false", function(error, response, body) {
    res.send(body);
  });
});

//The following code handles the realtime connection
io.on('connection', function(socket){
  console.log('a user connected');
  sendMsg(socket.id, 'connectionVerification', {socketID: socket.id})

  socket.on('updateUserInformation', function(data){
      var user = getUserByID(socket.id);
      console.log(user);
      if(user)
      {
        user.position = data.position;

        var crew = getCrewBySocketID(socket.id);
        if(crew)
        {
          sendUpdateToCrew(crew.id);
        }
      }
  });

  socket.on('setUserInformation', function(data){
    users.push({id: socket.id, userData: {user: data.user, position: data.position, distanceToTarget: 0}, currentPoint: "-", distanceDisplay: "-"});
  });

  socket.on('create_crew', function(){
    var crewID = createCrew(socket.id);
    joinCrew(socket.id, crewID);
  });

  socket.on('join_crew', function(data){
    //A user tryes to join a group, arguments: groupID -> groupID as a string (check later for INT)
    joinCrew(socket.id, data.crewID);
  });

  socket.on('leave_crew', function(){
      leaveCrew(socket.id);
  });

  socket.on('update_crew', function(crewObj){
    //The crew leader updated the crew, arguments: crewObj -> has all settings of the crew
    updateCrew(socket.id, crewObj);
  });

  socket.on('disconnect', function(){
    console.log('a user disconnected');

    leaveCrew(socket.id);
  });

});

function generateBasicData()
{
  return {}; //The basic user data blueprint
}

function sendUpdateToCrew(crewID)
{
  var crew = getCrewByID(crewID);

  if(crew)
  {
    crew.members.forEach(function(socketID){
      sendMsg(socketID, "update_crew", getJoinedCrewAndUser(crew));
    });
  }
}

function getJoinedCrewAndUser(crew)
{
  var fullMembers = [];

  crew.members.forEach(function(member){
    users.forEach(function(user){
      if(member == user.id)
      {
        fullMembers.push(user); //USER BUILDING
      }
    });
  });

  var newCrew = JSON.parse(JSON.stringify(crew));
  newCrew.members = fullMembers;

  return newCrew;
}

function createCrew(leaderID)
{
  var crewID = Math.floor(Math.random() * 10000) + 1000;
  crews.push({id: crewID, leader: leaderID, settings: getStandardSettings(), members: []});
  console.log('Crew ' + crewID + " got created!");
  return crewID;
}

function getStandardSettings()
{
    return {destination: "Berlin"};
}

function joinCrew(socketID, crewID)
{
  var crew = getCrewByID(crewID);

  if(crew)
  {
      crew.members.push(socketID);
      sendMsg(socketID, "join_successfull", getJoinedCrewAndUser(crew));
      sendUpdateToCrew(crewID);
  }
  else
  {
      sendError(socketID, "default", "A group with the ID " + crewID + " is not existing!");
  }
}

function leaveCrew(socketID)
{
  var crew = getCrewBySocketID(socketID);

  if(crew)
  {
    console.log(socketID);
      crew.members.splice(crew.members.indexOf(socketID), 1);
      console.log(crew);
      sendMsg(socketID, "leave_successfull", {});
      sendUpdateToCrew(crew.id);
  }
}

function updateCrew(socketID, crewObj)
{
  var crew = getCrewBySocketID(socketID);

  if(crew)
  {
    if(crew.leader == socketID)
    {
      crew.settings = crewObj;
      sendUpdateToCrew(crew.id);
      sendMsg(socketID, 'change_successfull', {});
    }
  }
}


function getCrewByID(crewID)
{
  var res = undefined;

  crews.forEach(function(crew){
    if(crew.id == crewID)
    {
      res = crew;
    }
  });

  return res;
}

function getCrewBySocketID(socketID)
{
  var res = undefined;

  crews.forEach(function(crew){
    crew.members.forEach(function(member){
      if(member == socketID){
        res = crew;
      }
    });
  });

  return res;
}

function getUserByID(id)
{
  var ret;
  users.forEach(function(user){

    if(id == user.id)
    {
      ret = user;
    }
  });

  return ret;
}


function sendMsg(socketID, name, data)
{
  io.to(socketID).emit('msg', {name: name, data: data});
}

function sendError(socketID, error, msg)
{
  io.to(socketID).emit('error', {error: error, msg: msg});
}

console.log("SERVER LISTENING ON PORT 8080");
http.listen(8080);
