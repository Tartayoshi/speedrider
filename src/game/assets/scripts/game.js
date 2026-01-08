import { GameManager } from "./gameManager.js";
import * as Utility from "./utility.js";

let canvas, context, gameManager;

window.addEventListener("DOMContentLoaded", init);

function init(){

    if(window.screen.width < 800){ //messaggio per chi ha uno schermo piccolo (probabilmente un dispositivo mobile)
        let warnign = document.querySelector(".destroyOnLoad");
        warnign.textContent = "Attenzione! Potresti avere problemi nella visualizzazione del contenuto: il gioco non è pensato per i dispositivi mobili! Serve una tastiera esterna.";
        warnign.classList.remove("destroyOnLoad");
        warnign.classList.add("warning");
    }else{
        document.querySelector(".destroyOnLoad").hidden = true; //nascondo la scritta "caricamento" il dom ha caricato
    }

    

    try{
        canvas = document.querySelector("#game");
        if(!canvas){ //se canvas non è presente nella pagina allora l'utente non ha fatto il login
            throw "Attenzione! sessione non attiva, login richiesto";
        }else{
            let fullscreenButton = document.querySelector("#fullscreenButton")
            fullscreenButton.addEventListener("click", fullscreen);
            fullscreenButton.hidden = false;
        }
        canvas.width = Utility.CANVAS_WIDTH;
        canvas.height = Utility.CANVAS_HEIGHT;
        context = canvas.getContext('2d');
        
        gameManager = new GameManager(canvas, canvas.mode); //chiamo il game manager, si occupera lui di tutto tramite un sistema a stati

        context.fillStyle = 'rgb(0,0,0)';
        context.fill();
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        update();
    }
    catch(e){
        console.log(e);
    }

    
};

function update(){

    gameManager.update();
    gameManager.drawScene();
    window.requestAnimationFrame(update);
}

function fullscreen(){
    canvas.requestFullscreen();
}