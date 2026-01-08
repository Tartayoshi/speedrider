<?php
    require "./utility/utility.php";


    if(isset($_POST['user']) && isset($_POST['pwd'])){ 

        $db = new DataBase();

        if($db->checkPassword($_POST['user'], $_POST['pwd'])){
            session_start();
            $_SESSION['user'] = $_POST['user'];

            if(isset($_SESSION['loginOrigin'])){ //Torno alla pagina da cui ho premuto il tasto login
                $redirectURI = $_SESSION['loginOrigin'];
                unset($_SESSION['loginOrigin']); //faccio flush della variabile, dato che dopo il login non viene più aggiornata
                header('Location: http://'.$_SERVER['HTTP_HOST'].$redirectURI);
            }else{
                header('Location: ../html/home.php');
            }

        }else{
            
            header("Location: ../html/login.php?user=$_POST[user]&accessDenied=1");
        }
        
    }else{
        header('Location: ../html/login.php?accessDenied=1');
    }

 
    

?>