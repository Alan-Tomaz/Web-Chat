<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

//Get message data
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
        $chatMessage->userId = $userId;
        $chatMessage->nickname = $user["name"];
        $chatMessage->message = $message;


        if ($user["avatar"] == "") {
            $chatMessage->img = "";
        } else {
            $chatMessage->img = $user["avatar"];
        }

        $messageIndex = count($chatRootObj->messages);
        array_push($chatRootObj->messages, $chatMessage);

        //If the messages array, have more than 100 messages, delete the more old message
        if (count($chatRootObj->messages) >= 100)
            array_shift($chatRootObj->messages);

        //Write the modified file
        $chatFile = fopen($chatsPath . $chats[$chatIndex], "w");
        fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
        fclose($chatFile);
    } else {
        $postMessageStatus = 2;
    }
}


//Pack the response into a object
$result = new stdClass();
if (isset($user["avatar"])) {
    if ($user["avatar"] == "") {
        $result->avatar = "img/403024_avatar_boy_male_user_young_icon.png";
    } else {
        $result->avatar = "admin/received-files/avatars/" . $user["avatar"];
    }
}
$result->messageIndex = $messageIndex;
$result->postMessageStatus = $postMessageStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
