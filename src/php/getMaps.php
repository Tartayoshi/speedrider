<?php
    require "./utility/utility.php";

    try{

        $db = new DataBase();

        if(isset($_GET['track'])){ //ritorno solo la mappa che mi interessa
            $maps = $db->getMap($_GET['track']);
        }else{ //se non specifico la mappa ricevo tutto
            $maps = $db->getMap();
        }

        if($maps == false){
            throw new Exception("Maps Not Found");
        }


        $response = array(
            'ok' => true,
            'maps' => $maps
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