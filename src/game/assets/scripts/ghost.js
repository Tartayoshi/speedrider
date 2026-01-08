import { Playable } from "./playable.js";
import * as Utility from "./utility.js";

const ANIMATION_HALF_FRAMES = 12-1; //
const FRAME_STEP = Utility.PI / ANIMATION_HALF_FRAMES;

const OPACITY = 0.7;

//abilita modalità debug
const DEBUG = false;


class Ghost extends Playable{
    constructor(gameManager, player, track){ //player per la posizione relativa giocatore fantasma, track per i parametri del render pseudo 3d
        super(gameManager);

        this.gameManager.waitForData(1); //sprite

        this.recorderTimeTick = -1;

        this.player = player;
        this.track = track;//used for debug

        this.nextX = 0;
        this.nextY = 0;
        this.nextAngle = 0;

        this.precX = 0;
        this.precY = 0;
        this.precAngle = 0;

        this.frameCount = 0;

        this.relX = 0;
        this.relY = 0;

        this.relAngle = 0;

        this.sprite = new Image();
        this.sprite.src = "../game/assets/sprites/player.png";
        this.sprite.onload = () =>{
            this.gameManager.updateLoadingState();
        };

    }

    draw(ctx){
        if(!this.hidden){

            if(DEBUG){
                this.debug(); 
            }
                      

            //Si tratta della formula inversa del rendering della mappa, devo fare l'operazione inversa, preso un punto sulla mappa 2d devo sapere dove casca in pseudo 3d
            let z = (Utility.FARY1 - Utility.NEARY1) / ((this.yPlayerOnRender - this.relY) - Utility.NEARY1);
            
            let sx = (Utility.FARX1 - Utility.NEARX1) / z + Utility.NEARX1;
            let ex = (Utility.FARX2 - Utility.NEARX2) / z + Utility.NEARX2;

            let xw = ((this.xPlayerOnRender - this.relX) - sx) / (ex - sx);
           
            let X = xw * this.gameAreaWidth;
            let Y = (z / Utility.Z_SCALE - 0.001) * (this.gameAreaHeigth / (Utility.CAMERA_TILT));
    

            let size = this.spriteScreenSize * z / Utility.SPRITE_RENDERING_FACTOR;

        
            if((Y + this.yScreenStart - size / this.scale) > this.yScreenStart){ //questo controllo serve per evitare fantasmi volanti, poteva capitare che il fantasma apparisse in cielo, probabilmente qualche valore iverte il segno
                
                let width_scale = 1;

                let normRelAngle = this.relAngle % (Utility.PI * 2);
                let frameAngle;

                if(Math.abs(normRelAngle) > Utility.PI){
                    frameAngle = normRelAngle % Utility.PI - Math.sign(normRelAngle) * Utility.PI;
                }else{
                    frameAngle = normRelAngle;
                }

                this.frame = Math.floor(frameAngle / FRAME_STEP);

                //DEBUG
                //console.log(this.frame);

                ctx.save();

                ctx.globalAlpha = OPACITY;

                if(this.frame < 0){
                    this.frame = -this.frame;
                }else{
                    ctx.scale(-1, 1);
                    width_scale = -1;
                }

                


                ctx.drawImage( //disegno lo sprite
                    this.sprite, this.width * this.frame,
                    this.heigth * 1 , this.width,
                    this.heigth, X * width_scale - (size / 2),
                    Y + this.yScreenStart - size / this.scale,
                    size, size
                );

                ctx.restore();
            }
            
            
            
        }

    }

    update(){
        if(!this.hidden){
        
            let now = Date.now()//fixedUpdate
            let deltaTime = now - this.lastFrameTime;
            this.lastFrameTime = now;

            this.frameCount -= deltaTime;

            if(this.recorderTimeTick > 0){ //se la registrazione non è partita non calcolo la nuova posizione, tutti sono fermi
                if(this.frameCount >= 0){

                    let lambda = this.frameCount / this.recorderTimeTick;

                    this.x = lambda * (this.precX - this.nextX) + this.nextX;
                    this.y = lambda * (this.precY - this.nextY) + this.nextY;
                    this.angle = lambda * (this.precAngle - this.nextAngle) + this.nextAngle;

                }else{ //provo a prevedere la posizione futura, il replay in alcuni momenti ritarda qualche millisecondo ad aggiornare la posizione, durante quel tempo provo a prevedere posizione

                    let xStep = (this.nextX - this.precX) / this.recorderTimeTick; //predizione lineare, basata sulla velocità del fantasma nell'arco dell'ultimo campionamento
                    let yStep = (this.nextY - this.precY) / this.recorderTimeTick;
                    let angStep = (this.nextAngle - this.precAngle) / this.recorderTimeTick;

                    this.x += (xStep * deltaTime);
                    this.y += (yStep * deltaTime);
                    this.angle += (angStep * deltaTime);

                    if(this.frameCount < -10){
                        console.log("CAN'T KEEP UP! player is behind " + this.frameCount + "ms"); //messaggio di warning, per indicare che il replay non sta aggiornando la posizione da oltre 10ms oltre il tempo previsto
                    }           

                }
            }
            


            let distX = this.x - this.player.x;
            let distY = this.y - this.player.y;

            this.relX = -distX * Math.sin(this.player.angle) + distY * Math.cos(this.player.angle);
            this.relY = distY * Math.sin(this.player.angle) + distX * Math.cos(this.player.angle); //posizone relativa fantasma giocatore

            this.relAngle = this.angle - this.player.angle;

           if(this.relY > 0){
                this.zIndex = 0;
           }else{
                this.zIndex = 2;
           }
            
        }
    }

    setPosition(next_x, next_y, next_angle){

        this.precX = this.x;
        this.precY = this.y;
        this.precAngle = this.angle;

        this.nextX = next_x;
        this.nextY = next_y;
        this.nextAngle = next_angle;

        //DEBUG
        //console.log(this.frameCount);

        this.frameCount = this.recorderTimeTick; //set by recorder, tiene il periodo di aggiornamento
        
    }

    //DEBUG
    debug(){ //utile se anche player è in debug, funzione utilizata in fase di test, da quando è stato implementato il zBuffer il fantasma sulla minimappa si vede solo se viene disegnato dopo il giocatore
        //Posizione in mappa collisioni
        this.player.materialCTX.strokeStyle = 'green';
        this.player.materialCTX.beginPath();
        this.player.materialCTX.moveTo(this.x, -this.y);
        this.player.materialCTX.lineTo(this.x + 20 * Math.cos(this.angle), -this.y - 20 * Math.sin(this.angle));
        this.player.materialCTX.stroke();
        this.player.materialCTX.closePath();


        this.player.materialCTX.fillStyle = 'violet';
        this.player.materialCTX.fillRect(this.x - 1, -this.y - 1, 2, 2);

        //Disegna un punto nel redner 2d che rappresenta il fantasma
        this.track.renderCTX.fillStyle = 'magenta';
        this.track.renderCTX.fillRect(Utility.RENDERING_RESOLUTION/2 -2 - this.relX , Utility.RENDERING_RESOLUTION - (Utility.RENDERING_RESOLUTION / Utility.CAMERA_DISTANCE) -2 - this.relY, 4 ,4);

    }
}

export {Ghost};