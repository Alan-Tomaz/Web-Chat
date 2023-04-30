<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$editMessageStatus = 0;

$userId = filter_var($_POST["user-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$chatId = filter_var($_POST["chat-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$msgId = filter_var($_POST["msg-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$newMessage = $_POST["new-message"];


if ($userId == null || $userId == "") {
    $editMessageStatus = 1;
}
if ($chatId == null || $chatId == "") {
    $editMessageStatus = 1;
}
if ($msgId == null || $msgId == "") {
    $editMessageStatus = 1;
}
if ($newMessage == null || $newMessage == "") {
    $editMessageStatus = 1;
}

if ($editMessageStatus == 0) {

    if (isset($_SESSION["user-is-admin"]) || $_SESSION["user-id"] == $userId) {

        $chatsPath =   "../admin/chat-channels/";

        $chats = array();
        if (is_dir($chatsPath)) {
            $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
            /* Create a new array to reorganize indexes */

            $chats = array_values($chatsArray);

            sort($chats);
            $i = 0;
            $chatExtension = explode(".", $chats[$chatId]);
            if (end($chatExtension) == "json") {
                //Read The Chat File
                $chatObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                if ($chatObj->messages[$msgId]) {
                    if ($chatObj->messages[$msgId]->isDeleted == false) {
                        $chatObj->messages[$msgId]->message = $newMessage;
                    } else {
                        $editMessageStatus = 5;
                    }
                } else {
                    $editMessageStatus = 4;
                }



                file_put_contents($chatsPath . $chats[$chatId], json_encode($chatObj));
            }
        } else {
            $editMessageStatus = 3;
        }
    } else {
        $editMessageStatus = 2;
    }
}

$result = new stdClass();
if ($editMessageStatus == 0) {
    $result->newMessage = $newMessage;
}
$result->editMessageStatus = $editMessageStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
