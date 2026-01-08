//Utile per convertire il tempo da ms a min:sec.ms
export class TimeConverter{

    //stringa stile min' sec.ms"
    static intToStr(msTimer){
        let ms = msTimer % 1000;

        if(ms == 0){

            ms = "000";

        }else if(ms < 10){
            ms = "00" + ms;
        }else if(ms < 100){
            ms = "0" + ms;
        }

        let sec = Math.floor(msTimer / 1000) % 60;
        let min = Math.floor(msTimer / 1000 / 60);

        return "" + min + "'" + sec + "." + ms + "\"";
    }

    //stringa a lunghezza fissa MM:ss.mmmm
    static intToFixStr(msTimer){
        let ms = msTimer % 1000;

        if(ms == 0){

            ms = "000";

        }else if(ms < 10){
            ms = "00" + ms;
        }else if(ms < 100){
            ms = "0" + ms;
        }

        let sec = Math.floor(msTimer / 1000) % 60;
        if(sec < 10){
            sec = "0" + sec;
        }
    
        let min = Math.floor(msTimer / 1000 / 60);

        if(min < 10){
            min = "0" + min;
        }

        return "" + min + ":" + sec + "." + ms;
    }

}