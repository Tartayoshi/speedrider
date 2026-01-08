<?php
    function getNav($saveURI = true){
        echo "<h1>Speed Rider</h1><nav><ul>";
        echo "<li><a href=\"home.php\">Home</a></li>";
        echo "<li><a href=\"../html/maps.php\">Tracciati</a></li>";
        echo "<li><a href=\"../html/manual.html\">Istruzioni</a></li>";
        echo "<li id=\"profile\">";

        //Chiamata a session start
        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        
        if(isset($_SESSION['user'])){
            $user = $_SESSION['user'];

            echo "<p>$user</p>";
            echo "<a href=\"logout.php\">Logout</a>";

        }else{
            //session_start();
            echo "<a href=\"login.php\">Login</a>";
            if($saveURI == true){
                $_SESSION['loginOrigin'] = $_SERVER['REQUEST_URI'];
            }
        }

        echo "</li>";
        echo "</ul></nav>";
    }
?>