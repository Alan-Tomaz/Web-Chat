<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$editMediaMessageStatus = 0;

$userId = filter_var($_POST["user-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$chatId = filter_var($_POST["chat-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$msgId = filter_var($_POST["msg-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
$media = $_FILES["new-media"];


if ($userId == null || $userId == "") {
    $editMediaMessageStatus = 1;
}
if ($chatId == null || $chatId == "") {
    $editMediaMessageStatus = 1;
}
if ($msgId == null || $msgId == "") {
    $editMediaMessageStatus = 1;
}
if ($media == null || $media == "") {
    $editMediaMessageStatus = 1;
}

if ($editMediaMessageStatus == 0) {

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



                        $chatRootObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                        if ($chatRootObj->messages[$msgId] != "") {

                            move_uploaded_file($mediaTmpName, $mediaDestinationPath);

                            //Add the message to the array of messages and save the file
                            if ($chatRootObj->messages[$msgId]->messageMedia != "") {
                                unlink("../admin/received-files/chat-media/" . $chatRootObj->messages[$msgId]->messageMedia);
                            }

                            $mediaMessage = "<img src='" . ROOT_URL . "admin/received-files/chat-media/" . $mediaName . "' class='image-message' alt='Image Not Found'>";

                            $chatRootObj->messages[$msgId]->messageMedia = $mediaName;
                            $chatRootObj->messages[$msgId]->message = $mediaMessage;

                            //If the messages array, have more than 100 messages, delete the more old message
                            //If the messages array, have more than 100 messages, delete the more old message
                            if (count($chatRootObj->messages) >= 100) {
                                if ($chatRootObj->messages[99]->messageMedia != "") {
                                    unlink("../admin/received-files/chat-media/" . $chatObj->messages[99]->messageMedia);
                                }
                                array_shift($chatRootObj->messages);
                            }
                        } else {
                            $editMediaMessageStatus = 7;
                        }

                        file_put_contents($chatsPath . $chats[$chatId], json_encode($chatRootObj));
                    } else {
                        $editMediaMessageStatus = 5;
                    }
                } else {
                    if (in_array($extention, $allowedFilesVideo)) {
                        //make sure image is not too large (20MB)
                        if ($media["size"] < 20000000) {
                            //upload avatar 

                            $chatRootObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                            if ($chatRootObj->messages[$msgId] != "") {


                                move_uploaded_file($mediaTmpName, $mediaDestinationPath);


                                //Add the message to the array of messages and save the file
                                if ($chatRootObj->messages[$msgId]->messageMedia != "") {
                                    unlink("../admin/received-files/chat-media/" . $chatRootObj->messages[$msgId]->messageMedia);
                                }

                                $mediaMessage = "<video class='message-video' controls><source src='" . ROOT_URL . "admin/received-files/chat-media/" . $mediaName . "' type='video/mp4'> Your browser does not support this video format</video>";

                                $chatRootObj->messages[$msgId]->messageMedia = $mediaName;
                                $chatRootObj->messages[$msgId]->message = $mediaMessage;

                                //If the messages array, have more than 100 messages, delete the more old message
                                //If the messages array, have more than 100 messages, delete the more old message
                                if (count($chatRootObj->messages) >= 100) {
                                    if ($chatRootObj->messages[99]->messageMedia != "") {
                                        unlink("../admin/received-files/chat-media/" . $chatObj->messages[99]->messageMedia);
                                    }
                                    array_shift($chatRootObj->messages);
                                }
                            } else {
                                $editMediaMessageStatus = 7;
                            }

                            file_put_contents($chatsPath . $chats[$chatId], json_encode($chatRootObj));
                        } else {
                            $editMediaMessageStatus = 5;
                        }
                    } else {
                        $editMediaMessageStatus = 4;
                    }
                }
            } else {
                $editMediaMessageStatus = 6;
            }
        } else {
            $editMediaMessageStatus = 3;
        }
    } else {
        $editMediaMessageStatus = 2;
    }
}

$result = new stdClass();
if ($editMediaMessageStatus == 0) {
    $result->newMessage = $mediaMessage;
}
$result->editMediaMessageStatus = $editMediaMessageStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
