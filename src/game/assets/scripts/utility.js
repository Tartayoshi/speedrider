//Approssimazione di PI
export const PI = 3.142; //Math.PI usa un valore molto preciso, riducendolo dovrei ottimizare di poco i calcoli

//Risoluzione Canvas
export const CANVAS_WIDTH = window.screen.width; //px
export const CANVAS_HEIGHT = window.screen.height; //px

//Mode 7 parametri (finto 3D)
export const RENDERING_RESOLUTION = 1000; //px
export const TEXTURE_RESOLUTION = 1000; //px
export const SKYBOX_TEXTURE_WIDTH = 720; //px
export const SKYBOX_TEXTURE_HEIGHT = 90; //px
export const CAMERA_HEIGHT = 0.018;
export const CAMERA_TILT = 1.3;
export const CAMERA_DISTANCE = 30;//CANVAS_HEIGHT * Z_SCALE * CAMERA_DISTANCE / TEXTURE_RESOLUTION;
//export const CAMERA_DISTANCE = 1.5;

export const Z_SCALE = RENDERING_RESOLUTION * CAMERA_HEIGHT;


export const SPRITE_RENDERING_FACTOR = 10;
export const RENDER_Y = CANVAS_HEIGHT - (CANVAS_HEIGHT / CAMERA_TILT);

//Mode 7 static trapezioid si può parametrizzare usando un FOV, per semplicità l'ho fatto statico
export const FARX1 = 0;
export const FARY1 = 0;

export const FARX2 = RENDERING_RESOLUTION;
export const FARY2 = FARY1;

export const NEARX1 = RENDERING_RESOLUTION / 2;
export const NEARY1 = RENDERING_RESOLUTION + RENDERING_RESOLUTION / Z_SCALE;

export const NEARX2 = NEARX1;
export const NEARY2 = NEARY1 + Z_SCALE / (RENDERING_RESOLUTION / TEXTURE_RESOLUTION * 10);

//Parametri di registrazione del fantasma
export const SAMPLING_HZ = 8; //Hz
export const SAMPLING_TIMER = 1000 / SAMPLING_HZ; //1000 / hz

//controlli del veicolo, 0: WASD + spazio; 1 Arrows + Ctrl
export const PLAYER_KEYS = {
    ACCELERATE_0 : 'w',
    ACCELERATE_1 : 'ArrowUp',

    LEFT_0 : 'a',
    LEFT_1 : 'ArrowLeft',

    RIGHT_0 : 'd',
    RIGHT_1 : 'ArrowRight',

    REVERSE_0 : 's',
    REVERSE_1 : 'ArrowDown',

    //DRIFT KEY
    BRAKE_0 : ' ',
    BRAKE_1 : 'Control' 
}


