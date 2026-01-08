<?php
    require "./utility/utility.php";

    try{

        $db = new DataBase();

        if(isset($_POST['player']) && isset($_POST['track']) && isset($_POST['time']) && isset($_POST['posData'])){
            $db->addRecord($_POST['player'], $_POST['track'], $_POST['time'], $_POST['posData']);
        }else{
            throw new Exception("Missing data, cannot upload to database");
        }

        $response = array(
            'ok' => true
        );

    }catch(Exception $e){
        $response = array(
            'ok' => false,
            'error' => $e->getMessage()
        );
    }finally{
        echo json_encode($response);
        $db->__destruct();
    }
?>