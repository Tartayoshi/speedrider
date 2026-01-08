<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accesso già eseguito</title>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/alreadyLoggedIn.css"/>
    <!--############### Pagina accessibile solo dai preferiti o tornando indietro dopo il login ######################-->
</head>
<body>
    <!--<h1>Speed Rider</h1>-->
    <?php
        require_once "../php/navigation.php";
        getNav(false);


    ?>

    <section>
        <h2>Aspetta! hai già fatto l'accesso</h2>
        <?php
            if(isset($_SESSION['user'])){
                echo "<p>$_SESSION[user] vuoi davvero uscire?</p>";
            }else{
                header('Location: ./notfound.html');
            }
        ?>
        <p>Premendo "si" dovrai reinserire nuovamente le tue credenziali per accedere</p>
        <div class="choice">
            <button onclick="location.href='logout.php'" type="button">Si</button>
            <button onclick="location.href='home.php'" type="button">No, fammi restare</button>
        </div>
    </section>
</body>
</html>