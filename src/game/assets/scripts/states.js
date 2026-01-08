//Javascript usa "Duck Typing", ma volevo comunque una classe di appoggio/template per tutti gli stati definiti

class States{
    constructor(name){ //nome stato, utile per il debugging
        this.name = name;
    }

    enter(){
        //Esegue all'ingresso dello stato
    }

    exit(){
        //Esegue all'uscita dello stato
    }

    logic(){
        //Update, logica stato
    }

}

export {States};

