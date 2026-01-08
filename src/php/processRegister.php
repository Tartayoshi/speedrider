<?php
    require "./utility/utility.php";

    if(isset($_POST['user']) && isset($_POST['pwd']) && isset($_POST['rpwd'])){ 

        if(!preg_match('/^\w{1,20}$/', $_POST['user'])){
            header("Location: ../html/register.php?error=wrongUser");
        }else if(!preg_match('/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}/', $_POST['pwd'])){
            header("Location: ../html/register.php?error=wrongPwd");
        } else if($_POST['pwd'] != $_POST['rpwd']){
            header("Location: ../html/register.php?error=pwd");
        }else{
            $db = new DataBase();

            if($db->addUser($_POST['user'], $_POST['pwd'])){
                session_start();
                $_SESSION['user'] = $_POST['user'];
                header('Location: ../html/home.php');
            }else{
                header("Location: ../html/register.php?error=user");
            }
        }

      

        
    }else{
        header("Location: ../html/register.php?error=noData");
    }

 
    

?>