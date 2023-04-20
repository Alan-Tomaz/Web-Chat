<?php

//Get all form values
$username = $_POST["username"] ?? null;
$email = $_POST["email"] ?? null;
$telephone = $_POST["telephone"] ?? null;
$birth = $_POST["birth"] ?? null;
$location = $_POST["location"] ?? null;
$biography = $_POST["biography"] ?? null;
$password = $_POST["password"] ?? null;

//Prepare the response
$usernameStatus = 1;
$emailStatus = 1;
$telephoneStatus = 1;
$birthStatus = 1;
$locationStatus = 1;
$biographyStatus = 1;
$passwordStatus = 1;
$isSignUpSuccess = true;

//validate the fields
if ($username == "" || strlen($username) <= 5)
    $usernameStatus = 0;
if ($email == "")
    $emailStatus = 0;

//If passed of the validation, and all fields are ok, create the session
if ($usernameStatus == 1 && $emailStatus == 1 && $telephoneStatus == 1 && $birthStatus == 1 && $locationStatus == 1 && $biographyStatus == 1 && $passwordStatus == 1) {
    //Add the register to database
    //...

    //Create the session
    session_start();
    $_SESSION["nick"] = $username;
}
//If not passed of the validation, don't create the session
if ($usernameStatus == 0 || $emailStatus == 0 || $telephoneStatus == 0 || $birthStatus == 0 || $locationStatus == 0 || $biographyStatus == 0 || $passwordStatus == 0)
    $isSignUpSuccess = false;

//Pack the response into a object
$result = new stdClass();
$result->usernameStatus = $usernameStatus;
$result->emailStatus = $emailStatus;
$result->telephoneStatus = $telephoneStatus;
$result->birthStatus = $birthStatus;
$result->locationStatus = $locationStatus;
$result->biographyStatus = $biographyStatus;
$result->passwordStatus = $passwordStatus;
$result->isSignUpSuccess = $isSignUpSuccess;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
