<?php

//Get message data
$channel = $_POST["channel"];
$userId = $_POST["userId"];
$nickname = $_POST["nickname"];
$message = $_POST["message"];

//Build the path to the chat channel
$desiredChannelPath = __DIR__ .  "/chat-channels/" . $channel . ".json";

//Prepare the response
$postMessageSuccess = true;

//If the channel file don't exists, create the file with initial data
if (file_exists($desiredChannelPath) == false) {
    //Create the file object
    $chatRootObj = new stdClass();
    $chatRootObj->messages = array();

    //Create the chat file
    $chatFile = fopen($desiredChannelPath, "w");
    fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
    fclose($chatFile);
}

//If the channel file exists, add the message to the file
if (file_exists($desiredChannelPath) == true) {
    //Read the chat file
    $chatRootObj = json_decode(file_get_contents($desiredChannelPath), false);

    //Add the message to the array of messages and save the file
    $chatMessage = new stdClass();
    $chatMessage->userId = $userId;
    $chatMessage->nickname = $nickname;
    $chatMessage->message = $message;
    array_push($chatRootObj->messages, $chatMessage);

    //If the messages array, have more than 100 messages, delete the more old message
    if (count($chatRootObj->messages) >= 100)
        array_shift($chatRootObj->messages);

    //Write the modified file
    $chatFile = fopen($desiredChannelPath, "w");
    fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
    fclose($chatFile);
}

//Pack the response into a object
$result = new stdClass();
$result->postMessageSuccess = $postMessageSuccess;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
