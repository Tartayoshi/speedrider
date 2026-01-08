const DELAY = 2000; //2s

let pwd, rpwd, dimension, downcase, uppercase, number;

window.addEventListener("DOMContentLoaded", init);

function init(){
    document.querySelector("#f-username").addEventListener("change", ()=>validate(document.querySelector("#f-username")));
    
    document.querySelector("#f-password").addEventListener("input", delayedPwdValidate);
    document.querySelector("#f-password").addEventListener("change", ()=>validate(document.querySelector("#f-password")));
    document.querySelector("#f-rpassword").addEventListener("change", pwdMatch);

    pwd = document.querySelector("#f-password");
    rpwd = document.querySelector("#f-rpassword");

    dimension = document.querySelector("#v-dimension");
    downcase = document.querySelector("#v-downcase");
    uppercase = document.querySelector("#v-uppercase");
    number = document.querySelector("#v-number");
};


function delayedPwdValidate(){


    if(pwd.value.match(/[a-z]/)){
        downcase.classList.remove('unchacked');
        downcase.classList.add('chacked');
    }else{
        downcase.classList.remove('chacked');
        downcase.classList.add('unchacked');
    }

    if(pwd.value.match(/[A-Z]/)){
        uppercase.classList.remove('unchacked');
        uppercase.classList.add('chacked');
    }else{
        uppercase.classList.remove('chacked');
        uppercase.classList.add('unchacked');
    }

    if(pwd.value.match(/\d/)){
        number.classList.remove('unchacked');
        number.classList.add('chacked');
    }else{
        number.classList.remove('chacked');
        number.classList.add('unchacked');
    }

    if(pwd.value.match(/.{8,}/)){
        dimension.classList.remove('unchacked');
        dimension.classList.add('chacked');
    }else{
        dimension.classList.remove('chacked');
        dimension.classList.add('unchacked');
    }
}



function validate(elem){
    if(elem.validity.valid == true){
        elem.classList.remove("delayedInvalid");
    }else{
        elem.classList.add("delayedInvalid");
    }
}


function pwdMatch(){

    if(pwd.value === rpwd.value){
        rpwd.classList.remove('delayedInvalid');
    }else{
        rpwd.classList.add('delayedInvalid');
    }

}