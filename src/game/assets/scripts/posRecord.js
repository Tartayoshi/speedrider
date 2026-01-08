import * as Utility from "./utility.js";

//Si occupa di registrare il movimento del giocatore e riprodurre quello del fantasma

class PositionRecorder{

    constructor(gameManager, player){
        this.player = player;
        this.gameManager = gameManager;
        this.ghost = null;

        this.timerCount = Utility.SAMPLING_TIMER; //perio do di campionamento, qogni quanto salva un record
        this.lastFrameTime = -1;

        this.recording = false;
        this.pRegister = [];//array con i dati posizione giocatore

        this.playing = false;
        this.gRegister = [];//array con dati posizone fantasma

        this.gameManager.waitForData();
        this.recordTimer = null;
        this.playTimer = null;
    }

    setGhost(ghost, gameId){ //quando viene chiamato posso caricare i dati del fantasma
        this.ghost = ghost;

        this.ghost.recorderTimeTick = Utility.SAMPLING_TIMER;

        fetch("../php/downloadGhost.php?game=" + gameId).then(res => res.json()).then(data => {
            if(!data.ok){
                console.log(data.error);
                this.dataLoaded = -1;
                return;
            }

            this.gRegister = JSON.parse(data.posData);
            this.gameManager.updateLoadingState();
            //DEBUG
            console.log("Ghost positional data:")
            console.log(this.gRegister);

            

            //this.dataLoaded = true;
        }).catch(e=>{console.log(e); alert("Qualcosa è andato storto :C\n ERRORE:\nGhost data non recuperati"); this.dataLoaded = -1;})
    }

    update(){
        if(this.recording || this.playing){ //non fa nulla se non sto riproducendo / registrando

            let now = Date.now()//fixedUpdate
            let deltaTime = now - this.lastFrameTime;
            this.lastFrameTime = now;

            this.timerCount -= deltaTime;

            if(this.timerCount <= 0){

                if(this.recording){ //Step record

                    this.record();

                }
                    

                if(this.playing){ //Step ghost position
                    
                    this.play();

                }

                this.timerCount = Utility.SAMPLING_TIMER;

            }


        }
    }


    record(){//Registro la posizone e l'angolo del giocatore ("Foto" del giocatore)

        this.pRegister.push([Math.floor(this.player.x), Math.floor(this.player.y), Number(parseFloat(this.player.angle).toFixed(4))]);

    }

    play(){
        if(this.gRegister.length == 1){
            this.stopPlay();
            this.ghost.hidden = true;
            return;
        }

        this.ghost.setPosition(this.gRegister[1][0], this.gRegister[1][1], this.gRegister[1][2])//passo al fantasma la posizione successiva
 


        //console.log(this.gRegister.length);                           
        this.gRegister.splice(0, 1);
    }

    startRecoding(){
        
        if(this.lastFrameTime == -1){
            this.lastFrameTime = Date.now(); //setto il timer per il fixedUpdate
        }

        this.recording = true;

    }

    stopRecording(){

        this.recording = false;

    }


    startPlay(){
        
        if(this.lastFrameTime == -1){
            this.lastFrameTime = Date.now(); //setto il timer per il fixedUpdate
        }

        this.playing = true;

    }

    stopPlay(){
       
        this.playing = false;

    }

    


}

export {PositionRecorder};