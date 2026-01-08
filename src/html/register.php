<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrati</title>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/login.css"/>
    <link rel="stylesheet" href="../css/register.css"/>
    <script src="../javascript/register.js"></script>
</head>
<body>
    <?php
        require_once "../php/navigation.php";
        
        session_start();
        if(isset($_SESSION['user'])){
            header('Location: ./alreadyLoggedIn.php');
        }

        getNav(false);

    ?>
    <form method="POST" action="../php/processRegister.php">
        <fieldset>
            <legend>Registrati</legend>
            <label for="f-username">Nome utente</label>
            <input type="text" id="f-username" name="user" placeholder="username" pattern="^\w{1,20}$" required>
            <p>Massimo 20 caratteri, solo caratteri e numeri</p>
            <label for="f-password">Password</label>
            <input type="password" id="f-password" name="pwd" placeholder="••••••••" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" required>
            <p>
                <ul>
                    <li id='v-dimension'>Almeno 8 caratteri</li>
                    <li id='v-downcase'>Almeno una lettera minuscola</li>
                    <li id='v-uppercase'>Almeno una lettera Maiuscoloa</li>
                    <li id='v-number'>Almeno un numero</li>
                </ul>
            </p>
            <label for="f-rpassword">Ripeti Password</label>
            <input type="password" id="f-rpassword" name="rpwd" placeholder="••••••••" pattern="^.{8,16}$" required>
            <p id='v-matchpwd' hidden=> Le password non corrispondono! </p>
            <input type="submit" value="Conferma">
        </fieldset>
        <?php
            if(isset($_GET['error'])){
                if($_GET['error']== "user"){
                    echo '<p class="error">Utente già registrato</p>';
                }else if($_GET['error'] == "pwd"){
                    echo '<p class="error">Le password non corrispondono</p>';
                }else if($_GET['error'] == "dbError"){
                    echo '<p class="error">Errore del database, ci scusiamo per il disagio</p>';
                }else{
                    echo '<p class="error">Inserire username e password come richiesto!</p>';
                }
            }

        ?>
        <p>Hai già un account?</p>
        <button onclick="location.href='login.php'" type="button">Login</button>
    </form>
</body>
</html>