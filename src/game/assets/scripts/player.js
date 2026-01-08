import { IdleState, AcceleratingState, BrakingState, ReverseState, MovingState } from "./playerStates.js";
import { Playable } from "./playable.js";
import * as Utility from "./utility.js";

//Parametri kart
const MAXSPEED = 5;
const MAXSPEED_OFFROAD = 1.5;

const CUTSPEED = 0.1;
const MAXANGLESPEED = 0.002;
const ANGULAR_SPEED_MOLTIPLICATOR = 15;
const ANGULAR_SPEED_FACTOR = 10000;

const COLLISION_RADIUS = 5; //px
const COLLISION_ANGLE = 30 * Utility.PI / 180;
const COLLISION_RESOLUTION = MAXANGLESPEED * 40;

const ACELERATION = 0.005;
const BRAKE_FORCE = 0.002;
const BRAKE_FORCE_OFFROAD = 0.004;
const AIR_RESISTANCE = 0.01;
const DUMPING = 0.2;


const MAP_DIMENSION = Utility.RENDERING_RESOLUTION; //px 

//Modalità debug
const DEBUG = false;

const MATERIAL = {
    SOLID : {
        r : 255,
        g : 0,
        b : 0,
        a : 255
    },

    OFFROAD : {
        r : 0,
        g : 0,
        b : 255,
        a : 255
    }
}


class Player extends Playable{
    constructor(gameManager){
        //SUPER
        super(gameManager);

        this.gameManager.waitForData(2); //terrain material

        this.throttle = 0;
        this.steering = 0;
        this.braking = false;

        
        this.speed = 0;
        this.anglSpeed = 0;

        this.angle = Math.PI/2;

        this.zIndex = 1;

        let z = (Utility.FARY1 - Utility.NEARY1) / ((this.yPlayerOnRender - 0) - Utility.NEARY1); //
        this.realSpriteSize = this.spriteScreenSize * z / Utility.SPRITE_RENDERING_FACTOR;
        this.spriteY = (z / Utility.Z_SCALE - 0.001) * (this.gameAreaHeigth / Utility.CAMERA_TILT);

        this.spriteScreenSize = this.gameAreaHeigth / 7.2;
        
        
        
        this.playerStates = [
            new IdleState(this),
            new AcceleratingState(this),
            new BrakingState(this),
            new ReverseState(this),
            new MovingState(this)
        ];

        this.currentState = this.playerStates[0];

        this.sprite = new Image(); //carico lo sprite da immagine
        this.sprite.src = "../game/assets/sprites/player.png";
        this.sprite.onload = () =>{
            this.gameManager.updateLoadingState();
        };

        this.mapMaterial = new Image();
        let trackId = null;

        if(this.gameManager.gameMode == 1){ //recupero le informazioni sul tracciato, per le collisioni e terreno
            trackId = this.gameManager.record.map_id;
        }else{
            trackId = document.querySelector("canvas").dataset.track;
        }

        this.material = document.createElement('canvas');
        this.material.id = "materialRender";
        this.material.height = MAP_DIMENSION;
        this.material.width = MAP_DIMENSION;

        this.materialCTX = this.material.getContext('2d', { willReadFrequently: true });
        


        //console.log(trackId);
        this.mapMaterial.src = "../game/assets/maps/" + trackId + "/" + trackId + "_material.png"; //recupero la texture in cui sono salvate le informazioni sul materiale del terreno
        this.mapMaterial.onload = () =>{
            this.materialCTX.drawImage(this.mapMaterial, 0, 0)
            this.gameManager.updateLoadingState();
        };

        //DEBUG
        if(DEBUG){
            document.querySelector('section').appendChild(this.material);
        }

        
        this.checkpoints = []; //server in modalità debug
    }

    draw(ctx){
        if(!this.hidden){

            let step = MAXANGLESPEED / 4;
            let steering = -this.anglSpeed * this.steering;
            let width_scale = 1;

            ctx.save();

            if(steering < 0){
                steering = -steering;
                ctx.scale(-1, 1);
                width_scale = -1;
                
            }

            if(steering < step){
                this.frame = 0;
            }else if(steering < step * 2){
                this.frame = 1;
            }else if(steering < step * 3){
                this.frame = 2;
            }else if(steering < step * 4){
                this.frame = 3;
            } else{
                this.frame = 4;
            }

            ctx.drawImage(
                    this.sprite, this.width * this.frame,
                    this.heigth * 1, this.width,
                    this.heigth, (this.gameAreaWidth / 2) * width_scale - (this.realSpriteSize / 2),
                    this.spriteY + this.yScreenStart - this.realSpriteSize / this.scale,
                    this.realSpriteSize, this.realSpriteSize

            );
            ctx.restore();
            //DEBUG
            if(DEBUG){
                this.debugCollision();
                this.debugCheckPoints();
            }
        }
    }


    update(keys){
        if(!this.hidden){
            this.currentState.logic(keys);

            this.handlePhisic();
        }
        
    }


    setState(state){
        this.currentState.exit();
        this.currentState = this.playerStates[state];
        this.currentState.enter();

        //DEBUH
        if(DEBUG){
            console.log(this.currentState.name);
        }
    }


    handlePhisic(){
        let now = Date.now(); //fixedUpdate, so quanto tempo passa tra due fotogrammi, il veicolo si muoverà a prescidere della velocità del gioco
        let deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        //Sensori per le collisioni, sono visibili in modalità debug
        let XR = this.x + COLLISION_RADIUS * Math.cos(this.angle - COLLISION_ANGLE);
        let YR = -this.y - COLLISION_RADIUS * Math.sin(this.angle - COLLISION_ANGLE);
        let XL = this.x + COLLISION_RADIUS * Math.cos(this.angle + COLLISION_ANGLE);
        let YL = -this.y - COLLISION_RADIUS * Math.sin(this.angle + COLLISION_ANGLE);
        //console.log(deltaTime);

        //DEBUG
        if(DEBUG){
            this.materialCTX.clearRect(0, 0, MAP_DIMENSION, MAP_DIMENSION);
            this.materialCTX.drawImage(this.mapMaterial, 0, 0)
        }

        switch(true){ //individuo collisioni

            case (this.checkMaterial(MATERIAL.SOLID, XR, YR) || 
                    this.checkMaterial(MATERIAL.SOLID, XL, YL) ||
                    this.checkMaterial(MATERIAL.SOLID)):
                if(DEBUG)
                    console.log('COLLISION');
                if(this.checkMaterial(MATERIAL.SOLID,
                    XR,
                    YR) 
                    && 
                    this.checkMaterial(MATERIAL.SOLID,
                    XL,
                    YL)
                 )
                {
                    if(DEBUG)
                        console.log('FRONTAL');
                    this.y -= this.speed * Math.sin(this.angle);
                    this.x -= this.speed * Math.cos(this.angle);
                    this.speed = -this.speed * DUMPING;
                }
                 else if(this.checkMaterial(MATERIAL.SOLID,
                    XL,
                    YL)
                    &&
                    !this.checkMaterial(MATERIAL.SOLID))
                {
                    if(DEBUG)
                        console.log('LEFT');
                    this.y -= this.speed * Math.sin(this.angle);
                    this.x -= this.speed * Math.cos(this.angle);
                    this.angle -= (COLLISION_ANGLE / COLLISION_RESOLUTION) * Math.abs(this.anglSpeed);
                    this.speed -= DUMPING;

                }else if(this.checkMaterial(MATERIAL.SOLID,
                    XR,
                    YR)
                    &&
                    !this.checkMaterial(MATERIAL.SOLID))
                {
                    if(DEBUG)
                        console.log('RIGHT');
                    this.y -= this.speed * Math.sin(this.angle);
                    this.x -= this.speed * Math.cos(this.angle);
                    this.angle += (COLLISION_ANGLE / COLLISION_RESOLUTION) * Math.abs(this.anglSpeed);
                    this.speed -= DUMPING;
                }else{
                    if(DEBUG)
                        console.log('BACK');
                    this.y -= this.speed * Math.sin(this.angle);
                    this.x -= this.speed * Math.cos(this.angle);
                    this.speed = -this.speed * DUMPING;
                }

                break;
            case this.checkMaterial(MATERIAL.OFFROAD): //controllo se sono fuori pista

                this.handleKart(ACELERATION, MAXSPEED_OFFROAD, BRAKE_FORCE_OFFROAD, deltaTime);
                break;    

            default:
                this.handleKart(ACELERATION, MAXSPEED, BRAKE_FORCE, deltaTime); //sono nel tracciato
                break;
        }

        //A questo punto handleKart ha settato i nuovi parametri di angolo e velocità, modifico la poszione di conseguenza

        this.y += this.speed * Math.sin(this.angle);
        this.x += this.speed * Math.cos(this.angle);

        //DEBUG

        if(DEBUG){
            this.logStat();
        }

        
        
    }


    handleKart(acceleration, maxspeed, breakingForce, deltaTime){

        if(this.braking){ //freno
            if(this.speed > 0){
                this.speed -= (breakingForce * deltaTime);
            }else{
                this.speed += (breakingForce * deltaTime);
            }
            
        }else{
            this.speed += (acceleration * deltaTime * this.throttle); //accelero
        }
        this.anglSpeed = (maxspeed * ANGULAR_SPEED_MOLTIPLICATOR/ (this.speed + 0.00001)) / ANGULAR_SPEED_FACTOR; //velocità angolare, va in relazione alla velocità, più vado veloce meno velocemente posso sterzare

        if(this.anglSpeed > MAXANGLESPEED || this.anglSpeed < -MAXANGLESPEED){ //Evito velocità angolari troppo veloci
            if(this.speed < CUTSPEED && this.speed > -CUTSPEED){ //Disabilito lo sterzo a velocità molto basse
                this.anglSpeed = 0;
            }else{
                this.anglSpeed = MAXANGLESPEED * Math.sign(this.anglSpeed);
            }
            
        }


        this.angle += (this.anglSpeed * deltaTime * this.steering); //imposto l'angolo
        //gestisco la velocita
        if(this.speed > 0){ //velocità positiva (sto andando avanti)
            this.speed -= AIR_RESISTANCE;
            if(this.speed < 0){ //impedisco che la velocità dell'aria mi faccia cambiare senso di marcia
                this.speed = 0;
            }else if(this.speed > maxspeed){ //Impedisco velocità infinita

                if(this.speed > (maxspeed + CUTSPEED)){ //se sto andando molto più veloce di max speed, rallento il gokart, niente frenate brusche (utile quando il kart esce fuori strada, la velocità massima è notevolmente più bassa)
                    this.speed -= (acceleration + breakingForce) * deltaTime;
                }else{
                    this.speed = maxspeed;
                }

                
            }
        }else{//velocità negativa (retromarcia), esattamente come sopra, ma con segno invertito
            this.speed += AIR_RESISTANCE;
            if(this.speed > 0){ 
                this.speed = 0;
            }else if(this.speed < -maxspeed){

                if(this.speed < -(maxspeed + CUTSPEED)){
                    this.speed += (acceleration + breakingForce) * deltaTime;
                }else{
                    this.speed = -maxspeed;
                }

            }
        }
    }

    //DEBUG
    logStat(){
        console.log('Speed = ' + this.speed);
        console.log('Throttle = ' + this.throttle);
        console.log('Angular Speed = ' + this.anglSpeed);
        console.log('Position:\nX: ' + this.x + ' Y: ' + this.y);
        console.log('Angle: ' + this.angle * 180 / Math.PI);

    }

    checkMaterial(material, x = this.x, y = -this.y){ //true o false, verifico se il materiale sotto il kart è "material"

        let imageData = this.materialCTX.getImageData(x, y, 1, 1);
        let ok = false;

        if(imageData.data[0] == material.r &&
            imageData.data[1] == material.g &&
            imageData.data[2] == material.b &&
            imageData.data[3] == material.a) 
                ok = true;
        return ok;
    }

    //DEBUG, disegna la mappa dei materiali a chermo con un punto che rappresenta il giocatore, mostra anche i sensori di collisione del veicolo
    debugCollision(){
        //this.materialCTX.clearRect(0, 0, MAP_DIMENSION, MAP_DIMENSION);
        this.materialCTX.drawImage(this.mapMaterial, 0, 0)
        this.materialCTX.strokeStyle = 'green';
        this.materialCTX.lineWidth = 2;
        this.materialCTX.beginPath();
        this.materialCTX.moveTo(this.x, -this.y);
        this.materialCTX.lineTo(this.x + COLLISION_RADIUS * Math.cos(this.angle + COLLISION_ANGLE), -this.y - COLLISION_RADIUS * Math.sin(this.angle + COLLISION_ANGLE)); //left
        this.materialCTX.stroke();
        this.materialCTX.closePath();
        this.materialCTX.beginPath();
        this.materialCTX.moveTo(this.x, -this.y);
        this.materialCTX.lineTo(this.x + COLLISION_RADIUS * Math.cos(this.angle - COLLISION_ANGLE), -this.y - COLLISION_RADIUS * Math.sin(this.angle - COLLISION_ANGLE)); //rigth
        this.materialCTX.stroke();
        this.materialCTX.closePath();
        this.materialCTX.strokeStyle = 'orange';
        this.materialCTX.beginPath();
        this.materialCTX.moveTo(this.x, -this.y);
        this.materialCTX.lineTo(this.x + 20 * Math.cos(this.angle), -this.y - 20 * Math.sin(this.angle));
        this.materialCTX.stroke();
        this.materialCTX.closePath();
        this.materialCTX.fillStyle = 'black';
        this.materialCTX.fillRect(this.x - 1, -this.y - 1, 2, 2);

    }

    //DEBUG, visualizza graficamente i checkpoint sulla mappa dei materiali
    debugCheckPoints(){
        if(this.checkpoints.length == 0){
            return;
        }

        this.materialCTX.save();
        this.materialCTX.globalAlpha = 0.5;

        for(let i = 0; i < this.checkpoints.length; i++){
            
            if(i == 0){
                this.materialCTX.fillStyle = 'lightgreen';
            }else{
                this.materialCTX.fillStyle = 'cyan';
            }
            this.materialCTX.fillRect(this.checkpoints[i][0][0], -this.checkpoints[i][0][1],
                                        this.checkpoints[i][1][0] - this.checkpoints[i][0][0],
                                        -this.checkpoints[i][1][1] +this.checkpoints[i][0][1]);
            //this.materialCTX.fillStyle = 'green'
        }
        this.materialCTX.restore();
        
    }

}






export {Player};