var connected = false;

var runFakeServer = false;

var net_ip = "127.0.0.1";
var net_port = "8080";

var nickname = "";

var localplayers = []

var localscoreboard = []

var syncTimeout = 10;

var disconnectTimeout = 0;
var disconnectTimeoutMax = 15;

var disconnectstatus = "";

async function connect(){
	if(runFakeServer){
		runGameLoop = true;
		connected = true;
			playerid = 0;
			playerip = "127.0.0.1";
			runNetworking();
			changeMenu(2)
			main();
		return
	}
    net_ip = document.getElementById("ipaddr").value;
    net_port = Number(document.getElementById("ipport").value);
    nickname = document.getElementById("net_menu_1").value;

	showmodal("Łączenie z serwerem...", false, false);

	if(net_ip.split(".").length != 4)
	{
		showmodal("Nieprawidłowy adres serwera", true);
		return;
	}
	else if(isNaN(net_port) || net_port > 65535 || net_port < 0){
		showmodal("Nieprawidłowy port serwera", true);
		return;
	}
	else if(nickname.length == 0){
		showmodal("Nie podano pseudonimu", true);
		return;
	}



    var addr = "http://" + net_ip + ":" + net_port;
  	try {
		const response = await fetch(addr + "/connect/" + nickname + "/" + selectedhero);
		if (!response.ok) {
			console.error(`Response status: ${response.status}`);
			if(connected)
			{
				disconnectstatus = "Błąd komunikacji z serwerem";
				disconnect();
			}
		}
		rungameloop = true;
		const result = await response.json();
		// console.log(result);

		hidemodal(true);

		if(result.status == 1){
			connected = true;
			playerid = result.player;
			playerip = result.player_ip;
			runNetworking();
			changeMenu(2)
			main();
		}
		else{
			if(connected)
			disconnect();
		}



  	} catch (error) {
    	console.error(error.message);
		disconnectstatus = "Nie można się połączyć z serwerem";
		showDisconnectModal();
  	}
}

async function disconnect(){
    connected = false;
	rungameloop = false;
    changeMenu(1);
	showDisconnectModal();

    // document.getElementById("ipaddr").value = "";
    // document.getElementById("ipport").value = "";
    // document.getElementById("net_menu_1").value = "";

	if(runFakeServer){
		return;
	}

    var addr = "http://" + net_ip + ":" + net_port;
  	try {
		const response = await fetch(addr + "/disconnect");
		if (!response.ok) {
			console.error(`Response status: ${response.status}`);
		}

		const result = await response.json();
		// console.log(result);
		



  	} catch (error) {
    	console.error(error.message);
  	}
}

function showDisconnectModal(){
	console.log("Disconnected!");
	if(disconnectstatus != "")
	{
		showmodal(disconnectstatus, true);
		disconnectstatus = "";
	}
}

async function runNetworking(){

	if(runFakeServer){
		

		localplayers = localplayers;
		localscoreboard = localscoreboard;
		return
	}
	var addr = "http://" + net_ip + ":" + net_port;
	var updateparams = [playerid, posx, posy, rot, xvector, yvector, selectedhero]
  	try {
		const response = await fetch(addr + "/updateplayer/" + updateparams.join("/"));
		if (!response.ok) {
			console.error(`Response status: ${response.status}`);
			if(connected)
			{
				if(disconnectTimeout >= disconnectTimeoutMax)
				{
					disconnectstatus = "Błąd komunikacji z serwerem";
					disconnect();
				}
				else{
					disconnectTimeout++;
					console.warn("server did not answer");
				}
			}
		}

		const result = await response.json();
		disconnectTimeout = 0;
		// console.log(result);



  	} catch (error) {
    	console.error(error.message);
		if(connected)
			{
			if(disconnectTimeout >= disconnectTimeoutMax)
			{
				disconnectstatus = "Utracono połączenie z serwerem";
				disconnect();
			}
			else{
				disconnectTimeout++;
				console.warn("server did not answer");
			}
		}
  	}


	try {
		const response = await fetch(addr + "/getplayers");
		if (!response.ok) {
			console.error(`Response status: ${response.status}`);
			if(connected)
			{
				if(disconnectTimeout >= disconnectTimeoutMax)
				{
					disconnectstatus = "Błąd komunikacji z serwerem";
					disconnect();
				}
				else{
					disconnectTimeout++;
					console.warn("server did not answer");
				}
			}
		}

		const result = await response.json();
		disconnectTimeout = 0;
		// console.log(result);

		localplayers = result.players;
		localscoreboard = result.scoreboard;



  	} catch (error) {
    	console.error(error.message);
		if(connected)
			{
			if(disconnectTimeout >= disconnectTimeoutMax)
			{
				disconnectstatus = "Utracono połączenie z serwerem";
				disconnect();
			}
			else{
				disconnectTimeout++;
				console.warn("server did not answer");
			}
		}
  	}


	setTimeout(() => {
		if(connected)
		runNetworking();
	}, syncTimeout);
}

onbeforeunload = () => {
    if(connected){
        disconnect();
    }
};
