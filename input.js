var controllerConnected = false;
var controllers = 0;
var currentController = -1;

var controlleruichange = new CustomEvent("input-controller-change");

window.addEventListener("gamepadconnected", (e) => {
    try {
        toast("Podłączono kontroler", 750);
    } catch (error) {
        console.warn("toast.js not found!");
    }
    controllers++;
    controllerstring = navigator.getGamepads()[0].id.toLowerCase();
    if(controllerstring.includes("wireless controller")){
        currentController = 0;
    }
    else if(controllerstring.includes("xbox") || controllerstring.includes("xinput"))
    {
        currentController = 1;
    }
    else if(controllerstring.includes("pro controller")){
        currentController = 2;
    }
    else {
        currentController = 3;
    }
    controllerConnected = controllers > 0;
    dispatchEvent(controlleruichange);
});
window.addEventListener("gamepaddisconnected", (e) => {
    try {
        toast("Odłączono kontroler", 750);
    } catch (error) {
        console.warn("toast.js not found!");
    }
    controllers--;
    controllerConnected = controllers > 0;

    if(controllerConnected){
        controllerstring = navigator.getGamepads()[0].id;
        if(controllerstring.toLowerCase.includes("Wireless Controller")){
            currentController = 0;
        }
        else if(controllerstring.includes("xbox") || controllerstring.includes("xinput"))
        {
            currentController = 1;
        }
        else if(controllerstring.includes("pro controller")){
            currentController = 2;
        }
        else {
            currentController = 3;
        }
    }
    else{
        currentController = -1;
        input_axes.lt = 0;
        input_axes.rt = 0;
        input_axes.lx = 0;
        input_axes.ly = 0;
        input_axes.rx = 0;
        input_axes.ry = 0;
    }
    dispatchEvent(controlleruichange);
});




var left = new CustomEvent("input-left");
var right = new CustomEvent("input-right");
var up = new CustomEvent("input-up");
var down = new CustomEvent("input-down");
var north = new CustomEvent("input-north");
var south = new CustomEvent("input-south");
var east = new CustomEvent("input-east");
var west = new CustomEvent("input-west");

var last = {
    left: false,
    right: false,
    up: false,
    down: false,
    north: false,
    south: false,
    east: false,
    west: false,
    ls_left: false,
    ls_right: false,
    ls_up: false,
    ls_down: false
}

var ls_ui_deadzone = 0.2;

var input_axes = {
    rt: 0,
    lt: 0,
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0
}

var runInputLoop = true;
var inputDelay = 0;

var currentGamepad = -1;

async function runInputMain(){
    
        var gamepads = navigator.getGamepads();
        if(gamepads[0] != null){
            g = gamepads[0];

            input_axes.lx = g.axes[0];
            input_axes.ly = g.axes[1];
            input_axes.rx = g.axes[2];
            input_axes.ry = g.axes[3];
            input_axes.lt = g.buttons[6].value;
            input_axes.rt = g.buttons[7].value;

            if(g.buttons[12].pressed && !last.up){
                last.up = true;
                dispatchEvent(up);
            }
            else if(!g.buttons[12].pressed && last.up){
                last.up = false;
            }
            if(g.buttons[13].pressed && !last.down){
                last.down = true;
                dispatchEvent(down);
            }
            else if(!g.buttons[13].pressed && last.down){
                last.down = false;
            }
            if(g.buttons[14].pressed && !last.left){
                last.left = true;
                dispatchEvent(left);
            }
            else if(!g.buttons[14].pressed && last.left){
                last.left = false;
            }
            if(g.buttons[15].pressed && !last.right){
                last.right = true;
                dispatchEvent(right);
            }
            else if(!g.buttons[15].pressed && last.right){
                last.right = false;
            }
            if(g.buttons[0].pressed && !last.south){
                last.south = true;
                dispatchEvent(south);
            }
            else if(!g.buttons[0].pressed && last.south){
                last.south = false;
            }
            if(g.buttons[1].pressed && !last.east){
                last.east = true;
                dispatchEvent(east);
            }
            else if(!g.buttons[1].pressed && last.east){
                last.east = false;
            }
            if(g.buttons[2].pressed && !last.west){
                last.west = true;
                dispatchEvent(west);
            }
            else if(!g.buttons[2].pressed && last.west){
                last.west = false;
            }
            if(g.buttons[3].pressed && !last.north){
                last.north = true;
                dispatchEvent(north);
            }
            else if(!g.buttons[3].pressed && last.north){
                last.north = false;
            }
            if(g.axes[0] > 0 + ls_ui_deadzone && !last.ls_right){
                last.ls_right = true;
                // console.warn("ls r");
                dispatchEvent(right);
            }
            else if(g.axes[0] <= 0 + ls_ui_deadzone && last.ls_right){
                last.ls_right = false;
            }
            if(g.axes[0] < 0 - ls_ui_deadzone && !last.ls_left){
                last.ls_left = true;
                // console.warn("ls l");
                dispatchEvent(left);
            }
            else if(g.axes[0] >= 0 - ls_ui_deadzone && last.ls_left){
                last.ls_left = false;
            }
            if(g.axes[1] > 0 + ls_ui_deadzone && !last.ls_down){
                last.ls_down = true;
                // console.warn("ls d");
                dispatchEvent(down);
            }
            else if(g.axes[1] <= 0 + ls_ui_deadzone && last.ls_down){
                last.ls_down = false;
            }
            if(g.axes[1] < 0 - ls_ui_deadzone && !last.ls_up){
                last.ls_up = true;
                // console.warn("ls u");
                dispatchEvent(up);
            }
            else if(g.axes[1] >= 0 - ls_ui_deadzone && last.ls_up){
                last.ls_up = false;
            }
        }
    

    await setTimeout(() => {
		if(runInputLoop)
		runInputMain();
	}, inputDelay);
}

runInputMain();