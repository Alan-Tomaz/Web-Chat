<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$deleteUserStatus = 0;
if (isset($_SESSION["user-is-admin"])) {

    $userId = filter_var($_POST["user-id"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    if ($userId) {
        $chatsPath =   "../admin/chat-channels/";

        $chats = array();
        if (is_dir($chatsPath)) {
            $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
            /* Create a new array to reorganize indexes */

            $chats = array_values($chatsArray);

            sort($chats);
            $i = 0;
            foreach ($chats as $index => $chat) {
                $chatExtension = explode(".", $chat);
                if (end($chatExtension) == "json") {
                    //Read The Chat File
                    $chatObj = json_decode(file_get_contents($chatsPath . $chat), false);

                    foreach ($chatObj->messages as $index2 => $messages) {
                        if ($messages->userId == $userId) {
                            unset($chatObj->messages[$index2]);
                        }
                    }


                    file_put_contents($chatsPath . $chat, json_encode($chatObj));
                }
            }
            $mysqlQuery = "DELETE FROM users WHERE user_id = $userId";
            $mysqlResult = mysqli_query($connection, $mysqlQuery);
        } else {
            $deleteUserStatus = 3;
        }
    } else {
        $deleteUserStatus = 2;
    }
} else {
    $deleteUserStatus = 1;
}


$result = new stdClass();
$result->deleteUserStatus = $deleteUserStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
