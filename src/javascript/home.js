import { TimeConverter } from "../game/assets/scripts/timeConverter.js";

let records;
let table;


window.addEventListener("DOMContentLoaded", init);

function init(){

    table = document.querySelector("#latestGames");

    fetch("../php/getRecords.php?newest=0").then(res => res.json()).then(data=>{
        console.log(data);

        if(!data.ok){
            throw data.error;
        }

        records = data.records;
        //console.log(records);

        for(let i = 0; i < records.length; i++){

            let tr = document.createElement('tr');
            tr.gameId = records[i].id;
        
            tr.title = "Sfida " + records[i].player_name;

            if(i == 0){
                tr.classList.add("new");
            }

            let td = document.createElement('td');

            td.textContent = records[i].timestamp;
            tr.appendChild(td);
            
            td = document.createElement('td');
            td.textContent = records[i].player_name;
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = records[i].map_name;
            tr.appendChild(td);


            td = document.createElement('td');
            td.textContent = TimeConverter.intToStr(records[i].time);

            tr.appendChild(td);

            

            table.appendChild(tr);

        }

        
    }).catch(e=>{
        console.log(e);
    });

    table.addEventListener('click', playAgainstRecord);


};


function playAgainstRecord(clickEvent){
    let gameId = clickEvent.target.parentElement.gameId;

    //console.log(clickEvent.target.parentElement.gameId);
    window.location.href = '../html/game.php?mode=1&game=' + gameId;
}