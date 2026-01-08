<?php
    require "./utility/utility.php";

    try{

        $db = new DataBase();

        if(isset($_GET['game'])){
            $queryResult = $db->getGhost($_GET['game']);
            if($queryResult == false){
                throw new Exception("No record present in database");
            }

        }else{
            throw new Exception("Missing Data");
        }
        
        $response = array(
            'ok' => true,
            //'player' => $queryResult['player_name'],
            'posData' => $queryResult['ghost_data']
            
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