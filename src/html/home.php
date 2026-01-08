<!DOCTYPE html>
<html lang="it">
<head>

    <?php
        header('Cache-Control: no-cache');
        header('Pragma: no-cache');
    ?>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Rider</title>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/home.css"/>
    <link rel="stylesheet" href="../css/maps.css"/>
    
    <link rel="shortcut icon" type="image/ico" href="../favicon.ico">
    <script type="module" src="../javascript/home.js"></script>
    
</head>
<body>
    <?php
        require_once "../php/navigation.php";
        
        getNav();

    ?>

    <section id="menu">

        <h2>Circuiti più popolari</h2>

        <?php
            require_once "../php/utility/utility.php";

            $error = false;


            try{

                $db = new DataBase();

                $mapPopularity = $db->getMapPopularity();
                //DEBUG
                //echo "<p>".count($mapPopularity)."</p>";

                if(count($mapPopularity) == 0){

                    $mapList = $db->getMap();


                    $popular1 = array(
                        "map_id" => $mapList[0]["id"],
                        "name" => $mapList[0]["name"],
                        "count" => 0
                    );

                    //DEBUG
                    //echo var_dump($popular1);

                    $popular2 = array(
                        "map_id" => $mapList[1]["id"],
                        "name" => $mapList[1]["name"],
                        "count" => 0
                    );

                }else if(count($mapPopularity) == 1){

                    $mapList = $db->getMap();
                    $popular1 = $mapPopularity[0];

                    $i = 0;

                    while($mapList[$i]["id"] == $popular1["map_id"]){
                        $i++;
                    }

                    $popular2 = array(
                        "map_id" => $mapList[$i]["id"],
                        "name" => $mapList[$i]["name"],
                        "count" => 0
                    );


                }else{

                    $popular1 = $mapPopularity[0];
                    $popular2 = $mapPopularity[1];
                }

            }catch(Exception $e){
                $error = true;
                echo "<p>Errore:".$e->getMessage()."</p>";
            }

        ?>

        
        <?php
            
            if($error == false){

                echo "<button type=\"button\" id=\"popular1\" class=\"preview\" onclick=\"location.href='./mapinfo.php?track=$popular1[map_id]';\" style=\"background-image : url('../game/assets/maps/$popular1[map_id]/$popular1[map_id]_preview.png');\" >";
       
                echo "<span class='track'>$popular1[name]</span>";
                echo "<span class='count'>Contiene $popular1[count] fantasmi</span>";


            }else{
                echo "<button title='errore' type=\"button\" id=\"popular1\"></button>";
            }
        ?>
        

        </button>

        <?php
            
            if($error == false){

                
                echo "<button type=\"button\" id=\"popular2\" class=\"preview\" onclick=\"location.href='./mapinfo.php?track=$popular2[map_id]';\" style=\"background-image : url('../game/assets/maps/$popular2[map_id]/$popular2[map_id]_preview.png');\" >";
     
                echo "<span class='track'>$popular2[name]</span>";
                echo "<span class='count'>Contiene $popular2[count] fantasmi</span>";
         
            }else{
                echo "<button title='errore' type=\"button\" id=\"popular2\"></button>";
            }
        ?>

        </button>
        <table>
            <caption>Ultime partite</caption>
            <thead>
                <tr>
                    <th>Data e ora</th>
                    <th>Giocatore</th>
                    <th>Percosro</th>
                    <th>Tempo</th>
                </tr>
            </thead>
            <tbody id="latestGames">

            </tbody>
        </table>
    </section>

    
</body>
</html>