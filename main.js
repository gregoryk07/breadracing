var rungameloop = true;

var frameratetimeout = 10;

var leftHold = false;
var rightHold = false;
var holdThrottle = false;
var holdBreak = false;
var holdReverse = false;
var throttle = 0;
var reverse = 0;
var throttletotal = throttle - reverse;
var breaks = 0;
var throttlepersecond = 0.1;
var reversepersecond = 0.1;
var breakspersecond = 0.2;

var throttlemultiplier = 1;

var reversemultiplier = 1;

var steerleft = 0;
var steerright = 0;
var steertotal = 0;
var steerpersecond = 20;
var steeringmultiplier = 1;

var inputLerp = 0.7;

var ls_game_deadzone = 0.1;

var carinput = {
    throttle: 0,
    reverse: 0,
    breaks: 0,
    steer: 0
}

var mapSize = {
    x: 4192,
    y: 4192
}

async function main() {
    throttlemultiplier = heroes[selectedhero].speed / 0.5;
    
    reversemultiplier = heroes[selectedhero].speed / 0.5;
    runInput();

    runLogic();

    interpolate();

    runVisual();

    runAutoscroll();

    setTimeout(() => {
       if(rungameloop){
        main();
       } 
    }, frameratetimeout);
}

addEventListener("mousemove", (e) => {
    mousex = e.pageX;
    mousey = e.pageY;
})
var mousex = window.innerWidth / 2;
var mousey = window.innerHeight / 2;

function runAutoscroll(){
    var offsetx = 0;
    var offsety = 0;

    if(currentController != -1){
        offsetx = input_axes.x * 100;
        offsety = input_axes.y * 100;
    }
    else{
        offsetx = (mousex - (window.innerWidth / 2)) / window.innerWidth * 100;
        offsety = (mousey - (window.innerHeight / 2)) / window.innerHeight *
         100;
    }

    document.getElementById("game").scrollTo({
        left: posx - (window.innerWidth / 2) + 50 + offsetx,
        top: posy - (window.innerHeight / 2) + 50 + offsety, 
        behaviour: "smooth"
    });
}

function runInput(){
    carinput.throttle = 0;
    carinput.breaks = 0;
    carinput.reverse = 0;
    carinput.steer = 0;
    if(holdThrottle){
        carinput.throttle += 1;
    }
    if(holdReverse){
        carinput.reverse += 1;
    }
    if(holdBreak){
        carinput.breaks += 1;
    }
    if(leftHold){
        carinput.steer -= 1;
    }
    if(rightHold){
        carinput.steer += 1;
    }
    carinput.throttle += input_axes.rt;
    carinput.breaks += input_axes.lt;
    carinput.steer += applyDeadzone(input_axes.lx, ls_game_deadzone);
    if(last.north){
        carinput.reverse += 1;
    }

    carinput.throttle = valueClamp(carinput.throttle, 0, 1)
    carinput.reverse = valueClamp(carinput.reverse, 0, 1)
    carinput.breaks = valueClamp(carinput.breaks, 0, 1)
    carinput.steer = valueClamp(carinput.steer, -1, 1)


    // console.log(throttletotal + "  :  " + breaks + "  :  " + steertotal);
    

    throttle = applyDeadzone(valueLerp(throttle, carinput.throttle, inputLerp), 0.01);
    reverse = applyDeadzone(valueLerp(reverse, carinput.reverse, inputLerp), 0.01);
    breaks = applyDeadzone(valueLerp(breaks, carinput.breaks, inputLerp), 0.01);
    steertotal = applyDeadzone(valueLerp(steertotal, carinput.steer, inputLerp), 0.01);
    throttletotal = throttle - reverse;
    // console.log(throttle + "\n" + reverse + "\n" + breaks + "\n" + steertotal + "\n" + throttletotal);
}

function applyDeadzone(x, deadZone) {
    if(x > Math.abs(deadZone) || x < -Math.abs(deadZone)) return x;
    return 0;
}

function valueClamp(val, min, max){
    if(val < min) return min;
    if(val > max) return max;
    return val;
}

function valueLerp(a, b, t){
    return a * (1 - t) + b * t;
}

function runLogic(){
    rot += steertotal / frameratetimeout;
    var init_rot = Math.PI / 2;
    xvector = Math.cos(rot * (Math.PI / 180) + init_rot) * throttletotal;

    
    yvector = Math.sin(rot * (Math.PI / 180) + init_rot) * throttletotal;

    posx += xvector;
    posy += yvector;
    
    if(posx < 0){
        posx = 0;
    }
    if(posy < 0){
        posy = 0;
    }
    if(posx > mapSize.x - 100){
        posx = mapSize.x - 100;
    }
    if(posy > mapSize.y - 100){
        posy = mapSize.y - 100;
    }

    // console.log(Math.floor(rot) + "  :  " + Math.floor(xvector * 100) / 100 + "  :  " + Math.floor(yvector * 100) / 100 + "  :  " + Math.floor(Math.cos(rot * Math.PI / 180) * 100) / 100 + "  :  " + Math.floor(Math.sin(rot * Math.PI / 180) * 100) / 100);
}

function interpolate(){
    for(var i = 0; i < localplayers.length; i++){
        if(localplayers[i].nickname == nickname)
        {
            localplayers[i].posx = posx;
            localplayers[i].posy = posy;
            localplayers[i].rot = rot;
        }
    }
    // for(var i = 0; i < localplayers.length; i++){
    //     localplayers[i].posx += Math.sin(localplayers[i].rot * (Math.PI / 180) * heroes[localplayers[i].hero].speed);
        
    //     localplayers[i].posy += Math.cos(localplayers[i].rot * (Math.PI / 180) * heroes[localplayers[i].hero].speed);
    // }
}

var lastlistlength = -1;
var lastscoreboardlength = -1;
function runVisual(){
    if(lastlistlength != localplayers.length){
        lastlistlength = localplayers.length;
        document.getElementById("playersparent").innerHTML = "";
        for(var i = 0; i < localplayers.length; i++){
            var elem = "<div class=\"player\" id=\"player-" + i + "\">";
            elem += "<div class=\"playergraph\" id=\"player-graph-" + i + "\"></div>";
            elem += "<div class=\"playernickname\" id=\"player-nickname-" + i + "\">" + localplayers[i].nickname + "</div>"
            elem += "</div>";

            document.getElementById("playersparent").innerHTML += elem;
        }
    }
    var fixwidth = 0;
    for(var i = 0; i < localplayers.length; i++){
        try {
            var p = document.getElementById("player-" + i);
        var pn = document.getElementById("player-nickname-" + i);
        var pg = document.getElementById("player-graph-" + i);

        // p.style.position = "absolute";
        // p.style.top = 0;
        // p.style.left = 0;
        p.style.transform = "translate(" + Math.floor(Number(localplayers[i].posx) - fixwidth) + "px, " + Math.floor(Number(localplayers[i].posy)) + "px)";
        p.style.transformOrigin = "center";
        // console.warn("translate(" + Math.floor(Number(localplayers[i].posx)) + "px, " + Math.floor(Number(localplayers[i].posy)) + "px)");
        // console.warn(typeof(Number(localplayers[i].posx)));
        // console.warn(Number(localplayers[i].posy));
        // console.warn(localplayers[i].posy);
        pg.style.background = "url(" + heroes[localplayers[i].hero].img + ")";
        // pg.style.background = "red";
        pg.style.backgroundPositionX = "17px";
        pg.style.width = "100px";
        pg.style.height = "100px";
        pg.style.backgroundRepeat = "no-repeat";
        pg.style.backgroundSize = "auto 100px";
        pg.style.imageRendering = "pixelated";
        pn.style.textAlign = "center";
        pn.style.textTransform = "uppercase";
        pn.style.color = "white";
        pn.style.backgroundColor = "rgba(40, 40, 40, 0.6)";
        pg.style.transform = "rotate(" + (Number(localplayers[i].rot) + 180) + "deg)";
        } catch (error) {
            console.error("visual error: " + error);
        }
        
        fixwidth =+ 100;
    }
    document.getElementById("speedbar").style.height = Math.abs(Math.floor( 10 * (throttletotal * 20)) / 10) + "vh";
    
    // document.getElementById("steeringmeter").style.transitionDuration = "100ms";
    // document.getElementById("steeringmeter").style.transformOrigin = "center";
    // document.getElementById("steeringmeter").style.transform = "rotate(" + (steertotal * 10) + "deg)";


    if(lastscoreboardlength != localscoreboard.length){
        document.getElementById("scoreboard-list").innerHTML = "";
        for(var i = 0; i < localscoreboard.length; i++){
            s = document.getElementById("scoreboard-list");
            s.innerHTML += "<tr><td>"+
            localscoreboard[i].name +"</td><td>"+
            localscoreboard[i].time +"</td></tr>";
        }
        lastscoreboardlength = localscoreboard.length;
    }
}


function runKeyDown(event){
    switch(event.key){
        case "ArrowUp":
            holdThrottle = true;
            break;
        case "ArrowDown":
            holdReverse = true;
            break;
        case "ArrowLeft":
            leftHold = true;
            break;
        case "ArrowRight":
            rightHold = true;
            break;
        case "Shift":
            holdBreak = true;
            break;
    }
}

function runKeyUp(event){
    switch(event.key){
        case "ArrowUp":
            holdThrottle = false;
            break;
        case "ArrowDown":
            holdReverse = false;
            break;
        case "ArrowLeft":
            leftHold = false;
            break;
        case "ArrowRight":
            rightHold = false;
            break;
        case "Shift":
            holdBreak = false;
            break;
    }
}
onkeyup = runKeyUp;