<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

//Get all form values

$email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL) ?? null;
$password = filter_var($_POST["password"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
/* var responsible for take the code errors, if 0 is all ok, case not, has a error. Each code error means some error */
$signinStatus = 0;

//validate the fields

if (!$email || !$password) {
    //If have fields in blank, return a popup error
    $signupStatus = 1;
} elseif (strlen($password) < 8) {
    //If password dont have the correct length, return a popup error
    $signinStatus = 2;
} else {


    if ($signinStatus === 0) {
        //If all is okay, sign up continue

        //fetch user from database
        $fetchUserQuery = "SELECT * FROM users WHERE email = '$email'";
        $fetchUserResult = mysqli_query($connection, $fetchUserQuery);

        if (mysqli_num_rows($fetchUserResult) == 1) {
            //convert the record into assoc array
            $userRecord = mysqli_fetch_assoc($fetchUserResult);
            $dbPassword = $userRecord['password'];

            //compare form password with database password
            if (password_verify($password, $dbPassword)) {
                // set session for access the control
                $_SESSION['user-id'] = $userRecord['user_id'];
                // set session if user is an admin
                if ($userRecord["is_admin"] == 1) {
                    $_SESSION["user-is-admin"] = true;
                }
            } else {
                $signinStatus = 3;
            }
        } else {
            $signinStatus = 4;
        }
    }
}

//Pack the response into a object
$result = new stdClass();
$result->signinStatus = $signinStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
