import { Track } from "../game/assets/scripts/track.js";
import { TimeConverter } from "../game/assets/scripts/timeConverter.js";

let table;

window.addEventListener("DOMContentLoaded", init);

function init(){
    table = document.querySelector("#maps tbody");
    fetch("../php/getMaps.php").then(res => res.json()).then(data=>{

        console.log(data);

        if(data.ok == false){
            throw data.error;
        }

        //console.log(data);

        let precId = "";

        for(let i = 0; i < data.maps.length; i++){

            let tr = document.querySelector("#" + data.maps[i].id);
            tr.lastChild.remove();//rimozionde dei place holders
            tr.lastChild.remove();
            tr.lastChild.remove();
            let td = document.createElement('td');

            if(precId == data.maps[i].id){ //Caso più giocatori con stesso tempo, RARISSIMO!
                let newRow = document.createElement('tr');
                tr.after(newRow);
                tr = newRow;
                let td = document.createElement('td');
                
                td.textContent = "    ╘══════════════";
                newRow.appendChild(td);

                td = document.createElement('td')
                newRow.appendChild(td);
            }else{

                td.textContent = Track.getDifficulty(Number(data.maps[i].difficulty));
                tr.appendChild(td);
            }

            
            

            td = document.createElement('td');
            td.textContent = data.maps[i].player_name;
            tr.appendChild(td);

            td = document.createElement('td');

            td.textContent = TimeConverter.intToStr(data.maps[i].time);
            tr.appendChild(td);

            table.appendChild(tr);
            precId = data.maps[i].id;
        }
    }
    ).catch(e=>{
        console.log(e);
    });

    table.addEventListener("click", visitMap);

};

function visitMap(clickEvent){
    let map = clickEvent.target.parentElement.id;
    //console.log(clickEvent.target.parentElement.id);
    window.location.href = '../html/mapInfo.php?track=' + map;

}
