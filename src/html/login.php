<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>

    <link rel="stylesheet" href="../css/default.css"/>
    <link rel="stylesheet" href="../css/login.css"/>
    <!--<script src="../javascript/login.js"></script>-->
</head>
<body>
    <!--<h1>Speed Rider</h1>-->
    <?php
        require_once "../php/navigation.php";
        
        getNav(false);

        if(isset($_SESSION['user'])){
            header('Location: ./alreadyLoggedIn.php');
        }

    ?>

    <form method="POST" action="../php/processLogin.php">
        <fieldset>
            <legend>Login</legend>
            <label for="f-username">Nome utente</label>
            <?php
                if(isset($_GET['user'])){
                    echo "<input type=\"text\" id=\"f-username\" name=\"user\" placeholder=\"username\" value=$_GET[user] required>";
                }else{
                    echo '<input type="text" id="f-username" name="user" placeholder="username" required>';
                }
            ?>
            <label for="f-password">Password</label>
            <input type="password" id="f-password" name="pwd" placeholder="••••••••" required>
            <input type="submit" value="Login">
        </fieldset>
        
        <?php
            if(isset($_GET['accessDenied'])){
                echo '<p class="error">Nome utente o password errata</p>';
            }

        ?>
        <p>Non sei registrato?</p>
        <button onclick="location.href='register.php'" type="button">Registrati</button>
    </form>
</body>
</html>