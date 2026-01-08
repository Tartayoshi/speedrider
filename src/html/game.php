<!DOCTYPE html>
<html lang="it">
<head>
    <?php
        header('Cache-Control: no-cache');
        header('Pragma: no-cache');
    ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Rider - In game</title>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/game.css"/>
    <script type="module" src="../game/assets/scripts/game.js"></script>
</head>
<body>
    <?php
        require_once "../php/navigation.php";
        require_once "../php/utility/utility.php";
        
        getNav();

        echo '<section>';
        echo "<h2>In Gioco!</h2>";
        echo '<h3 class="destroyOnLoad" >Caricamento...</h3>';

        if(isset($_SESSION['user'])){

            $db = new DataBase();
            //mode 0: singleplayer, mode 1: playAgainstGhost

            if(isset($_GET['mode'])){

                $mode = $_GET['mode'];
                $player = $_SESSION['user'];

                if($mode == 0){

                    if(isset($_GET['track']) && $db->existsMap($_GET['track'])){
                        $track = $_GET['track'];

                        echo  "<canvas id=\"game\" data-mode=0 data-track=$track data-player=$player >Canvas non disponibile per il tuo browser</canvas>";

                    }else{
                        error("Tracciato inesistente: il parametro 'track' è vuoto o non ha corrispondenza nel database");
                    }

                }else if($mode == 1){
                    if(isset($_GET['game']) && $db->existsGame($_GET['game'])){
                        $game = $_GET['game'];
                        echo  "<canvas id=\"game\" data-mode=1 data-player=$player data-game=$game>Canvas non disponibile per il tuo browser</canvas>";
                    }else{
                        error("Partita inesistente: il parametro 'game' è vuoto o ha un parametro non corrispondente ad un record nel database");
                    }


                }else{
                    error("Modalità di gioco inesistente: il parametro 'mode' non corrisponde ad una modalità esistente oppure è vuoto");
                }
                


            }
        }

            
        else{
            echo '<div id="message"><h3> Per gareggiare è necessario un account, accedi poi torna a questa pagina</h3>';
            echo '<button onclick="location.href=\'login.php\'" type="button">Accedi</button></div>';
        }

        function error($msg){
            echo "<h2>Qualcosa è andato storto:<br>$msg<br>torna indietro e riprova<br>:C</h2>";
            echo  "<canvas id=\"game\" data-mode=-1>Canvas non disponibile per il tuo browser</canvas>";
        }

    ?>
        
        <div hidden id="congrats">
            <h2>Oh no!</h2>
            <p id="msg">Qualcosa è andato storto...</p>
            <p id="gameStat">Statistiche</p>
            <p id="time">Tempo</p>
            <h3 id="saving">Vuoi salvare il tuo tempo e rendere pubblica la tua partita?</h3>
            <span class="inline">
                <button type="button" id="save">Salva</button>
                <button type="button" id="cancel">Elimina</button>
            </span>
        </div>
        <button hidden type="button" id="fullscreenButton">Schermo intero</button>
    </section>

    
</body>
</html>