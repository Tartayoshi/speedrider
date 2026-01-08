import * as Utility from "./utility.js";

const SPRITE_DIMENSION = 32; //px
const SCALE = 1.15;

class Playable{ //classe playable, setta parametri a comune tra fantasma e giocatore
    constructor(gameManager){

        this.gameManager = gameManager;

        this.gameAreaWidth = this.gameManager.canvas.width;
        this.gameAreaHeigth = this.gameManager.canvas.height;

        this.spriteScreenSize = this.gameAreaWidth/10;

        this.scale = SCALE;

        this.width = SPRITE_DIMENSION;
        this.heigth = SPRITE_DIMENSION;

        this.frame = 0;

        this.x = 0; //set by game manager
        this.y = 0;

        this.lastFrameTime = Date.now(); //set by game manager

        this.angle = Math.PI/2;
        this.hidden = true;

        this.zIndex = 0;

        this.xPlayerOnRender = Utility.RENDERING_RESOLUTION / 2;
        this.yPlayerOnRender = Utility.RENDERING_RESOLUTION - (Utility.RENDERING_RESOLUTION / Utility.CAMERA_DISTANCE)
        this.yScreenStart = Utility.RENDER_Y;

    }

    //Fuzioni template
    draw(ctx){}

    update(){}

}

export {Playable};