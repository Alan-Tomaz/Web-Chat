<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

//Prepare the response
$isLogOutSuccessfully = true;

//Exclude the session
session_destroy();

//Pack the response into a object
$result = new stdClass();
$result->isLogOutSuccessfully = $isLogOutSuccessfully;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
