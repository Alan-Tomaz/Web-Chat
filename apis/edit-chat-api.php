<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

$editChatStatus = 0;

if (isset($_SESSION["user-is-admin"])) {

    if (isset($_POST["chat-id"])) {
        $chatId = filter_var($_POST["chat-id"], FILTER_SANITIZE_NUMBER_INT);
        if (isset($_POST["chat-name"])) {
            $chatName = filter_var($_POST["chat-name"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if ($chatName) {
                $chatsPath =   "../admin/chat-channels/";

                $chats = array();
                if (is_dir($chatsPath)) {
                    $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
                    /* Create a new array to reorganize indexes */

                    /* $ocurrences = $array_keys($chatsArray, "/$searchingName(.*?)/"); */
                    $chats = array_values($chatsArray);

                    sort($chats);
                    $i = 0;

                    if ($chats[$chatId]) {
                        $chatExtension = explode(".", $chats[$chatId]);
                        if (end($chatExtension) == "json") {
                            //Read The Chat File
                            $chatObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                            foreach ($chatObj->chatInfo as $chatInfo) {
                                if ($chatInfo->chatId == $chatId) {
                                    $chatInfo->name = $chatName;
                                }
                            }


                            file_put_contents($chatsPath . $chats[$chatId], json_encode($chatObj));
                        }
                    } else {
                        $editChatStatus = 6;
                    }
                } else {
                    $editChatStatus = 5;
                }
            } else {
                $editChatStatus = 4;
            }
        } else if (isset($_POST["chat-desc"])) {
            $chatDesc = filter_var($_POST["chat-desc"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            if ($chatDesc) {

                $chatsPath =   "../admin/chat-channels/";

                $chats = array();
                if (is_dir($chatsPath)) {
                    $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
                    /* Create a new array to reorganize indexes */

                    /* $ocurrences = $array_keys($chatsArray, "/$searchingName(.*?)/"); */
                    $chats = array_values($chatsArray);

                    sort($chats);
                    $i = 0;

                    if ($chats[$chatId]) {

                        $chatExtension = explode(".", $chats[$chatId]);
                        if (end($chatExtension) == "json") {
                            //Read The Chat File
                            $chatObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                            foreach ($chatObj->chatInfo as $chatInfo) {
                                if ($chatInfo->chatId == $chatId) {
                                    $chatInfo->description = $chatDesc;
                                }
                            }


                            file_put_contents($chatsPath . $chats[$chatId], json_encode($chatObj));
                        }
                    } else {
                        $editChatStatus = 6;
                    }
                } else {
                    $editChatStatus = 5;
                }
            } else {
                $editChatStatus = 4;
            }
        } else if (isset($_FILES["img"])) {
            $chatImg = $_FILES["img"];

            if ($chatImg) {
                //WORK ON NEW AVATAR
                //rename avatar
                $time = time(); //make each image name unique using current timestamp
                $chatImgName = $time . "-" . $chatImg["name"];
                $chatImgTmpName = $chatImg["tmp_name"];
                $chatImgDestinationPath =  "../admin/received-files/chat-img/" . $chatImgName;

                //make sure file is an image
                $allowed_files = ["png", "jpg", "jpeg"];
                $extention = explode(".", $chatImgName);
                $extention = end($extention);

                if (in_array($extention, $allowed_files)) {
                    //make sure image is not too large (1MB)
                    if ($chatImg["size"] < 1000000) {

                        $chatsPath =   "../admin/chat-channels/";

                        $chats = array();
                        if (is_dir($chatsPath)) {
                            $chatsArray = array_diff(scandir($chatsPath), array('.', '..'));
                            /* Create a new array to reorganize indexes */

                            /* $ocurrences = $array_keys($chatsArray, "/$searchingName(.*?)/"); */
                            $chats = array_values($chatsArray);

                            sort($chats);
                            $i = 0;

                            if ($chats[$chatId]) {


                                $chatExtension = explode(".", $chats[$chatId]);
                                if (end($chatExtension) == "json") {
                                    //Read The Chat File

                                    $chatObj = json_decode(file_get_contents($chatsPath . $chats[$chatId]), false);

                                    foreach ($chatObj->chatInfo as $chatInfo) {
                                        if ($chatInfo->chatId == $chatId) {

                                            $oldChatImg = $chatInfo->img;
                                            if ($oldChatImg != "") {
                                                $oldAvatarPath = "../admin/received-files/chat-img/" . $oldChatImg;
                                                if ($oldAvatarPath) {
                                                    unlink($oldAvatarPath);
                                                }
                                            }

                                            $chatInfo->img = $chatImgName;

                                            move_uploaded_file($chatImgTmpName, $chatImgDestinationPath);
                                        }
                                    }
                                    file_put_contents($chatsPath . $chats[$chatId], json_encode($chatObj));
                                }
                            } else {
                                $editChatStatus = 6;
                            }
                        } else {
                            $editChatStatus = 5;
                        }
                    } else {
                        $editChatStatus = 8;
                    }
                } else {
                    $editChatStatus = 7;
                }
            } else {
                $editChatStatus = 4;
            }
        } else {
            $editChatStatus = 3;
        }
    } else {
        $editChatStatus = 2;
    }
} else {
    $editChatStatus = 1;
}

$result = new stdClass();
$result->editChatStatus = $editChatStatus;
if (isset($chatName)) {
    $result->chatName = $chatName;
}
if (isset($chatDesc)) {
    $result->chatDesc = $chatDesc;
}
if (isset($chatImgName)) {
    $result->imgName = $chatImgName;
}
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
