function toast(text, time){
    document.getElementById("toast-text").innerHTML = text;
    document.getElementById("toast-show-checkbox").checked = true;
    setTimeout(() => {
        
        document.getElementById("toast-show-checkbox").checked = false;
    }, time + 1000)
}
var elem = 
"<input type='checkbox' id='toast-show-checkbox'>" + 
"<div id=\"toast-toast\">" + 
"<h2 id='toast-text'></h2>" +
"</div>";
document.body.innerHTML = elem + document.body.innerHTML;