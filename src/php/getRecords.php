<?php
    require "./utility/utility.php";

    try{

        $db = new DataBase();

        if(isset($_GET['track'])){
            $queryResult = $db->getRecordsFromMap($_GET['track']);
            if($queryResult == false){
                throw new Exception("No records present in database");
            }

        }
        else if(isset($_GET['gameId'])){
            $queryResult = $db->getRecord($_GET['gameId']);
            if($queryResult == false){
                throw new Exception("No records present in database");
            }
        }else if(isset($_GET['newest'])){

            if($_GET['newest'] == 0){
                $queryResult = $db->getRecords();
            }else{
                $queryResult = $db->getRecords($_GET['newest']);
            }

            if($queryResult == false){
                throw new Exception("No records present in database");
            }
        }else{
            throw new Exception("Missing Data");
        }
        
        $response = array(
            'ok' => true,
            'records' => $queryResult
            
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