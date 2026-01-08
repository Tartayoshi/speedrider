<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/logout.css"/>
</head>
<body>
    <?php
        require_once "../php/navigation.php";
        $notLogged = false;

        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }

        if(isset($_SESSION["user"])){ //se l'utente ha eseguito l'accesso lo disconnetto, altrimento setto notLogged
            session_destroy();
        }else{
            $notLogged = true;
            
        }

        getNav(false);

    ?>

    <section>
        <h2>Logout</h2>
        <?php
            if($notLogged){
                echo "<p>Sei già disconnesso.</p>";
            }else{
                echo "<p>Disconnessione avvenuta con successo!</p>";
            }
        ?>
    </section>

</body>
</html>