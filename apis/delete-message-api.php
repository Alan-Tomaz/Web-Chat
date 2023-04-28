<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$deleteMessageStatus = 0;

$userId = filter_var($_POST["user-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$chatId = filter_var($_POST["chat-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$msgId = filter_var($_POST["msg-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;


if ($userId == null || $userId == "") {
    $deleteMessageStatus = 1;
}
if ($chatId == null || $chatId == "") {
    $deleteMessageStatus = 1;
}
if ($msgId == null || $msgId == "") {
    $deleteMessageStatus = 1;
}

if ($deleteMessageStatus == 0) {

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
                    if ($chatObj->messages[$msgId]->messageMedia != "") {
                        unlink("../admin/received-files/chat-media/" . $chatObj->messages[$msgId]->messageMedia);
                    }
                    array_splice($chatObj->messages, $msgId, 1);
                } else {
                    $deleteMessageStatus = 4;
                }
                file_put_contents($chatsPath . $chats[$chatId], json_encode($chatObj));
            }
        } else {
            $deleteMessageStatus = 3;
        }
    } else {
        $deleteMessageStatus = 2;
    }
}

$result = new stdClass();
$result->deleteMessageStatus = $deleteMessageStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
