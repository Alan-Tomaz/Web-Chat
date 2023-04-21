<?php

//Receive the file and data
$userThatUploadedTheFile = $_POST["uploaderUser"] ?? null;
$uploadedFileName = $_FILES["uploadFile"]["name"] ?? null;
$uploadedFileTempName = $_FILES["uploadFile"]["tmp_name"] ?? null;
$receivedUploadedFile = __DIR__ . "/received-files/" . basename($uploadedFileName);
//Get the file parameters
$fileType = strtolower(pathinfo($receivedUploadedFile, PATHINFO_EXTENSION));

//Upload informations
$uploaderUser = $userThatUploadedTheFile;
$mimeType = "";
$receivedUploadOk = 1;

//Process the upload
$successOnReceiveFile = move_uploaded_file($uploadedFileTempName, $receivedUploadedFile);
//If have success
if ($successOnReceiveFile == true) {
    $mimeType = $fileType;
    $receivedUploadOk = 1;
}
//If have error on receive file
if ($successOnReceiveFile == false) {
    $mimeType = "";
    $receivedUploadOk = 0;
}

//Pack the response into a object
$result = new stdClass();
$result->uploaderUser = $uploaderUser;
$result->mimeType = $mimeType;
$result->receivedUploadOk = $receivedUploadOk;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
