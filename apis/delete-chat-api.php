<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$deleteChatStatus = 0;
if (isset($_SESSION["user-is-admin"])) {

    $chatId = filter_var($_POST["chat-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;

    if ($chatId != "" && $chatId != null) {

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
            $newChatsArray = array_diff(scandir($chatsPath), array('.', '..'));
            /* Create a new array to reorganize indexes */

            $newChats = array_values($newChatsArray);
            sort($newChats);

            /* RENAME OTHERS CHATS */
            if (count($newChats) > 0) {
                $n = 0;
                foreach ($newChats as $index => $otherChat) {
                    $otherChatExtension = explode("-", $otherChat, 2);
                    $chatObject = json_decode(file_get_contents($chatsPath . $otherChat), false);
                    $chatObject->chatInfo[0]->chatId = $n;
                    file_put_contents($chatsPath . $otherChat, json_encode($chatObject));

                    rename($chatsPath . $otherChat, $chatsPath . $n . "-" . $otherChatExtension[1]);

                    $n++;
                }
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
