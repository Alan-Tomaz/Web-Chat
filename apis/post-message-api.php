<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";


if (isset($_SESSION["user-id"])) {
    //Get message data

    $result = new stdClass();

    $chatIndex = filter_var($_POST["chat"], FILTER_SANITIZE_NUMBER_INT);
    $userId = filter_var($_POST["userId"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
    $message = $_POST["message"];

    //Prepare the response
    $postMessageStatus = 0;

    //Build the path to the chat channel
    $chatsPath =   "../admin/chat-channels/";

    $chats = array();
    if (is_dir($chatsPath)) {
        $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
        /* Create a new array to reorganize indexes */
        $chats = array_values($chatsArray);
        sort($chats);
        $i = 0;
    } else {
        $postMessageStatus = 1;
    }

    if ($postMessageStatus == 0) {


        //If the channel file exists, add the message to the file
        //Read the chat file
        $chatRootObj = json_decode(file_get_contents($chatsPath . $chats[$chatIndex]), false);


        /* Search the User Info in the DB */

        $userQuery = "SELECT * FROM users WHERE user_id = $userId";
        $userResult = mysqli_query($connection, $userQuery);
        if (mysqli_num_rows($userResult) == 1) {
            $user = mysqli_fetch_assoc($userResult);

            //Add the message to the array of messages and save the file
            $chatMessage = new stdClass();
            if (count($chatRootObj->messages) != 0) {
                $lastIndex = end($chatRootObj->messages);
                $chatMessage->msgId =  ($lastIndex->msgId) + 1;
            } else {
                $chatMessage->msgId =  0;
            }
            $chatMessage->userId = $userId;
            $chatMessage->nickname = $user["name"];
            $chatMessage->message = $message;
            $chatMessage->messageMedia = "";
            if ($user["avatar"] == "") {
                $chatMessage->img = "";
            } else {
                $chatMessage->img = $user["avatar"];
            }
            $chatMessage->isDeleted = false;


            $messageIndex = count($chatRootObj->messages);
            array_push($chatRootObj->messages, $chatMessage);

            //If the messages array, have more than 100 messages, delete the more old message
            if (count($chatRootObj->messages) >= 100) {
                if ($chatRootObj->messages[99]->messageMedia != "") {
                    unlink("../admin/received-files/chat-media/" . $chatObj->messages[99]->messageMedia);
                }
                array_shift($chatRootObj->messages);
            }

            $result->allMessages = $chatRootObj->messages;

            //Write the modified file
            $chatFile = fopen($chatsPath . $chats[$chatIndex], "w");
            fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
            fclose($chatFile);

            /* CHANGE LAST ACTIVITY */
            date_default_timezone_set('America/Sao_Paulo');

            $newLastActivity = date("Y-m-d H:i:s");

            $newLastActivityQuery = "UPDATE users SET last_activity = '$newLastActivity' WHERE user_id = '$userId' LIMIT 1";
            $newLastActivityResult = mysqli_query($connection, $newLastActivityQuery);
        } else {
            $postMessageStatus = 2;
        }
    }
} else {
    $postMessageStatus = 3;
}
//Pack the response into a object

if (isset($user["avatar"])) {
    if ($user["avatar"] == "") {
        $result->avatar = "img/403024_avatar_boy_male_user_young_icon.png";
    } else {
        $result->avatar = "admin/received-files/avatars/" . $user["avatar"];
    }
}
if (isset($messageIndex)) {
    $result->messageIndex = $messageIndex;
}
$result->postMessageStatus = $postMessageStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
