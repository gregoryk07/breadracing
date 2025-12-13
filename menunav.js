function setCursorAtEnd(inputId) {
  const inputElement = document.getElementById(inputId);

  if (inputElement) {
    inputElement.focus();

    const length = inputElement.value.length;

    if (typeof inputElement.selectionStart === "number") {
      inputElement.setSelectionRange(length, length);
    } 
  }
}

var selectedhero = 0

var currentMenu = 0;

var selectedservermenu = 1;

var ismodalshown = false;

var uis = [
    document.getElementById("heroselect"),
    document.getElementById("connecttoserver"),
    document.getElementById("game"),
    document.getElementById("credits")
]

function heroselectPrev(){
    if(currentMenu != 0) return;
    selectedhero --;
    if(selectedhero < 0) selectedhero = 0;
    updateHeroSelect();
    updateHeroDisplay();
}
function heroselectNext(){
    selectedhero ++;
    if(selectedhero >= heroes.length) selectedhero = heroes.length - 1;
    updateHeroSelect();
    updateHeroDisplay();
}
function heroselectSelect(){
    if(currentMenu != 0) return;
    selectedplayer = selectedhero;
    updateHeroDisplay();
    changeMenu(1);
    selectedservermenu = 1;
    updateServerConnectionMenu();
    steeringmultiplier = heroes[selectedhero].turnspeed;
    throttlepersecond = heroes[selectedhero].speed;
    reversepersecond = heroes[selectedhero].speed;
}
function updateHeroDisplay(){
    document.getElementById("chosencar").src = heroes[selectedhero].img;
    document.getElementById("chosencarname").innerHTML = heroes[selectedhero].name;
    document.getElementById("connect-stat-speedbar").style.width = ((heroes[selectedhero].speed)/0.5 * 100) + "%";
    document.getElementById("connect-stat-accelbar").style.width = ((heroes[selectedhero].acceleration)/0.5 * 100) + "%";
    document.getElementById("connect-stat-steerbar").style.width = ((heroes[selectedhero].turnspeed)/16 * 100) + "%";
}

function updateHeroSelect(){
    if(currentMenu != 0) return;
    heroesdiv = document.getElementById("heroes");
    heroesdiv.innerHTML = "";

    for(var i = 0; i < heroes.length; i++){
        heroesdiv.innerHTML += "<div id=\"hero" + i + "\"" + (i == selectedhero ? " class=\"selectedhero\"" : "") + "><img src=\"" + heroes[i].img + "\" width=\"100\" alt=\"\"><span>" + heroes[i].name + "</span></div>";
    }
    heroesdiv.style.width = "calc(100% / 3 * " + heroes.length + ")";
    document.getElementById("heroes").parentElement.scrollTo({left: (window.innerWidth / 3) * (selectedhero - 1), right: 0, behavior: "smooth"});
}

addEventListener("input-left", () => {
    if(currentMenu == 0){
        heroselectPrev();
    }
})
addEventListener("input-right", () => {
    if(currentMenu == 0){
        heroselectNext();
    }
})
addEventListener("input-up", () => {
    if(currentMenu == 1){
        selectedservermenu--;
        updateServerConnectionMenu()
    }
})
addEventListener("input-down", () => {
    if(currentMenu == 1){
        selectedservermenu++;
        updateServerConnectionMenu()
    }
})
addEventListener("input-south", () => {
    if(ismodalshown)
    {
        hidemodal();
    }
    else
    {
        if(currentMenu == 0){
            heroselectSelect();
        }
        else if(currentMenu == 1){
            servermenuSelect();
        }
    }
})
addEventListener("input-north", () => {
    if(currentMenu == 0){
        changeMenu(3);
    }
    else if(currentMenu == 3){
        changeMenu(0);
    }
})

addEventListener("input-controller-change", () => {
    updateControllerGlyphs();
})

function updateControllerGlyphs(){
    switch(currentController){
        case -1:
            document.getElementById("goto-main-credits").innerHTML = "E";
            document.getElementById("goto-credits-main").innerHTML = "E";
            break;
        case 0:
            document.getElementById("goto-main-credits").innerHTML = "<img src='assets/Controller/Dualshock4/PS4_Triangle.png' class='btn-hint-graph'>";
            document.getElementById("goto-credits-main").innerHTML = "<img src='assets/Controller/Dualshock4/PS4_Triangle.png' class='btn-hint-graph'>";
            break;
        case 1:
            document.getElementById("goto-main-credits").innerHTML = "<img src='assets/Controller/Xbox/XboxSeriesX_Y.png' class='btn-hint-graph'>";
            document.getElementById("goto-credits-main").innerHTML = "<img src='assets/Controller/Xbox/XboxSeriesX_Y.png' class='btn-hint-graph'>";
            break;
        case 2:
            document.getElementById("goto-main-credits").innerHTML = "<img src='assets/Controller/Xbox/XboxSeriesX_X.png' class='btn-hint-graph'>";
            document.getElementById("goto-credits-main").innerHTML = "<img src='assets/Controller/Xbox/XboxSeriesX_X.png' class='btn-hint-graph'>";
            break;
        case 3:
            document.getElementById("goto-main-credits").innerHTML = "<img src='assets/Controller/Universal/Positional_Prompts_Down.png' class='btn-hint-graph'>";
            document.getElementById("goto-credits-main").innerHTML = "<img src='assets/Controller/Universal/Positional_Prompts_Down.png' class='btn-hint-graph'>";
            break;
    }
}

onkeydown = (event) => { 
    runKeyDown(event);
    if(event.key.includes("Arrow") || event.key.toLowerCase().includes("tab")){
        event.preventDefault();
    }
    if(ismodalshown)
    {
        if(event.key == "Escape" || event.key == "Enter"){
            hidemodal();
        }
    }
    else{
        if(currentMenu == 0)
        {
            if(event.key == "ArrowLeft"){
                heroselectPrev();
            }
            else if(event.key == "ArrowRight"){
                heroselectNext();
            }
            else if(event.key == "Enter"){
                heroselectSelect();
            }
            else if(event.key == "e"){
                changeMenu(3);
            }
        }
        else if(currentMenu == 1){
            if(event.key == "ArrowUp"){
                selectedservermenu--;
                updateServerConnectionMenu()
            }
            else if(event.key == "ArrowDown"){
                selectedservermenu++;
                updateServerConnectionMenu()
            }
            else if(event.key == "Enter"){
                servermenuSelect();
            }
        }
        else if(currentMenu == 3){
            if(event.key == "e"){
                changeMenu(0);
            }
        }
    }
}

function updateServerConnectionMenu() {
    if(selectedservermenu < 1){
        selectedservermenu = 1;
    }
    else if(selectedservermenu > 5){
        selectedservermenu = 5;
    }

    for(var i = 1; i <= 5; i++){
        // console.warn(i);
        document.getElementById("net_menu_" + i).className = (i == selectedservermenu ? "selectedservermenu" : "");
    }
    if(selectedservermenu == 1){
        document.getElementById("net_menu_1").focus();
        setCursorAtEnd("net_menu_1");
    }
    else if(selectedservermenu == 2){
        document.getElementById("ipaddr").focus();
        setCursorAtEnd("ipaddr");

    }
    else if(selectedservermenu == 3){
        document.getElementById("ipport").focus();
        setCursorAtEnd("ipport");

    }
    else{
        document.activeElement.blur();
    }
}

document.getElementById("net_menu_1").addEventListener('keydown', function(event) {
    if(event.key === "ArrowUp" || event.key === "ArrowDown"){
        event.preventDefault();
    }
    else if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
        event.preventDefault();
    }
})
document.getElementById("ipaddr").addEventListener('keydown', function(event) {
    if(event.key === "ArrowUp" || event.key === "ArrowDown"){
        event.preventDefault();
    }
    else if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
        event.preventDefault();
    }
})
document.getElementById("ipport").addEventListener('keydown', function(event) {
    if(event.key === "ArrowUp" || event.key === "ArrowDown"){
        event.preventDefault();
    }
    else if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
        event.preventDefault();
    }
})

function servermenuSelect(){
    if(selectedservermenu == 4){
        connect();
    }
    else if(selectedservermenu == 5){
        changeMenu(0);
        updateHeroDisplay();
    }
}

function changeMenu(id){
    currentMenu = id;
    for(var i = 0; i < uis.length; i++){
        uis[i].style.display = "none";
    }
    uis[id].style.display = "block";
    
}

changeMenu(0);

updateHeroDisplay();

updateServerConnectionMenu()

updateHeroSelect();

abletohidemodal = true;

function showmodal(text, showbutton = false, canhidemodal = true){
    ismodalshown = true;
    abletohidemodal = canhidemodal;
    document.getElementById("modal").innerHTML = "<h2>" + text + "</h2>" + (showbutton ? "<button class='modalbtn' onclick='hidemodal()'>OK</button>" : "");
    document.getElementById("modal").style.display = "block";
}
function hidemodal(force = false){
    if(abletohidemodal || force)
    {
        ismodalshown = false;
        document.getElementById("modal").style.display = "none";
    }
}

hidemodal(true);