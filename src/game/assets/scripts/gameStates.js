import { States } from "./states.js";
import { TimeConverter } from "./timeConverter.js";
import { PLAYER_KEYS as mapKeys} from "./utility.js";

const POPUP_TIMER = 250; //ms
const BOOST_SPEED = 3;

//STATE MACHINE: contiene tutti gli stati possibili del gioco
const STATES = {
    MENU: 0,
    SOLO: 1,
    GHOST: 2,
    END: 3,
    COUNTDOWN: 4
}

const MODE = {
    SOLO: 0,
    AGAINST: 1
    //TRAINING: 2
}

class MenuState extends States{
    constructor(gameManager){
        super('MENU');
        this.gameManager = gameManager;
    }

    enter(){//quando entro nello stato eseguire:
        super.enter();
        //non viene mai chiamata
    }

    logic(key){//Quando devo svolgere un'azione nel ciclo principale
        super.logic();
        //console.log(this.name);
        if(key[' '] && this.gameManager.dataLoaded){//quando il tasto spazio viene premuto e i dati sono pronti inizio il conto alla rovescia

            this.gameManager.setState(STATES.COUNTDOWN);
        }

    }

    exit(){//quando sto cambiando stato
        super.exit();
        this.gameManager.syncPlayerTrack();//posiziono il giocatore sulla line adi partenza
        this.gameManager.initLap();
        this.gameManager.ui.showStartScreen = false; //nascondo la schermata di avvio
        
    }
}

class SoloState extends States{
    constructor(gameManager){
        super('SOLO');
        this.gameManager = gameManager;
    }

    enter(){
        super.enter();
        
        this.gameManager.player.lastFrameTime = Date.now(); //Setta il contatore del tempo per la fisica del veicolo
        this.gameManager.startRecording(); //inizio a registrare la poszione del giocatore
    }

    logic(key){//chiamo l'update di chi e' conivolto nella modalità
        super.logic();
        this.gameManager.updateTimer();
        this.gameManager.monitorLap();

        this.gameManager.recorder.update();

        this.gameManager.player.update(key);
        if(key['Enter']){ //fine partita
            this.gameManager.setState(STATES.END);
        }

        if(key['Escape']){
            if(document.fullscreenElement !== null){
                document.exitFullscreen();
            }
        }
        
    }

    exit(){//quando esco devo smettere di mostrare il giocatore e la mappa
        super.exit();
        this.gameManager.player.hidden = true;
        this.gameManager.track.hidden = true;
    }
}

class GhostState extends States{
    constructor(gameManager){
        super('GHOST');
        this.gameManager = gameManager;
    }

    enter(){
        super.enter();

        this.gameManager.player.lastFrameTime = Date.now();//Setta il contatore del tempo per la fisica del veicolo (fixedUpdate)
        if(this.gameManager.ghost){
            this.gameManager.ghost.lastFrameTime = Date.now(); //ghost usa (fixedUpdate)
        }else{
            this.gameManager.handleError("Ghost uninitialized");
        }

        this.gameManager.ghost.x = this.gameManager.track.mapData.start[0];
        this.gameManager.ghost.y = this.gameManager.track.mapData.start[1];

        this.gameManager.startRecording();
        this.gameManager.startGhost(); //avvio replay fantasma
    }

    logic(key){
        super.logic();

        this.gameManager.updateTimer();
        this.gameManager.monitorLap();

        this.gameManager.recorder.update();

        this.gameManager.player.update(key);
        this.gameManager.ghost.update();
        if(key['Enter']){
            this.gameManager.setState(STATES.END);
        }

        if(key['Escape']){
            if(document.fullscreenElement !== null){
                document.exitFullscreen();
            }
        }
    }

    exit(){
        super.exit();
        this.gameManager.stopGhost();
    }
}


class EndState extends States{
    constructor(gameManager){
        super('END');
        this.gameManager = gameManager;
    }

    enter(){
        super.enter();

        this.gameManager.stopRecording();

        this.gameManager.ui.showEndScreen = true;
        this.gameManager.ui.showStartScreen = false; //uscita prematura, evito sovrapposizioni di testo
        this.gameManager.ui.showCountdown = false;// come prima
        this.gameManager.ui.showWrongDirection = false;
        this.gameManager.drawScene(); //force draw before pop up, in alcuni casi rimanevao sovrapposizioni di testo sullo schermo, questo risolve
        if(document.fullscreenElement !== null){
            document.exitFullscreen();
        }

        if(this.gameManager.validTime){ //se il tempo è valido chiedo al giocatore se vuole salvarlo, genero il popup

            let timeStr = TimeConverter.intToStr(this.gameManager.timer);


            let title = document.querySelector("#congrats>h2");
            let msg = document.querySelector("#msg");
            let stat = document.querySelector("#gameStat");
            let time = document.querySelector("#time");


            document.querySelector("#save").addEventListener('click', ()=>this.gameManager.exitGame(true));
            document.querySelector("#cancel").addEventListener('click', ()=>this.gameManager.exitGame(false));

            switch(this.gameManager.gameMode){

                case MODE.SOLO:
                    title.textContent = "Fine!";
                    msg.textContent = "Il tuo tempo è stato registrato. Adesso puoi salvare il tuo tempo e tornare alla pagina precedente."
                    stat.textContent = "";
                    

                    break;
                case MODE.AGAINST:

                    if(this.gameManager.timer < this.gameManager.record.time){

                        let dt = this.gameManager.record.time - this.gameManager.timer;

                        let dtStr = TimeConverter.intToStr(dt);

                        title.textContent = "Congratulazioni!";
                        title.classList.add("good");

                        msg.textContent = "Sei fortissimo! Sei riuscito a battere " + this.gameManager.record.player_name + " con uno stacco di: ";
                        stat.textContent = "- " + dtStr;
                        stat.classList.add("good");

                    }else{

                        let dt = this.gameManager.timer - this.gameManager.record.time;
                       
                        let dtStr = TimeConverter.intToStr(dt);

                        title.textContent = "Sarà per la prossima...";
                        title.classList.add("bad");

                        msg.textContent = "Peccato, mancava poco! Ma sei arrivato secondo... Batterai " + this.gameManager.record.player_name + " la prossima volta. ";
                        stat.textContent = "+ " + dtStr;
                        stat.classList.add("bad");

                    }

                    break;
                
                default:
                    alert("Errore, modalità di gioco non definita:\nGame Mode = " + this.gameManager.gameMode);
                    this.gameManager.exitGame();
                    break;

            }
            
            time.textContent = "Tempo: " + timeStr;

            setTimeout(() => {
                document.querySelector("#congrats").hidden = false;
                document.querySelector("#congrats").classList.add("display");


            }, POPUP_TIMER);

        } else{
            setTimeout(()=>{
                alert("Stai per lasciare questa pagina");
                this.gameManager.exitGame();
            }, POPUP_TIMER); //ritardo il popup, dopo una corsa intensa siamo affaticati, questo breve quasi impercettibile ritardo rende il popup meno frettoloso e più naturale
        }

        

        
    }

    logic(key){
        super.logic();
        //non devo fare nulla
    }

    exit(){
        super.exit();
        //non viene mai chiamata, esattamente come enter nel primo stato
    }
}

class CountDownState extends States{

    constructor(gameManager){
        super('COUNTDOWN');
        this.gameManager = gameManager;
        this.boost = false;
    }

    enter(){
        super.enter();

        this.gameManager.ui.showCountdown = true;

        this.gameManager.player.hidden = false;//mostro giocatore mappa e fantasma
        this.gameManager.track.hidden = false;
        if(this.gameManager.ghost){
            this.gameManager.ghost.hidden = false;
        }

        this.gameManager.ui.showLap = true;//ui di gioco
        this.gameManager.ui.showTimer = true;

        this.gameManager.lastFrameTime = Date.now();//serve per il conto all rovescio, setto il timer
       
    }

    logic(key){
        super.logic();

        let now = Date.now();
        this.gameManager.timer += (now - this.gameManager.lastFrameTime);
        this.gameManager.lastFrameTime = now;

        switch(true){
            case this.gameManager.timer < 1000:
                this.gameManager.countdownTick(3);
                break;
            case this.gameManager.timer < 2000:
                this.gameManager.countdownTick(2);
                if(key[mapKeys.ACCELERATE_0] || key[mapKeys.ACCELERATE_1]){
                    //boost partenza
                    this.boost = true;
                }else{
                    this.boost = false;
                }
                break;
            case this.gameManager.timer < 3000:
                this.gameManager.countdownTick(1);
                if(key[mapKeys.ACCELERATE_0] == false && key[mapKeys.ACCELERATE_1] == false){
                    this.boost = false;
                }
                break;
            case this.gameManager.timer > 3000:
                this.gameManager.countdownTick(0);
                if(this.boost){
                    this.gameManager.player.speed = BOOST_SPEED;
                }
                if(this.gameManager.gameMode == MODE.SOLO){
                    this.gameManager.setState(STATES.SOLO); 
                }else{
                    this.gameManager.setState(STATES.GHOST);
                }
                
                break;
        }
        
    }

    exit(){
        super.exit();

        this.gameManager.timer = 0;//resetto il timer, inizio a contare il tempo del giocatore
        setTimeout(()=>{this.gameManager.ui.showCountdown = false;}, 1000);//lascio la scritta "Via" sullo schermo ancora per un secondo
    }
}


export {MenuState, SoloState, GhostState, EndState, CountDownState};