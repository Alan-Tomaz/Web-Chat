<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";


/* var responsible for take the code errors, if 0 is all ok, case not, has a error. Each code error means some error */
$editUserStatus = 0;
if (isset($_SESSION["user-id"]) && isset($_POST["user-id"])) {

    $value = "none";

    $userId = $_SESSION["user-id"];
    $targetUserId = $_POST["user-id"];

    $userQuery = "SELECT * FROM users WHERE user_id = $userId";
    $userQueryResult = mysqli_query($connection, $userQuery);


    /* Functions with  Regex Validations*/

    function validatePassword($password)
    {
        /* Check If the password has ate least 1 lowerletter, upperletter, number and special character */
        $lowerPasswordRegex = "/(?=.*[a-z])/";
        $upperPasswordRegex = "/(?=.*[A-Z])/";
        $numberPasswordRegex = "/(?=.*[0-9])/";
        $specialPasswordRegex = "/(?=.*[!@#\$%\^&\*])/";

        if (preg_match($lowerPasswordRegex, $password) && preg_match($upperPasswordRegex, $password) && preg_match($numberPasswordRegex, $password) && preg_match($specialPasswordRegex, $password)) {
            return 1;
        } else {
            return 0;
        }
    }


    /* Function of validate the number according to the Brazilian format */
    function validatePhoneNumber($phoneNumber)
    {

        $mobilePhonePattern = "/^\s*([(]\d{2}[)]|\d{0})[-. ]?(\d{1}|\d{0})[-. ]?(\d{4}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/";

        return preg_match(
            $mobilePhonePattern,
            $phoneNumber
        );
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


    /* Check if the user exists, case not, has a fail */
    if (!mysqli_num_rows($userQueryResult) == 1) {
        $editUserStatus = 9;
    } else  if ($userId == $targetUserId || isset($_SESSION["user-is-admin"])) {

        $user = mysqli_fetch_assoc($userQueryResult);
        $userAvatar = $user["avatar"];
        //Get the form value and validate him
        if (isset($_POST["username"])) {
            $username = filter_var($_POST["username"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
            if (!$username) {
                $editUserStatus = 1;
            }
            if ($editUserStatus === 0) {
                $userSaveDataQuery = "UPDATE users SET name = '$username' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);
            }
            $value = $username;
        } else if (isset($_POST["biography"])) {
            $biography = filter_var($_POST["biography"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
            if (!$biography) {
                $editUserStatus = 1;
            }
            if ($editUserStatus === 0) {
                $userSaveDataQuery = "UPDATE users SET biography = '$biography' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);
            }
            $value = $biography;
        } else if (isset($_POST["birth-date"])) {
            $birthDate = filter_var($_POST["birth-date"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
            /* Change the date to format dd--mm-yyyy for validations */
            if ($birthDate != "") {
                $newBirthOriginalValue = explode("-", $birthDate);
                $birthDateFormatted = $newBirthOriginalValue[2] . "/" . $newBirthOriginalValue[1] . "/" . $newBirthOriginalValue[0];
                $value = $birthDateFormatted;
            }


            if (!$birthDate) {
                $editUserStatus = 1;
            } else if (!validateBirthDate($birthDateFormatted)) {
                $editUserStatus = 4;
            }
            if ($editUserStatus === 0) {

                /*  
                * Change the birth date format to the date format off the mysql
                */
                $separateBirthDate = explode("/", $birthDateFormatted);
                $mySqlDateFormat = $separateBirthDate[2] . "-" . $separateBirthDate[1] . "-" . $separateBirthDate[0];

                $userSaveDataQuery = "UPDATE users SET birth_date = '$mySqlDateFormat' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);

                $value = $mySqlDateFormat;
            }
        } else if (isset($_POST["phone-number"])) {
            $phoneNumber = filter_var($_POST["phone-number"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
            if (!$phoneNumber) {
                $editUserStatus = 1;
            } else if (!validatePhoneNumber($phoneNumber)) {
                $editUserStatus = 3;
            }
            if ($editUserStatus === 0) {

                $userSaveDataQuery = "UPDATE users SET phone_number = '$phoneNumber' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);
            }
            $value = $phoneNumber;
        } else if (isset($_POST["email"])) {
            $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL) ?? null;
            if (!$email) {
                $editUserStatus = 1;
            } else if (!validateEmailAddress($email)) {
                $editUserStatus = 2;
            } else {
                //fetch user from database
                //check if email already exist in database, if yes, return a popup error
                $userCheckQuery = "Select * FROM users WHERE email = '$email'";
                $userCheckResult = mysqli_query($connection, $userCheckQuery);
                if (mysqli_num_rows($userCheckResult) > 0) {
                    $editUserStatus = 7;
                }
            }
            if ($editUserStatus === 0) {

                $userSaveDataQuery = "UPDATE users SET email = '$email' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);
            }
            $value = $email;
        } else if (isset($_POST["location"])) {
            $location = filter_var($_POST["location"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
            if (!$location)
                $editUserStatus = 1;
            if ($editUserStatus === 0) {

                $userSaveDataQuery = "UPDATE users SET location = '$location' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);
            }
            $value = $location;
        } else if (isset($_POST["password"])) {
            $password = filter_var($_POST["password"], FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? null;
            $dbPassword = $user["password"];

            if (!$password) {
                $editUserStatus = 1;
            } else if (strlen($password) < 8) {
                $editUserStatus = 5;
            } else if (!validatePassword($password)) {
                $editUserStatus = 6;
            }
            if ($editUserStatus === 0) {

                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                $userSaveDataQuery = "UPDATE users SET password = '$hashedPassword' WHERE user_id = '$targetUserId' LIMIT 1";
                $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);

                $value = $hashedPassword;
            }
        } else if (isset($_FILES["avatar"])) {
            $avatar = $_FILES["avatar"];

            if (!$avatar["name"]) {
                $editUserStatus = 1;
            } else {
                //WORK ON NEW AVATAR
                //rename avatar
                $time = time(); //make each image name unique using current timestamp
                $avatarName = $time . "-" . $avatar["name"];
                $avatarTmpName = $avatar["tmp_name"];
                $avatarDestinationPath =  "../admin/received-files/avatars/" . $avatarName;

                //make sure file is an image
                $allowed_files = ["png", "jpg", "jpeg"];
                $extention = explode(".", $avatarName);
                $extention = end($extention);

                $value = $avatarName;
                if (in_array($extention, $allowed_files)) {
                    //make sure image is not too large (1MB)
                    if ($avatar["size"] < 1000000) {
                        //upload avatar 
                        if ($user["avatar"] != "") {
                            $oldAvatarPath = "../admin/received-files/avatars/" . $user["avatar"];
                            if ($oldAvatarPath) {
                                unlink($oldAvatarPath);
                            }
                        }

                        move_uploaded_file($avatarTmpName, $avatarDestinationPath);
                        if ($editUserStatus == 0) {

                            $userSaveDataQuery = "UPDATE users SET avatar = '$avatarName' WHERE user_id = '$targetUserId' LIMIT 1";
                            $userSaveDataResult = mysqli_query($connection, $userSaveDataQuery);

                            $userAvatar = $avatarName;
                        }
                    } else {
                        $editUserStatus = 10;
                    }
                } else {
                    $editUserStatus = 11;
                }
            }
        }
    } else {
        $editUserStatus = 8;
    }
    //Pack the response into a object
    $result = new stdClass();
    $result->editUserStatus = $editUserStatus;
    $result->avatarName = $userAvatar;

    //Print the result of object in JSON format
    echo (json_encode($result, JSON_PRETTY_PRINT));
}
