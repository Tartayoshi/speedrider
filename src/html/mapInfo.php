<!DOCTYPE html>
<html lang="it">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php
        require_once "../php/utility/utility.php";



        if(isset($_GET['track'])){
            $track = false;
            $error = null;
            $mapData;

            $db = new DataBase();

            try{
                global $mapData;
                $mapData = $db->getMap($_GET['track'])[0]; //[0] perchè loutput è un array bidimensionale, accedo al primo e unico record

                if($mapData == false){
                    header('Location: ./notfound.html');
                    exit;
                    
                }

                $track = $_GET['track'];
            
            }catch(Exception $e){

                $error = $e->getMessage();
                echo "<title>Errore del Database</title>";

            }

            echo "<title>$mapData[name] - dettagli tracciato</title>";
            
        }else{
            header('Location: ./notfound.html');
            exit;
        }

    ?>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/maps.css"/>
    <link rel="stylesheet" href="../css/mapInfo.css"/>
    <script type="module" src="../javascript/mapInfo.js"></script>

</head>
<body>
    <?php
        require_once "../php/navigation.php";
        
        getNav();


        if($track != false){

            if(isset($_GET['showLatest']) && $_GET['showLatest'] == 1){

                echo "<section class=\"grid\" data-track=$track data-show-latest=1>";
    
            }else{
    
                echo "<section class=\"grid\" data-track=$track data-show-latest=0>";
            }

            

        }else{

            echo "<section class=\"grid\" data-track=0 data-show-latest=0>"; //segnalo l'errore a javscript

        }


        
    ?>

    <?php
        if($track != false){
            echo "<h2 id=title>$mapData[name]</h2>";
        }else{
            echo "<h2 id=title>ERRORE!</h2>";
        }
    ?>

    <aside>
        <figure>
            <?php
                if($track != false){
                    echo '<img src="../game/assets/maps/'.$track.'/'.$track.'_map.png">';
                    echo '<figcaption>Mappa del circuito '.$mapData["name"].'</figcaption>';
                }else{
                    echo '<img src="../images/missingpicture.png">';
                    echo '<figcaption>Figura mancante</figcaption>';
                }

            ?>
        </figure>
        <div id="difficulty">
            <h3>Difficoltà</h3>
            <?php
            if($track != false){
                $difficulty = "NA";
                switch ($mapData["difficulty"]){
                    case '0':
                        $difficulty = "Facile";
                        break;
                    case '1':
                        $difficulty = "Media";
                        break;
                    case '2':
                        $difficulty = "Difficile";
                }

                echo "<p>$difficulty</p>";
            }else{
                echo "<p>.</p>";
            }
            ?>
        </div>

        <div id="soloMode" title="Gioca senza fantasmi">
            <p>Prova a tempo</p>
            <button>Gioca</button>
        </div>
    </aside>

    <?php
        if($track != false){
            //echo '<p>'.var_dump($mapData).'</p>'; //DEBUG
            readfile("../game/assets/maps/$track/$track"."_description.html"); //carico l'articolo relativo alla pagina
        }else{
            echo '<article><p>Messaggio di errore:<br>'.$error.'</p></article>';
        }
    ?>
    <div id="players">
        <table>
            <caption>Migliori giocatori su questa mappa</caption>
            <thead>
                <tr>
                    <th>Posizione</th>
                    <th>Giocatore</th>
                    <th>Tempo</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
        <div id="tnav">
            <p id="tcurrent">0-0/0</p>
            <span id="tbuttons">
                <button id="tprec" title="Pagina precedente"> &lt&lt </button><!--Validatore segnala errore nonostante sia stato utilizzato il carattere di escape-->
                <button id="tnext" title="Pagina succesiva"> &gt&gt </button>
            </span>
        </div>
    </div>

        
    </section>

    
</body>
</html>