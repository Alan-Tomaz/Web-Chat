<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$chatIndex = filter_var($_POST["chat"], FILTER_SANITIZE_NUMBER_INT);
$userId = filter_var($_POST["userId"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$media = $_FILES["media"];

//Prepare the response
$postMediaStatus = 0;

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
    $postMediaStatus = 1;
}

if ($postMediaStatus == 0) {


    //If the channel file exists, add the message to the file
    //Read the chat file
    $chatRootObj = json_decode(file_get_contents($chatsPath . $chats[$chatIndex]), false);


    /* Search the User Info in the DB */

    $userQuery = "SELECT * FROM users WHERE user_id = $userId";
    $userResult = mysqli_query($connection, $userQuery);
    if (mysqli_num_rows($userResult) == 1) {
        $user = mysqli_fetch_assoc($userResult);


        if ($media["name"]) {

            //WORK ON NEW AVATAR
            //rename avatar
            $time = time(); //make each image name unique using current timestamp
            $mediaName = $time . "-" . $media["name"];
            $mediaTmpName = $media["tmp_name"];
            $mediaDestinationPath =  "../admin/received-files/chat-media/" . $mediaName;

            //make sure file is an image
            $allowedFilesImg = ["png", "jpg", "jpeg", "gif"];
            $allowedFilesVideo = ["mp4"];
            $extention = explode(".", $mediaName);
            $extention = end($extention);

            if (in_array($extention, $allowedFilesImg)) {
                //make sure image is not too large (3MB)
                if ($media["size"] < 3000000) {


                    move_uploaded_file($mediaTmpName, $mediaDestinationPath);

                    //Add the message to the array of messages and save the file
                    $chatMessage = new stdClass();
                    $chatMessage->userId = $userId;
                    $chatMessage->nickname = $user["name"];
                    $mediaMessage = "<img src='" . ROOT_URL . "admin/received-files/chat-media/" . $mediaName . "' class='image-message' alt='Image Not Found'>";
                    $chatMessage->message = $mediaMessage;

                    if ($user["avatar"] == "") {
                        $chatMessage->img = "";
                    } else {
                        $chatMessage->img = $user["avatar"];
                    }



                    array_push(
                        $chatRootObj->messages,
                        $chatMessage
                    );

                    //If the messages array, have more than 100 messages, delete the more old message
                    if (count($chatRootObj->messages) >= 100)
                        array_shift($chatRootObj->messages);

                    //Write the modified file
                    $chatFile = fopen($chatsPath . $chats[$chatIndex], "w");
                    fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
                    fclose($chatFile);
                } else {
                    $postMediaStatus = 5;
                }
            } else {
                if (in_array($extention, $allowedFilesVideo)) {
                    //make sure image is not too large (20MB)
                    if ($media["size"] < 20000000) {
                        //upload avatar 

                        move_uploaded_file($mediaTmpName, $mediaDestinationPath);

                        //Add the message to the array of messages and save the file
                        $chatMessage = new stdClass();
                        $chatMessage->userId = $userId;
                        $chatMessage->nickname = $user["name"];
                        $mediaMessage = "<video class='message-video' controls><source src='" . ROOT_URL . "admin/received-files/chat-media/" . $mediaName . "' type='video/mp4'> Your browser does not support this video format</video>";
                        $chatMessage->message = $mediaMessage;

                        if ($user["avatar"] == "") {
                            $chatMessage->img = "";
                        } else {
                            $chatMessage->img = $user["avatar"];
                        }


                        array_push(
                            $chatRootObj->messages,
                            $chatMessage
                        );

                        //If the messages array, have more than 100 messages, delete the more old message
                        if (count($chatRootObj->messages) >= 100)
                            array_shift($chatRootObj->messages);

                        //Write the modified file
                        $chatFile = fopen($chatsPath . $chats[$chatIndex], "w");
                        fwrite($chatFile, json_encode($chatRootObj, JSON_PRETTY_PRINT));
                        fclose($chatFile);
                    } else {
                        $postMediaStatus = 5;
                    }
                } else {
                    $postMediaStatus = 4;
                }
            }
        } else {
            $postMediaStatus = 3;
        }
    } else {
        $postMediaStatus = 2;
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
if (isset($mediaMessage)) {
    $result->mediaMessage = $mediaMessage;
}
$result->postMediaStatus = $postMediaStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
