import { States } from "./states.js";
import { PLAYER_KEYS as mapKeys}  from "./utility.js";

//STATE MACHINE
//rappresensta tutti gli stati possibili del giocatore, gestisce input per ogni stato

const states = {
    IDLE: 0,
    ACELERATING: 1,
    BRAKING: 2,
    REVERSE: 3,
    MOVING: 4,
    COLLISION: 5
}

//Mappatura dei comandi
//Spostata nella lista delle costanti
/*
const mapKeys = {
    ACCELERATE_0 : 'w',
    ACCELERATE_1 : 'ArrowUp',

    LEFT_0 : 'a',
    LEFT_1 : 'ArrowLeft',

    RIGHT_0 : 'd',
    RIGHT_1 : 'ArrowRight',

    REVERSE_0 : 's',
    REVERSE_1 : 'ArrowDown',

    BRAKE_0 : ' ',
    BRAKE_1 : 'Control' 
}*/

const KEY_RELESED = false;
const KEY_PRESSED = true;

//Il giocatore è fermo
class IdleState extends States{
    constructor(player){
        super('IDLE');
        this.player = player;
    }

    enter(){
        super.enter();
        this.player.throttle = 0; //se è in wuesto stato non sta accelerando
    }
    
    exit(){
        super.exit();
    }

    logic(keys){
        super.logic();

        let newState = -1;

        switch(KEY_PRESSED){//Sta accelerando, entro nel rispettivo stato
            case keys[mapKeys.ACCELERATE_0]:
            case keys[mapKeys.ACCELERATE_1]:
                newState = states.ACELERATING;
                break;
            case keys[mapKeys.REVERSE_0]:
            case keys[mapKeys.REVERSE_1]:
                newState = states.REVERSE;
                break;
        }


        if(newState != -1){ //devo cambiare stato
            this.player.setState(newState);
        }

        //Lo sterzo non viene gestito (sono fermo, non posso sterzare)
        //handleSteering(down, up); 
        
    }

}

//Il giocatore si sta muovendo per inerzia
class MovingState extends States{
    constructor(player){
        super('MOVING');
        this.player = player;
    }

    enter(){
        super.enter();
        this.player.throttle = 0; //In questo stato il giocatore non sta accelerando
    }
    
    exit(){
        super.exit();
    }

    logic(keys){
        super.logic();

        let newState = -1;

      
        switch(KEY_PRESSED){ //Cambio stato
            case keys[mapKeys.ACCELERATE_0]://se premo il tasto per accelerare
            case keys[mapKeys.ACCELERATE_1]:
                if(this.player.speed > 0){ //a seconda della direzione del veicolo il tasto accelera funziona come freno
                    newState = states.ACELERATING;
                }else{
                    newState = states.BRAKING;
                }
                break;

            case keys[mapKeys.REVERSE_0]://se premo il tasto per andare in retromarcia 
            case keys[mapKeys.REVERSE_1]:

                if(this.player.speed < 0){//a seconda della direzione del veicolo il tasto retromarcia funziona come freno
                    newState = states.REVERSE;
                }else{
                    newState = states.BRAKING;
                }

                break;
            case keys[mapKeys.BRAKE_0]: //Tasto drift
            case keys[mapKeys.BRAKE_1]:
                newState = states.BRAKING;
        }


        if(this.player.speed == 0){ //se per inierzia mi sono fermato cambio stato
            newState = states.IDLE;
        }

        handleSteering(this.player, keys); //Gestisco lo sterzo

        if(newState != -1){
            this.player.setState(newState);
        }
        
    }

}


//Il giocatore si sta muovendo in avanti
class AcceleratingState extends States{
    constructor(player){
        super('ACELERATING');
        this.player = player;
    }

    enter(){
        super.enter();
        this.player.throttle = 1; //in questo stato accelero
    }
    
    exit(){
        super.exit(); //quando esco non accelero e non freno
        this.player.throttle = 0;
        this.player.braking = false;
    }

    logic(keys){
        super.logic();

        let newState = -1;


        switch(KEY_RELESED){ //non sto più accelerando

            case keys[mapKeys.ACCELERATE_0] || keys[mapKeys.ACCELERATE_1]:

                newState = states.MOVING;
                break;
    
        }



        switch(KEY_PRESSED){ //sto premendo il freno
            case keys[mapKeys.REVERSE_0]:
            case keys[mapKeys.REVERSE_1]:
            case keys[mapKeys.BRAKE_0]:
            case keys[mapKeys.BRAKE_1]:
                newState = states.BRAKING;
                break;
        }


        

        handleSteering(this.player, keys);

        if(newState != -1){
            this.player.setState(newState);
        }


    }

}

//Sto frenando
class BrakingState extends States{
    constructor(player){
        super('BRAKING');
        this.player = player;
    }

    enter(){
        super.enter();
        //this.player.throttle = 0; //entro sempre da uno stato che setta throttle a zero all'uscita
        this.player.braking = true;
    }
    
    exit(){
        super.exit();
        this.player.braking = false;
    }

    logic(keys){
        super.logic();

        let newState = -1;
        let controllability = 0.5;

        
        switch(KEY_RELESED){ //non sto più frenadno, quindi mi muovo di inierzia, (se l'acceleratore è premuto si occupera lo stato move di cambiare)

            case keys[mapKeys.REVERSE_0] ||
                 keys[mapKeys.REVERSE_1] ||
                 keys[mapKeys.BRAKE_0] ||
                 keys[mapKeys.BRAKE_1] ||
                 keys[mapKeys.ACCELERATE_0] ||
                 keys[mapKeys.ACCELERATE_1]:
            
                newState = states.MOVING;
                break
        }

        switch(KEY_PRESSED){
            //DRIFT: implementazione
            case keys[mapKeys.BRAKE_0]:
            case keys[mapKeys.BRAKE_1]:
                controllability = 1.2; //aumento la controllabilità del go kart, 
                break;
            case keys[mapKeys.REVERSE_0]:
            case keys[mapKeys.REVERSE_1]:
                if(this.player.speed < 0)
                    newState = states.REVERSE;
                break;
            case keys[mapKeys.ACCELERATE_0]:
            case keys[mapKeys.ACCELERATE_1]:
                if(this.player.speed > 0)
                    newState = states.ACELERATING;
                break;
        }

        
        

        if(this.player.speed == 0){
            newState = states.IDLE;
        }

        handleSteering(this.player, keys, controllability);

        if(newState != -1){
            this.player.setState(newState);
        }
        
    }

}


//Sto andando in retromarcia
class ReverseState extends States{
    constructor(player){
        super('REVERSE');
        this.player = player;
    }

    enter(){
        super.enter();
        this.player.throttle = -1;
    }
    
    exit(){
        super.exit();
        this.player.throttle = 0;
    }

    logic(keys){
        super.logic();

        let newState = -1;

    
        switch(KEY_RELESED){ //non sto più accelerando

            case keys[mapKeys.REVERSE_0] || keys[mapKeys.REVERSE_1]:
                newState = states.MOVING;
                break;
        }

   
        switch(KEY_PRESSED){ //sto prenemdo il tasto che frena,
            //Il tasto break non frena il gokart durante la retromarcia, facendo qualche test mi sono reso conte di due cose:
            //1)    Viene naturale premere il tasto di accelerazione per frenare la retromarcia
            //2)    Il comportamento di drifting in retromarcia, non è molto sensato, ne naturale
            //case keys[mapKeys.BRAKE_0]:
            //case keys[mapKeys.BRAKE_1]:
            case keys[mapKeys.ACCELERATE_0]:
            case keys[mapKeys.ACCELERATE_1]:
                newState = states.BRAKING;
                break;
        }
   

        handleSteering(this.player, keys);

        if(newState != -1){
            this.player.setState(newState);
        }

    }

}

function handleSteering(player, keys, controllability = 1){ //Gestione dello sterzo

    switch(KEY_RELESED){ //non sto sternzando
        case keys[mapKeys.LEFT_0] ||
             keys[mapKeys.LEFT_1] ||
             keys[mapKeys.RIGHT_0] ||
             keys[mapKeys.RIGHT_1]:
            player.steering = 0;

    }

    switch(KEY_PRESSED){

        case keys[mapKeys.LEFT_0]: //sinistra
        case keys[mapKeys.LEFT_1]:
            if(player.speed > 0) //se sto andando in retromarcia devo invertire il comando
                player.steering = controllability;
            else
                player.steering = -controllability;

            break;
        case keys[mapKeys.RIGHT_0]: //destra
        case keys[mapKeys.RIGHT_1]:
            if(player.speed > 0) //se sto andando in retromarcia devo invertire il comando
                player.steering = -controllability;
            else
                player.steering = controllability;
                
            break;
    }

}


export {IdleState, AcceleratingState, BrakingState, ReverseState, MovingState}