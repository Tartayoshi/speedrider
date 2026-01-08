import { Track } from "./track.js";
import { Player } from "./player.js";
import { Ghost } from "./ghost.js";
import { PositionRecorder } from "./posRecord.js";

import { MenuState, SoloState, GhostState, EndState, CountDownState } from "./gameStates.js";
import { InputHandler } from "./input.js";
import { UserInterface } from "./ui.js";
import { TimeConverter } from "./timeConverter.js";

/*Cuore del gioco*/

const MODE = {
    SOLO: 0,
    AGAINST: 1,
    TRAINING: 2
}

const LAPS = 3;
const TIMEOUT = 300000; //ms = 5min tempo limite di una partita

class GameManager{
    constructor(canvas){
    
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.loadCount = 0; //Da incrementare durante l'inizializzazione e decrementare quando tutto è pronto;
        this.maxLoadCount = 0;
        this.waitForData(); //attendo il carcamento del fantasma

        this.gameMode = Number(canvas.dataset.mode);

        this.player = null; 

        this.track = null;  

        this.recorder = null;
        
        //DEBUG 
        console.log('Gamemode = ' + this.gameMode);

        this.inputManager = new InputHandler(); //sistema di gestione input da tastiera
        this.ui = new UserInterface(canvas.width, canvas.height); //interfaccia grafica gioco

        
        this.dataLoaded = false; //quando è true può essere avviato il gioco
        

        if(this.gameMode == -1){
            alert("Qualcosa è andato storto :C"); //fermo tutto
            console.log('PHP error: requested parameters does not exists');
        }
        else if(this.gameMode == 1){//modalità fantasma
            this.game = this.canvas.dataset.game;
            this.initGhost(); //nell initGhiost inizializzo track e player appena ho i dati dal server
            
        }else{ //modalita da solo            

            this.player = new Player(this); //se non inizializzo il fantasma ho il nome del tracciato salvato nel canvas

            this.track = new Track(this, this.player);
            this.recorder = new PositionRecorder(this, this.player);   

            this.updateLoadingState(); //salto il caricamento dei dati del fantasma da parte di game manager;
            this.updateLoadingState(); //salto il caricamento dei dati del fantasma da aprte di recorder;
        
        }
        
        //STATE MACHINE*****
        this.gameStates = [new MenuState(this), new SoloState(this), new GhostState(this), new EndState(this), new CountDownState(this)];
        this.currentState = this.gameStates[0];
        //******

        this.countdown = 3;
        this.lapCount = 0;
        this.timer = 0;
        this.validTime = false;
        this.checkpoints = [];
        this.lastCheckpoint = -1;

        this.lastFrameTime = null;

        

        
       
    }

    updateLoadingState(){ //call after all init 
        this.loadCount--;

        this.ui.startScreen = "Caricamento: " + Math.floor(100 * ((this.maxLoadCount - this.loadCount)/this.maxLoadCount)) + "%"; //semplice output durante il caricamento

        console.log("Waiting for " + this.loadCount + " datas");

        if(this.loadCount == 0){
            this.dataLoaded = true;
            this.ui.startScreen = "Appena sei pronto, premi spazio";
        }

    }

    waitForData(n=1){
        this.loadCount += n;

        if(this.loadCount > this.maxLoadCount){
            this.maxLoadCount = this.loadCount;
        }
    }

    update() {
        //if(this.track.dataLoaded)
        this.currentState.logic(this.inputManager.keys); //la logica da eseguire ad ogni ciclo dipende dal caso
    }

    setState(state){
        this.currentState.exit();
        this.currentState = this.gameStates[state];
        this.currentState.enter();

        console.log(this.currentState.name);
    }

    initGhost(){
        

        fetch("../php/getRecords.php?gameId=" + this.game).then(res => res.json()).then(data => { //recupero i dati della partita dal database
            if(!data.ok){
                throw data.error;
            }
            this.record = data.records;
            console.log(this.record);

            

            this.player = new Player(this); //inizializzo player e track, adesso ho i dati necessari

            this.track = new Track(this, this.player);   
            
            this.ghost = new Ghost(this, this.player, this.track);

            this.recorder = new PositionRecorder(this, this.player);  //inizializzo il sistema di replay del fantasma 

            this.recorder.setGhost(this.ghost, this.canvas.dataset.game);

            this.updateLoadingState();

        }).catch(e=>{console.log(e); alert("Qualcosa è andato storto :C\n ERRORE:\nGame record inesistente");});
    }

    drawScene(){ //disegno lo schermo

        if(this.track){
            this.track.draw(this.context); //cielo e percorso
        }

        if(this.ghost){ //giocatore e fantasma, l'ordine dipende dall posizione relativa tra i due (simulo z-buffer softwer 3D)
            let zBuffer = [this.player, this.ghost];
            zBuffer.sort(this.zSort);
            for(let i = 0; i < zBuffer.length; i++){
                zBuffer[i].draw(this.context);
            }
        }else{
            if(this.player){
                this.player.draw(this.context);
            }
        }

        this.ui.draw(this.context);
        
    }

    zSort(playable1, playable2){ //serve per creare il finto z-buffer
        if(playable1.zIndex > playable2.zIndex)
            return 1;
        return -1;
    }

    syncPlayerTrack(){ //posiziono il giocatre sulla riga di partenza e preparo i checkpoint per registrare i lap
        this.player.x = this.track.mapData.start[0];
        this.player.y = this.track.mapData.start[1];
        this.player.checkpoints = [...this.track.checkpints];
        console.log("Starting...");
    }

    //Chiamare DOPO che i dati sono stati caricati
    initLap(){
        
        if(this.dataLoaded == false){
            console.log("ERRORE, Richiesti i checkpoints prima che i dati fossero pronti");
            return;
        }

        for(let i = 0; i < this.track.checkpints.length; i++){
            this.checkpoints.push(false);
        }
        //DEBUG
        //console.log(this.checkpoints);
        this.ui.lap = "Giro 1/" + LAPS;

    }


    monitorLap(){

        //checkpointsLoop:
        for(let i = 0; i < this.checkpoints.length; i++){

            if(this.player.x > this.track.checkpints[i][0][0] &&
                this.player.x < this.track.checkpints[i][1][0] &&
                this.player.y < this.track.checkpints[i][0][1] &&
                this.player.y > this.track.checkpints[i][1][1]){
                    //DEBUG
                    //console.log('colliding checkpoint ' + i);

                    let prec, next;

                    switch(true){

                        case i == this.lastCheckpoint:
                            return;//già gestito, sono ancora dentro il checkpoint
                            //break;
                        
                        case i == 0:
                            prec = this.checkpoints.length - 1;
                            next = 1;
                            break;

                        case i == this.checkpoints.length - 1:
                            prec = i - 1;
                            next = 0;
                            break;

                        default:
                            next = i + 1;
                            prec = i - 1;
                            break;
                    }

                    if(this.lastCheckpoint == next){
                        //DEBUG
                        //console.log("BACKWARD");
                        this.ui.showWrongDirection = true;
                    }else if(this.lastCheckpoint == prec){
                        this.ui.showWrongDirection = false;
                        if(this.checkpoints[prec] == true || prec == 0){
                            //DEBUG
                            //console.log("CHECKPOINT");
                            if(i == 0){
                                //Ho fatto un giro completo
                                this.setLap();
                                //set lap
                            }else{
                                this.checkpoints[i] = true;
                            }

                        }
                    }

                    this.lastCheckpoint = i;

                    return;

                }

        }
    }

    setLap(){

        if(this.lapCount + 1 == LAPS){ //ultimo lap
            if(this.timer <= TIMEOUT){//se supero questo limite non salvo il tempo, serve per evitare di avere record troppo grandi nel database
                this.validTime = true;
            }
            this.setState(3); //end
            return;
        }

        this.checkpoints = [];
        for(let i = 0; i < this.track.checkpints.length; i++){
            this.checkpoints.push(false);
        }

        this.lapCount++;

        this.ui.lap = "Giro " + Number(this.lapCount + 1) + "/" + LAPS;
    }

//non serve init, ho last frame settato dal countdown
    updateTimer(){
        if(this.countdown != 0){
            return; //time
        }
        let now = Date.now();
        this.timer += (now - this.lastFrameTime);
        this.lastFrameTime = now;

        this.ui.timer = "Tempo " + TimeConverter.intToFixStr(this.timer);
        //this.ui.timer = this.timer;
    }   
    
    countdownTick(value){
        this.countdown = value;
        this.ui.countdown = this.countdown;
    }

    startRecording(){
        this.recorder.startRecoding();
    }

    stopRecording(){
        this.recorder.stopRecording();
    }

    startGhost(){
        this.recorder.startPlay();
    }

    stopGhost(){
        this.recorder.stopPlay();
    }

    exitGame(save = false){

        if(save){

            document.querySelector("#save").disabled = true;
            document.querySelector("#cancel").disabled = true;
            document.querySelector("#saving").textContent = "Caricamento dati sul database in corso...";

            let ajax = new XMLHttpRequest();//carico i dati sul database
            ajax.open("POST", "../php/uploadRecord.php");
            ajax.onload = ()=>{
                if(ajax.status == 200){
                    console.log('Load complete');
                    console.log(ajax.responseText);

                    let data = JSON.parse(ajax.responseText)

                    if(data.ok){
                        document.querySelector("#saving").textContent = "Dati caricati!";
                        document.querySelector("#saving").classList.add("good");

                        document.querySelector("#cancel").textContent = "Uscita";
                        document.querySelector("#cancel").disabled = false;

                    }else{
                        alert("Qualcosa è andato storto :C\n ERRORE:\n" + data.error);
                    }

                }else{
                    alert("Qualcosa è andato storto :C\n ERRORE:\nCollegamento non riuscito");
                }
            }

            ajax.onerror = ()=>{
                alert("Qualcosa è andato storto :C\n ERRORE:\nIl server non ha caricato i dati nel database");
            }

            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            ajax.send("player=" + this.canvas.dataset.player + 
                    "&track=" + this.track.trackId +
                    "&time=" + this.timer +
                    "&posData=" + JSON.stringify(this.recorder.pRegister));
        

        }else{

            this.urlredirect(); //trono alla pagina della mappa
        }

       
    }

    urlredirect(save = true) {
        
        document.querySelector("#congrats").classList.remove("display"); //appena visibile
        window.location.replace('../html/mapInfo.php?track=' + this.track.trackId + "&showLatest=1");//torno alla pagina della mappa mostrando il recod del giocatore (o meglio, l'ultimo record presente)
    }

    handleError(msg){
            
        alert("Attenzione, la configurazione selezionata non è prevista:\n" + msg);
        window.location.replace("../html/notfound.html");
    }
    
    


}

export {GameManager};