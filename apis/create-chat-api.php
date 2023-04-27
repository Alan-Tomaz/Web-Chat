<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$chatName = filter_var($_POST["chat-name"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$chatDesc = filter_var($_POST["chat-description"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$chatImg = $_FILES["chat-img"];

$addChatStatus = 0;

if (isset($_SESSION["user-is-admin"])) {
    if ($chatName == "" || $chatDesc == "" || $chatImg == "") {
        $addChatStatus = 2;
    } else {

        $chatsDir = "../admin/chat-channels/";

        if (is_dir($chatsDir)) {

            $chatsArray = array_diff(scandir($chatsDir), array('.', '..'));
            /* Create a new array to reorganize indexes */
            $chats = array();
            $chats = array_values($chatsArray);

            $chatId = count($chats);


            $chat = str_replace(" ", "-", $chatName);

            $chatPath = $chatsDir . $chatId . "-" . $chat . ".json";



            if (file_exists($chatPath) == false) {


                //WORK ON NEW AVATAR
                //rename avatar
                $time = time(); //make each image name unique using current timestamp
                $chatImgName = $time . "-" . $chatImg["name"];
                $chatImgTmpName = $chatImg["tmp_name"];
                $chatImgDestinationPath =  "../admin/received-files/chat-img/" . $chatImgName;

                //make sure file is an image
                $allowedFiles = ["png", "jpg", "jpeg"];
                $extention = explode(".", $chatImgName);
                $extention = end($extention);

                if (in_array($extention, $allowedFiles)) {
                    //make sure image is not too large (1MB)
                    if ($chatImg["size"] < 2000000) {


                        move_uploaded_file($chatImgTmpName, $chatImgDestinationPath);

                        /* Set THe Default TimeZone */
                        date_default_timezone_set('America/Sao_Paulo');
                        $creationDate = date("d/m/Y");
                        /* Create the chat info Array */
                        $chatInfos = array();

                        /* Create the chat info content Object */
                        $chatInfo = new stdClass();
                        $chatInfo->chatId = $chatId;
                        $chatInfo->name = $chatName;
                        $chatInfo->description = $chatDesc;
                        $chatInfo->creationDate = $creationDate;
                        $chatInfo->img = $chatImgName;

                        array_push($chatInfos, $chatInfo);

                        //Create the file object
                        $chatRootObj = new stdClass();
                        $chatRootObj->chatInfo = $chatInfos;
                        $chatRootObj->messages = array();


                        //Create the chat file
                        $chatFile = fopen($chatPath, "w");
                        fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
                        fclose($chatFile);
                    } else {
                        $addChatStatus = 6;
                    }
                } else {
                    $addChatStatus = 5;
                }
            } else {
                $addChatStatus = 3;
            }
        } else {
            $addChatStatus = 4;
        }
    }
} else {
    $addChatStatus = 1;
}

//Pack the response into a object
$result = new stdClass();
$result->addChatStatus = $addChatStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
