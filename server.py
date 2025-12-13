from flask import Flask
from flask import request
from flask_cors import CORS
import json


app = Flask(__name__)

CORS(app)

nextid = 0

players = []
raceon = False
owner = ""
scoreboard = []

@app.route('/connect/<nickname>/<hero>', methods=['GET'])
def register(nickname, hero):
    global owner
    global nextid
    knownid = -1
    if(owner == ""):
        owner = request.remote_addr
    
    for i in range (0, len(players)):
        if(players[i].get("ip") == request.remote_addr):
            knownid = players[i].get("id")
            players[i].update({"nickname" : nickname, "hero" : hero})

    if(knownid == -1):
        players.append({"ip" : request.remote_addr, "id" : nextid, "nickname" : nickname, "posx" : 0, "posy" : 0, "rot" : 0, "speedx" : 0, "speedy" : 0, "hero" : hero})
        knownid = nextid
        nextid += 1
    
    return json.dumps({"status" : 1, "owner" : owner, "player" : knownid, "player_ip" : request.remote_addr})

@app.route('/disconnect', methods=['GET'])
def disconnect():
    success = 0
    indextodelete = -1
    for i in range (0, len(players)):
        if(players[i].get("ip") == request.remote_addr):
            indextodelete = i
    if(indextodelete != -1):
        del players[indextodelete]
        success = 1
    return json.dumps({"status" : success})

@app.route('/getplayers', methods=['GET'])
def getplayers():
    global owner
    return json.dumps({"status" : 1, "owner" : owner, "players" : players, "scoreboard" : scoreboard})

@app.route("/addscoreboardentry/<name>/<time>", methods=['GET'])
def scoreboardappend(name, time):
    scoreboard.append({"name": name, "time" : time})
    return json.dumps({"status" : 1})

@app.route('/updateplayer/<id>/<posx>/<posy>/<rot>/<speedx>/<speedy>/<hero>', methods=['GET'])
def updateplayer(id, posx, posy, rot, speedx, speedy, hero):
    success = 0
    for i in range(0, len(players)):
        print(i)
        print("id: " + str(players[i].get("id")))
        if(str(players[i].get("id")) == str(id)):
            print("found " + str(i))
            players[i].update({"posx" : posx, "posy" : posy, "rot" : rot, "speedx" : speedx, "speedy" : speedy, "hero" : hero})
            success = 1

    print(success)
    
    return json.dumps({"status" : success})



app.run(debug=True, host='0.0.0.0', port=8080)