<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

//Get all form values

$username = filter_var($_POST["username"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL) ?? null;
$phoneNumber = filter_var($_POST["phone-number"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$birth = filter_var($_POST["birth"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$location = filter_var($_POST["location"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$biography = filter_var($_POST["biography"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$password = filter_var($_POST["password"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
$passwordRetype = filter_var($_POST["password-retype"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
/* var responsible for take the code errors, if 0 is all ok, case not, has a error. Each code error means some error */
$signupStatus = 0;


/* Functions with  Regex Validations*/

function validatePassword($password)
{
    /* Check If the password has ate least 1 lowerletter, upperletter, number and special character */
    $lowerPasswordRegex = "/(?=.*[a-z])/";
    $upperPasswordRegex = "/(?=.*[A-Z])/";
    $numberPasswordRegex = "/(?=.*[0-9])/";
    $specialPasswordRegex = "/(?=.*[!@#\$%\^&\*])/";

    if (preg_match($lowerPasswordRegex, $password) || preg_match($upperPasswordRegex, $password) || preg_match($numberPasswordRegex, $password) || preg_match($specialPasswordRegex, $password)) {
        return 1;
    }
}


/* Function of validate the number according to the Brazilian format */
function validatePhoneNumber($phoneNumber)
{

    $mobilePhonePattern = "/^\s*([(]\d{2}[)]|\d{0})[-. ]?(\d{1}|\d{0})[-. ]?(\d{4}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/";

    return preg_match($mobilePhonePattern, $phoneNumber);
}

/* Function of validate the email */
function validateEmailAddress($email)
{

    $emailPattern = "/^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/";

    return preg_match($emailPattern, $email);
}


/* function that check if the date is in the format DD-MM-YYYY*/
function validateBirthDate($birth)
{
    $datePattern = "/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/";

    return preg_match($datePattern, $birth);
}

//validate the fields

if (!$username || !$email || !$email || !$phoneNumber || !$birth || !$biography || !$password || !$passwordRetype) {
    //If have fields in blank, return a popup error
    $signupStatus = 1;
} elseif (!validateEmailAddress($email)) {
    //If email is not in the correct format, return a popup error
    $signupStatus = 2;
} elseif (!validatePhoneNumber($phoneNumber)) {
    //If phonenumber is not in the correct format, return a popup error
    $signupStatus = 3;
} elseif (!validateBirthDate($birth)) {
    //If date is not in the correct format, return a popup error
    $signupStatus = 4;
} elseif (strlen($password) < 8) {
    //If password dont have the correct length, return a popup error
    $signupStatus = 5;
} elseif ($password !== $passwordRetype) {
    $signupStatus = 6;
} elseif (!validatePassword($password)) {
    //If password is not in the correct format, return a popup error
    $signupStatus = 7;
} else {

    //check if email already exist in database, if yes, return a popup error
    $userCheckQuery = "Select * FROM users WHERE email = '$email'";
    $userCheckResult = mysqli_query($connection, $userCheckQuery);
    if (mysqli_num_rows($userCheckResult) > 0) {
        $signupStatus = 8;
    }
}

if ($signupStatus === 0) {
    //If all is okay, sign up continue

    // hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    /*  
    * Change the birth date format to the date format off the mysql
    */
    $separateBirthDate = explode("/", $birth);
    $mySqlDateFormat = $separateBirthDate[2] . "-" . $separateBirthDate[1] . "-" . $separateBirthDate[0];

    $insertUserQuery = "INSERT INTO users (name, biography, birth_date, phone_number, email, location, password, avatar, is_admin) VALUES ('$username', '$biography', '$mySqlDateFormat', '$phoneNumber', '$email', '$location', '$hashedPassword', '', 0)";
    $insertUserResult = mysqli_query($connection, $insertUserQuery);

    if (!mysqli_errno($connection)) {
        //redirect to login page with success message
        $userIdQuery = "SELECT user_id FROM users WHERE email = '$email'";
        $userIdResult = mysqli_query($connection, $userIdQuery);
        $userId = mysqli_fetch_assoc($userIdResult);
        $_SESSION['user-id'] = $userId["user_id"];
    }
}
//Pack the response into a object
$result = new stdClass();
$result->signupStatus = $signupStatus;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
