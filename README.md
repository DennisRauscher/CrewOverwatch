# CrewOverwatch | SocketIO based car caravan app

This was my project for the final test as a software developer trainee in siegen, germany 2017. It was rated very well by the committee. It is used to
track the distance to the other cars in the "crew", this can be usefull for hobby football groups for example. These often have to travel with seperate cars instat of a bus to the destination and react if someone is left behind. It is not working anymore due to some changes on the Auth0 API.

## How it works

The authentification is handeled with Auth0, the GPS-Tracking with the browser GPS-API and the Distance calculation is done with Google Maps.
The website will estabilsh a connection to the Socket.IO server and then constantly get and send updates on the distances.

## Interesting files and documentations regarding this project:
[Documentation](demo/Dokumentation.pdf) (German)
[Kunden Dokumentation](demo/KundenDocu.pdf) (German)
[Lastenheft](demo/Lastenheft.pdf) (German)
[Pflichtenheft](demo/Pflichtenheft.pdf) (German)

![](demo/uiDemo.gif)

## What was used?

Basic JavaScript, Socket.IO and CSS for the frontend. Node.JS and Socket.IO for the backend.

## Authors

* **Dennis Rauscher** - [GitHub](https://github.com/DennisRauscher)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
