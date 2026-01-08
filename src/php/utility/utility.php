<?php
    require "../php/settings/config.php";

    class DataBase{
        private $pdo;
        private $dbhost;
        private $dbname;
        private $dbuser;
        private $dbpass;

        public function __construct()
        {
            $this->dbhost = DBHOST;
            $this->dbname = DBNAME;
            $this->dbuser = DBUSER;
            $this->dbpass = DBPASS;

        }

        private function connect(){
            try{
                $this->pdo = new PDO("mysql:host=$this->dbhost;dbname=$this->dbname", $this->dbuser, $this->dbpass);
            }
            catch(PDOException  $e){

                try {
                    $this->pdo = new PDO("mysql:host=$this->dbhost" , $this->dbuser, $this->dbpass);
                    $this->pdo->exec("DROP DATABASE IF EXISTS `$this->dbname`;
                                     CREATE DATABASE `$this->dbname`;
                                     USE `$this->dbname`;
                                     
                                     DROP TABLE IF EXISTS `maps`;
                                     CREATE TABLE `maps` (
                                    `id` varchar(20) NOT NULL,
                                    `name` varchar(20) NOT NULL,
                                    `difficulty` int(11) NOT NULL,
                                    PRIMARY KEY (`id`)
                                    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                                    LOCK TABLES `maps` WRITE;
                                    INSERT INTO `maps` VALUES ('autodromo_modena','Modena',2),('circuit_1','Kartodromo',1),('dounat','Fattoria ciambella',0);
                                    UNLOCK TABLES;

                                     DROP TABLE IF EXISTS `records`;
                                     CREATE TABLE `records` (
                                     `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    `id` int(11) NOT NULL AUTO_INCREMENT,
                                    `player_name` varchar(20) NOT NULL,
                                    `map_id` varchar(20) DEFAULT NULL,
                                    `time` int(11) NOT NULL,
                                    `ghost_data` json NOT NULL,
                                    PRIMARY KEY (`id`)
                                    ) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=latin1;
                                    
                                    DROP TABLE IF EXISTS `users`;
                                    CREATE TABLE `users` (
                                    `username` varchar(20) NOT NULL,
                                    `password` varchar(60) NOT NULL,
                                    PRIMARY KEY (`username`)
                                    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                                    ");
                    
                    
                } catch (PDOException $e) {
                    header("HTTP/1.1 404 Not Found");
                    header("Location: ".NOTFOUND);
                }
                
            };
        }

        public function checkPassword($user, $password){
            $this->connect();
            $sql = "SELECT username, password
                    FROM users
                    WHERE username = ?";
            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $user);
            $statement->execute();

            $result = $statement->fetch();

            if($result){
                return password_verify($password, $result['password']);
            }

            return false;
        }
        
        public function addUser($user, $password){
            $this->connect();
            $sql = "SELECT username
                    FROM users
                    WHERE username = ?";
            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $user);
            $statement->execute();

            $result = $statement->fetch();

            if($result){ //L'utente esiste già
                return false;
            }

            $ashedPWD = password_hash($password, PASSWORD_BCRYPT);

            if(!$ashedPWD){
                return false;
            }

            $sql = "INSERT INTO users VALUES(?, ?)";
            $insert = $this->pdo->prepare($sql);
            $insert->bindValue(1, $user);
            $insert->bindValue(2, $ashedPWD);
            $insert->execute();

            return true;


        }

        public function getMap($id = false) {

            $this->connect();

            if($id){
                $sql = "SELECT *
                        FROM maps m LEFT OUTER JOIN(
                            SELECT a.map_id, a.time, a.player_name, a.id as game_id, a.timestamp
                            FROM records a LEFT OUTER JOIN (
                                SELECT MIN(time) AS time, map_id
                                FROM records
                                group by map_id
                            ) b ON a.map_id = b.map_id
                            WHERE a.time = b.time
                            ) r ON m.id = r.map_id
                        WHERE m.id = ?";
                $statement = $this->pdo->prepare($sql);
                $statement->bindValue(1, $id);
            }else{
                $sql = "SELECT *
                        FROM maps m LEFT OUTER JOIN(
                            SELECT a.map_id, a.time, a.player_name, a.id as game_id, a.timestamp
                            FROM records a LEFT OUTER JOIN (
                                SELECT MIN(time) AS time, map_id
                                FROM records
                                group by map_id
                            ) b ON a.map_id = b.map_id
                            WHERE a.time = b.time
                            ) r ON m.id = r.map_id
                            ORDER BY m.difficulty";
                $statement = $this->pdo->prepare($sql);
            }

            $result = $statement->execute();

            if($result){
                
                return $statement->fetchAll();
            }
            return false;            

        }



        public function existsMap($string){
            $this->connect();
            $sql = "SELECT id
                    FROM maps
                    WHERE id = ?";
            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $string);
            $result = $statement->execute();

            if($result){
                if($statement->fetch()){
                    return true;
                }
                return false;
            }

            return false;

        }

        public function existsGame($string){
            $this->connect();
            $sql = "SELECT id
                    FROM records
                    WHERE id = ?";
            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $string);
            $result = $statement->execute();

            if($result){
                if($statement->fetch()){
                    return true;
                }
                return false;
            }

            return false;

        }

        public function getGhost($id) {

            $this->connect();

         
            $sql = "SELECT ghost_data
                    FROM records
                    WHERE id = ?";

            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $id);
            $result = $statement->execute();

            if($result){
                
                return $statement->fetch();
            }
            return false;            

        }

        public function addRecord($user, $map, $time, $ghost_data){
            $this->connect();
            
            $sql = "INSERT INTO records VALUES(NULL, NULL, :player, :map, :time, :ghost)"; //id, timestamp, player, map_id, time, ghost_data
            $insert = $this->pdo->prepare($sql);
            $insert->bindValue(':player', $user);
            $insert->bindValue(':map', $map);
            $insert->bindValue(':time', $time);
            $insert->bindValue(':ghost', $ghost_data);
            $insert->execute();

            return true;


        }

        public function getRecordsFromMap($map_id){
            $this->connect();

         
            $sql = "SELECT timestamp, id, player_name, time
                    FROM records
                    WHERE map_id = ?";

            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $map_id);
            $result = $statement->execute();

            if($result){
                
                return $statement->fetchAll();
            }
            return false;            

        }

        public function getRecord($id){
            $this->connect();

         
            $sql = "SELECT timestamp, player_name, map_id, time
                    FROM records
                    WHERE id = ?";

            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(1, $id);
            $result = $statement->execute();

            if($result){
                
                return $statement->fetch();
            }
            return false;            

        }

        public function getRecords($limit = 5){
            $this->connect();

         
            $sql = "SELECT r.id, r.timestamp, r.player_name, r.time, m.name as map_name
                    FROM records r LEFT OUTER JOIN maps m ON r.map_id = m.id
                    ORDER BY timestamp DESC
                    LIMIT :limit";

            $statement = $this->pdo->prepare($sql);
            $statement->bindValue(':limit', intval($limit),PDO::PARAM_INT);
            $result = $statement->execute();

            if($result){
                
                return $statement->fetchAll();
            }
            return false;            

        }

        public function getMapPopularity(){

            $this->connect();

         
            $sql = "SELECT r.map_id, m.name, count(*) as count
                    FROM records r LEFT OUTER JOIN maps m ON r.map_id = m.id
                    GROUP BY map_id, name
                    ORDER BY count(*) DESC";

            $statement = $this->pdo->prepare($sql);
            $result = $statement->execute();

            if($result){
                
                return $statement->fetchAll();
            }
            return false;   

        }



        public function __destruct()
        {
            $this->pdo = null;
        }
    }

?>