const NORMAL_SIZE = 4;
const MEDIUM_SIZE = 5;
const BIG_SIZE = 6;

const REL_RES = 0.02;//Fattore risoluzione

//Gestione interfaccia grafica
class UserInterface{
    constructor(gameAreaWidth, gameAreaHeigth){
        this.windowWidth = gameAreaWidth;
        this.windowHeigth = gameAreaHeigth;

        //Enable/disable
        this.showTimer = false;
        this.showLap = false;
        this.showCountdown = false;
        this.showStartScreen = true;
        this.showEndScreen = false;
        this.showWrongDirection = false;

        //txt placeholders
        this.timer = "Tempo 00:00.000";
        this.lap = "Giro 0/0";
        this.countdown = -1;
        this.resume = "Fine";
        this.startScreen = "Caricamento: 0%";
        this.wrongDirection = "CONTROMANO!!";

        //Serve per rendere il testo indipendente dall risoluzione dello schermo
        this.normalSize = NORMAL_SIZE;
        this.mediumSize = MEDIUM_SIZE;
        this.bigSize = BIG_SIZE;

        //position
        this.lapPosition = [5, 5]; //in alto a sinistra
        this.timerPosition = [this.windowWidth - (this.normalSize * REL_RES * this.windowHeigth) * 8 , 5]; //in alto a destra


    }

    draw(ctx){
        this.displayCountdown(ctx);
        this.displayLap(ctx);
        this.displayTimer(ctx);
        this.displayStartScreen(ctx);
        this.displayEndScreen(ctx);
        this.displayWrongDirection(ctx);

    }

    displayWrongDirection(ctx){

        if(!this.showWrongDirection){
            return;
        }

        ctx.save();

        ctx.font = "bold " + Number(this.bigSize * REL_RES * this.windowHeigth) + "px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.strokeStyle = "white";
        
        ctx.fillText(this.wrongDirection, this.windowWidth / 2, this.windowHeigth / 2);
        ctx.strokeText(this.wrongDirection, this.windowWidth / 2, this.windowHeigth / 2);

        ctx.restore();

    }

    displayTimer(ctx){
        if(!this.showTimer){
            return;
        }

        ctx.save();

        ctx.font = "" + Number(this.normalSize * REL_RES * this.windowHeigth) + "px Arial, Helvetica, sans-serif";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        //console.log(ctx.measureText(this.lap));//Fa log della dimensione in pixel del testo, usato per calcolare REL_RES
        ctx.fillText(this.timer, this.timerPosition[0], this.timerPosition[1] + Number(this.normalSize * REL_RES * this.windowHeigth));
        ctx.strokeText(this.timer, this.timerPosition[0], this.timerPosition[1] + Number(this.normalSize * REL_RES * this.windowHeigth));

        ctx.restore();

    }

    displayLap(ctx){
        if(!this.showLap){
            return;
        }

        ctx.save();

        ctx.font = "" + Number(this.normalSize * REL_RES * this.windowHeigth) + "px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        
        ctx.fillText(this.lap, this.lapPosition[0] + ctx.measureText(this.lap).width / 2, this.lapPosition[1] + (this.normalSize * REL_RES * this.windowHeigth));
        ctx.strokeText(this.lap, this.lapPosition[0] + ctx.measureText(this.lap).width / 2, this.lapPosition[1] + (this.normalSize * REL_RES * this.windowHeigth));
        //console.log(ctx.measureText(this.lap));


        ctx.restore();
        
    }

    displayCountdown(ctx){
        if(!this.showCountdown){
            return;
        }

        ctx.save();

        ctx.font = "bold " + Number(this.bigSize * 1.5 * REL_RES * this.windowHeigth) + "px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "black";
        //console.log(ctx.measureText(this.lap));

        let msg = 'Oh no';

        switch(this.countdown){
            case 0:
                msg = 'VIA!';
                break;
            case 1:
                msg = '1';
                break;
            case 2:
                msg = '2';
                break;
            case 3:
                msg = '3';
                break;
        }


        ctx.fillText(msg, this.windowWidth/2, this.windowHeigth/2);
        ctx.strokeText(msg, this.windowWidth/2, this.windowHeigth/2);

        ctx.restore();
    }

    displayStartScreen(ctx){
        if(!this.showStartScreen){
            return;
        }
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.windowWidth, this.windowHeigth);

        ctx.font = "" + Number(this.normalSize * REL_RES * this.windowHeigth) + "px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.startScreen, this.windowWidth / 2, this.windowHeigth / 2);

        ctx.restore();


    }


    displayEndScreen(ctx){
        if(!this.showEndScreen){
            return;
        }

        ctx.save();

        ctx.font = "bold " + Number(this.bigSize * 1.5 * REL_RES * this.windowHeigth) + "px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "black";
        //console.log(ctx.measureText(this.lap));

        ctx.fillText(this.resume, this.windowWidth/2, this.windowHeigth/2);
        ctx.strokeText(this.resume, this.windowWidth/2, this.windowHeigth/2);

        ctx.restore();
    }




}

export {UserInterface};