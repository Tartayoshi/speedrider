import * as Utility from "./utility.js";

const TEXTURE_SIZE = Utility.TEXTURE_RESOLUTION;
const RENDER_SIZE = Utility.RENDERING_RESOLUTION;
const HALF_PI = Utility.PI/2

const SKY_OFFSET = 100; //offset orizzonte

const DEBUG = false;//modalità debug

class Track{

    constructor(gameManager, player){

        
        this.gameManager = gameManager;

        this.gameAreaWidth = this.gameManager.canvas.width;
        this.gameAreaHeigth = this.gameManager.canvas.height;

        this.player = player;
        this.hidden = true;

        this.dataLoaded = false;

        if(DEBUG){
            this.gameManager.waitForData(4); // checkpoint from json, track texture, sky texture, track data from database
        }else{
            this.gameManager.waitForData(3); // checkpoint from json, track texture, sky texture.
        }
        
        this.render = document.createElement('canvas');
        this.render.id = "render2D";
        this.render.height = RENDER_SIZE;
        this.render.width = RENDER_SIZE;

        //MODE 7 render, inizialmente avevo impostato qui i parametri, ma poi mi sono reso conto che mi servivano anche per il fantasma
        //per evitare passaggi strani di parametri tra fantasma e tracciato ho spostato le costanti.
        this.zScale = Utility.Z_SCALE;
        this.yScale = Utility.CAMERA_DISTANCE;
        this.tilt = Utility.CAMERA_TILT;

        this.farX1 = Utility.FARX1;
        this.farY1 = Utility.FARY1;

        this.farX2 = Utility.FARX2;
        this.farY2 = Utility.FARY2;

        this.nearX1 = Utility.NEARX1;
        this.nearY1 = Utility.NEARY1;

        this.nearX2 = Utility.NEARX2;
        this.nearY2 = Utility.NEARY2

        this.yScreenStart = Utility.RENDER_Y;


        //Questo canvas conterra l'imagine del percorso in 2d da trasformare in pseudo 3d
        this.renderCTX = this.render.getContext('2d');

        this.mapTexture = new Image();
        this.skyTexture = new Image();

        this.trackId = null;

        if(this.gameManager.gameMode == 1){
            //let gameId = document.querySelector("canvas").dataset.game
            this.trackId = this.gameManager.record.map_id;
        }else{
            this.trackId = document.querySelector("canvas").dataset.track;
        }

        //carico le textures
        this.mapTexture.src = "../game/assets/maps/" + this.trackId + "/" + this.trackId + "_map.png";
        this.mapTexture.onload = () =>{
            this.gameManager.updateLoadingState();
        };

        this.skyTexture.src = "../game/assets/maps/" + this.trackId + "/" + this.trackId + "_sky.png";
        this.skyTexture.onload = () =>{
            this.gameManager.updateLoadingState();
        };

        if(DEBUG)
        {
                fetch("../php/getMaps.php?track=" + this.trackId).then(res => res.json()).then(data => {
                if(!data.ok){
                    throw data.error;
                }
                this.mapInfo = data.maps[0];
                console.log("Track info:")
                console.log(this.mapInfo);

                this.gameManager.updateLoadingState();
                
                

            }).catch(e=>{console.log(e); alert("Qualcosa è andato storto :C\n ERRORE:\nTrack data non recuperati")});
        }   

        fetch("../game/assets/maps/" +  this.trackId + "/" + this.trackId + "_data.json").then(res => res.json()).then(data => {
            this.mapData = data.map;
            this.checkpints = data.checkpoints;
            console.log("Player position and Background color");
            console.log(this.mapData);
            console.log("Checkpoints");
            console.log(this.checkpints);
            this.gameManager.updateLoadingState();
        }).catch(e=>{console.log(e); alert("Qualcosa è andato storto :C\n ERRORE:\nTrack data non recuperati")});
        
        
        //DEBUG
        if(DEBUG){
            document.querySelector('section').appendChild(this.render); //visualizzazione 2d
        }
        
    }

    

    static getDifficulty(numb) { //funzione per recuperare il iviello di dificoltà
        let difficulty = 'ERRORE';

        switch(numb){
            case 0:
                difficulty = 'Facile';
                break;
            case 1:
                difficulty = 'Media';
                break;
            case 2:
                difficulty = 'Difficile';
                break;
        }

        return difficulty;
 
    }

    draw(ctx){
       
        if(!this.hidden){
            /* RENDERING 2D  */
            this.renderCTX.save();

            this.renderCTX.clearRect(0, 0, RENDER_SIZE, RENDER_SIZE);

            this.renderCTX.translate(RENDER_SIZE/2, RENDER_SIZE - (RENDER_SIZE / this.yScale)); // 600 e 500 = 12.5; 600 e 1000 = 30
            this.renderCTX.rotate(this.player.angle - HALF_PI);
            this.renderCTX.translate(-this.player.x, this.player.y + (RENDER_SIZE / this.yScale));
            this.renderCTX.drawImage(this.mapTexture, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE, 0, -(RENDER_SIZE / this.yScale), TEXTURE_SIZE, TEXTURE_SIZE);
            this.renderCTX.restore();
            //debug draw shadow player on maps
            if(DEBUG){
                this.renderCTX.fillStyle = 'black';
                this.renderCTX.fillRect(RENDER_SIZE/2 -2, RENDER_SIZE - (RENDER_SIZE / this.yScale) -2, 4 ,4);
            }
            /* FINE RENDERING 2D */


            //Disegno il cielo
            this.drawSky(ctx);
            //DEBUG
            if(DEBUG){
                //Linea orizzonte, dove la distanza del giocatore è tendente ad infinito
                ctx.fillStyle = "red";
                ctx.fillRect(0 , this.yScreenStart, this.gameAreaWidth, 2);
            }

            /**MODE7 RENDERING PSEUDO 3D **/
            for(let i = 0; i < this.gameAreaHeigth / this.tilt; i++){ //Per ogni linea sullo schermo, scelgo quale porzione della visuale 2D disegnare

                
                let z = (i / (this.gameAreaHeigth / this.tilt) + 0.001) * this.zScale; //sommo 0.001 per evitare divisioni per zero

                let sx = (this.farX1 - this.nearX1) / z + this.nearX1;
                let ex = (this.farX2 - this.nearX2) / z + this.nearX2;
                
                let sy = (this.farY1 - this.nearY1) / z + this.nearY1;
                let ey = (this.farY2 - this.nearY2) / z + this.nearY2;

                ctx.drawImage(this.render, sx, sy, ex - sx , ey - sy, 0, i + this.yScreenStart, this.gameAreaWidth, 2); //2px perchè 1 creava problemi con alcuni valori di tilt: BUG EFFETTO MIRAGGIO

            }
            /**Fine Rendering PSEUDO 3D **/
        }
    }

    drawSky(ctx){

        //let normAngl = Math.cos(this.player.angle/2) * Math.sign(Math.cos(this.player.angle/2));
        let normAngl = this.player.angle % (Utility.PI * 2);
        let lambda = normAngl / (Utility.PI * 2);
        let sky_x = lambda * (this.gameAreaWidth * 4 - 0) % (this.gameAreaWidth * 4);
        //console.log(lambda);

        //Creo un carosello di tre immagini, lo resetto ogni giro in senso orario o anti orario
        ctx.drawImage(this.skyTexture, 0, 0, Utility.SKYBOX_TEXTURE_WIDTH, Utility.SKYBOX_TEXTURE_HEIGHT, sky_x, -SKY_OFFSET, this.gameAreaWidth * 4, this.gameAreaHeigth / 1.5);
        ctx.drawImage(this.skyTexture, 0, 0, Utility.SKYBOX_TEXTURE_WIDTH, Utility.SKYBOX_TEXTURE_HEIGHT, sky_x - this.gameAreaWidth * 4, -SKY_OFFSET, this.gameAreaWidth * 4, this.gameAreaHeigth / 1.5);
        ctx.drawImage(this.skyTexture, 0, 0, Utility.SKYBOX_TEXTURE_WIDTH, Utility.SKYBOX_TEXTURE_HEIGHT, sky_x + this.gameAreaWidth * 4, -SKY_OFFSET, this.gameAreaWidth * 4, this.gameAreaHeigth / 1.5);

        ctx.fillStyle = this.mapData.background;
        ctx.fillRect(0, this.gameAreaHeigth / 1.5 - SKY_OFFSET, this.gameAreaWidth, this.gameAreaHeigth / 1.5 + SKY_OFFSET);

    }

}

export {Track};