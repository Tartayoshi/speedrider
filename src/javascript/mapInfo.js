//import { Track } from "../game/assets/scripts/track.js";
import { TimeConverter } from "../game/assets/scripts/timeConverter.js";

const ELEMENT_IN_PAGE = 5;

let playerTable;
let trackId;
let trackInfo;
let records;
let newestRecord;
let showLatest;

let countDisplay, precButton, nextButton;

let currentPage = 0;

window.addEventListener("DOMContentLoaded", init);

function init(){


    
    trackId = document.querySelector("body>section").dataset.track; //variabili da php
    if(trackId == 0){ //errore da php, non vado oltre
        console.log("php error");
        return;
    }

    playerTable = document.querySelector("#players tbody");
    showLatest = document.querySelector("body>section").dataset.showLatest;//variabili da php


    console.log(showLatest);


    countDisplay = document.querySelector("#tcurrent");
    precButton = document.querySelector("#tprec");
    nextButton = document.querySelector("#tnext");

    precButton.disabled = true;
    nextButton.disabled = true;

    precButton.addEventListener('click', precList);
    nextButton.addEventListener('click', nextList);

    console.log(trackId);

    fetch("../php/getRecords.php?track=" + trackId).then(res => res.json()).then(data=>{
        console.log(data);

        if(!data.ok){
            throw data.error;
        }

        records = data.records;

        records.sort(sortDate);
        newestRecord = records[0];

        
        //records.sort(sortDate);

        records.sort(sortTime);

        if(showLatest == 1){

            let indexOfNewest = records.findIndex((elem) => {
                return elem.id === newestRecord.id;
            });

            currentPage = Math.floor(indexOfNewest / ELEMENT_IN_PAGE);

        }


        if(currentPage < Math.floor((records.length - 1) / ELEMENT_IN_PAGE)){ // controllo se posso andare avanti

            nextButton.disabled = false;

        } 

        if(currentPage > 0){ // controllo se posso andare indietro

            precButton.disabled = false;

        } 

        displayTable();

        
        
    }).catch(e=>{
        console.log(e);
    });

    playerTable.addEventListener('click', playAgainstRecord);

    document.querySelector('#soloMode button').addEventListener('click', playSolo);

    
};

function displayTable(){

    while(playerTable.firstChild){
        playerTable.firstChild.remove();
    }

    let remaining = Math.min(ELEMENT_IN_PAGE, (records.length - currentPage * ELEMENT_IN_PAGE));

    for(let i = 0; i < Math.min(remaining, ELEMENT_IN_PAGE); i++){
        
        let j = i + currentPage * ELEMENT_IN_PAGE;

        let tr = document.createElement('tr');
        tr.dataset.gameId = records[j].id;
        tr.title = "Sfida " + records[j].player_name;

        if(records[j].id === newestRecord.id){
            tr.classList.add("new");
        }

        let td = document.createElement('td');
        td.textContent = Number(j + 1);

        switch(j){
            case 0:
                td.id = 'first';
                break;
            case 1:
                td.id = 'second';
                break;
            case 2:
                td.id = 'therd';
                break;
        }

        tr.appendChild(td);
        
        td = document.createElement('td');
        td.textContent = records[j].player_name;
        tr.appendChild(td);

        td = document.createElement('td');

        td.textContent = TimeConverter.intToStr(records[j].time);
        tr.appendChild(td);

        td = document.createElement('td');
        td.textContent = records[j].timestamp;
        tr.appendChild(td);

        playerTable.appendChild(tr);
    }

    countDisplay.innerText = Number(currentPage * ELEMENT_IN_PAGE + 1) + ' - ' + Number(remaining + currentPage * ELEMENT_IN_PAGE)+ ' di ' + records.length;



}


function nextList(){
    currentPage++;

    if((currentPage + 1) * ELEMENT_IN_PAGE >= records.length){
        nextButton.disabled = true;
    }

    precButton.disabled = false;

    displayTable();
    

}

function precList(){

    currentPage--;

    if(currentPage == 0){
        precButton.disabled = true;
    }

    nextButton.disabled = false;

    displayTable();

}


function sortTime(a, b){
    if(Number(a.time) > Number(b.time)){
        return 1;
    }
    return -1;
}

function sortDate(a, b){

    let aDate = new Date(a.timestamp);
    let bDate = new Date(b.timestamp);

    if(aDate < bDate){
        return 1;
    }
    return -1;
}

function playSolo(){
    window.location.href = '../html/game.php?track=' + trackId +"&mode=0";
}

function playAgainstRecord(clickEvent){
    let gameId = clickEvent.target.parentElement.dataset.gameId;

    console.log(clickEvent.target.parentElement);
    window.location.href = '../html/game.php?mode=1&game='+ gameId;
}