<!DOCTYPE html>
<html lang="it">
<head>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elenco percorsi</title>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/maps.css"/>
    <script type="module" src="../javascript/maps.js"></script>
</head>
<body>
    <?php
        require_once "../php/navigation.php";
        
        getNav();

    ?>

    <section>
        <h2>Elenco tracciati</h2>
        <table id="maps">
            <thead>
                <tr>
                    <!--<th>Immagine</th>-->
                    <th>Nome percorso</th>
                    <th>Difficoltà</th>
                    <th colspan="2">Record</th>
                </tr>
                <tr>
                    <!--<th>Immagine</th>-->
                    <th></th>
                    <th></th>
                    <th>Giocatore</th>
                    <th>Tempo</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    require_once "../php/utility/utility.php";

                    try{
                        $db = new DataBase();

                        $maps = $db->getMap();

                        foreach($maps as $map){
       
                            echo "<tr class=\"preview\" id=\"$map[id]\" title=\"Dettagli $map[name]\" style=\"background-image:url('../game/assets/maps/$map[id]/$map[id]_preview.png')\">";
                            echo "<td>$map[name]</td>";
                            echo "<td></td><td>Caricamento...</td><td></td>";
                            echo "</tr>";

                        }
                    }catch(Exception $e){
                        echo "<p>Errore".$e->getMessage()."</p>";
                    }
                ?>

            </tbody>
        </table>
    </section>

    
</body>
</html>