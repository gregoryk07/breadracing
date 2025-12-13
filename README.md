# BREADRACING
A browser racing game made using javascript

## Roadmap
Frontend
- [X] Car selection in main menu
- [X] Nickname and server address field in connection menu
- [X] Credits menu
- [ ] Pause Menu
- [ ] User interface in game
- [X] Controller support

Server
- [X] Handle player connection
- [X] Handle storing player data
- [X] Handle manual disconnection
- [ ] Handle automatic disconnection over time
- [X] Handle entering scoreboard entry
- [X] Handle sending data to players
- [ ] Handle ongoing game joining rules
- [ ] Handle player start
- [ ] Handle chosen map
- [ ] Handle player start position 

Logic
- [X] Car movement
- [ ] Car physics
- [ ] Track collisions
- [ ] Car collisions
- [ ] Registering laps
- [X] Netcode: connection to the server
- [ ] Netcode: extrapolation of server data

> [!IMPORTANT]
> In order to play you need to download the [game server](https://gregoryk07.github.io/breadracing/server.py) as well as python runtime and required modules.


## Server instalation
Download python from its [website](https://www.python.org/downloads/)

Install required modules using pip in your command prompt
```batch
pip install flask_cors
```
Run ```server.py``` file using ```python server.py``` command in your command prompt

> [!NOTE]
> The server can handle only one player per IPv4 address which means if youre planning on playing over the internet none of your friends can join using the same network.
