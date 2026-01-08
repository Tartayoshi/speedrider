import { PLAYER_KEYS } from "./utility.js";

class InputHandler{
    constructor(){

        this.keys = {}; //registro di tutti i tasti premuti, se voglio sapere se un tasto è premuto controllo questo array [chiave = tasto], true o false se premuto o no

        Object.entries(PLAYER_KEYS).forEach(mappedKey => {
            this.keys[mappedKey[1]] = false; //Senza questo i controlli in player state hanno un comportamento non corretto 
        });

        console.log("Keys setted:")
        console.log(this.keys);

        window.addEventListener('keydown', event =>{
            event.preventDefault();
            this.keys[event.key] = true;
            //console.log(this.keys);
        });

        window.addEventListener('keyup', event =>{
            event.preventDefault();
            this.keys[event.key] = false;
            //console.log(this.keys);
        });

    }
}

export {InputHandler};