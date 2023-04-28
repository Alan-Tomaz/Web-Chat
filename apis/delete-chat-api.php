<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$deleteChatStatus = 0;
if (isset($_SESSION["user-is-admin"])) {

    $chatId = filter_var($_POST["chat-id"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    if ($chatId) {

        $chatsPath =   "../admin/chat-channels/";

        $chats = array();
        if (is_dir($chatsPath)) {
            $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
            /* Create a new array to reorganize indexes */

            $chats = array_values($chatsArray);

            sort($chats);

            $chatExtension = explode(".", $chats[$chatId]);
            if (end($chatExtension) == "json") {
                //Read The Chat File
                $chatObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                /* Delete Chat IMG */
                if ($chatObj->chatInfo[0]->img != "") {
                    unlink("../admin/received-files/chat-img/" . $chatObj->chatInfo[0]->img);
                }

                foreach ($chatObj->messages as $messages) {
                    if ($messages->messageMedia != "") {
                        unlink("../admin/received-files/chat-media/" . $messages->messageMedia);
                    }
                }
                unlink($chatsPath . $chats[$chatId]);
            }
        } else {
            $deleteChatStatus = 3;
        }
    } else {
        $deleteChatStatus = 2;
    }
} else {
    $deleteChatStatus = 1;
}


$result = new stdClass();
$result->deleteChatStatus = $deleteChatStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
