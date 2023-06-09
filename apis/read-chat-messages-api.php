<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

//Prepare the response
$readChatStatus = 0;

/* name of the required chat, if have */
$isSearching = false;
if (isset($_GET["chat-name"])) {
    $isSearching = true;
    $searchingName = filter_var($_GET["chat-name"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $searchingNamePattern = "/" . preg_quote($searchingName) . "/i";
}




//Pack the response into a object
$result = new stdClass();

//Build the path to the channels
$chatsPath =   "../admin/chat-channels/";

$chats = array();
if (is_dir($chatsPath)) {
    $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
    /* Create a new array to reorganize indexes */
    if ($isSearching == true) {
        /* $ocurrences = $array_keys($chatsArray, "/$searchingName(.*?)/"); */
        foreach ($chatsArray as $arr) {
            if (preg_match($searchingNamePattern, $arr) == 1) {
                $match = 1;
            } else {
                $match = 0;
            }
            if ($match == 1) {
                array_push($chats, $arr);
            }
        }
    } else {
        $chats = array_values($chatsArray);
    }
    if (count($chats) == 0) {
        $readChatStatus = 2;
    }
    if ($readChatStatus == 0) {
        sort($chats);
        $i = 0;
        foreach ($chats as $index => $chat) {
            $chatExtension = explode(".", $chat);
            if (end($chatExtension) == "json") {
                //Read The Chat File
                $chatObj = json_decode(file_get_contents($chatsPath . $chat), false);

                /* Chat Object */
                $chatObject = new stdClass();

                /* Chat Info Objects */
                $chatMessage = new stdClass();
                $chatInfo = new stdClass();


                /* Add The ChatInfo into Chat Object */
                $chatObject->chatInfo = $chatObj->chatInfo;
                $chatObject->chatMessage = $chatObj->messages;

                /* All Chats Object */
                $allChats = array();

                /* Add The Chats Into the All Chats Object */

                $result->allChats[$index] = $chatObject;
            }
        }
    }
} else {
    $readChatStatus = 1;
}


$result->readChatStatus = $readChatStatus;
/* Add All Chats into the Result Object */
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
