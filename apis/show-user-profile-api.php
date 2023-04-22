<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";

//Get all form values

$userId = filter_var($_SESSION["user-id"], FILTER_SANITIZE_NUMBER_INT) ?? null;
/* var responsible for take the code errors, if 0 is all ok, case not, has a error. Each code error means some error */
$showUserStatus = 0;

//validate the fields

if (!$userId) {
    //If have fields in blank, return a popup error
    $showUserStatus = 1;
} else {


    if ($showUserStatus == 0) {
        //If all is okay, sign up continue

        //fetch user from database
        $fetchUserQuery = "SELECT * FROM users WHERE user_id = '$userId'";
        $fetchUserResult = mysqli_query($connection, $fetchUserQuery);

        if (mysqli_num_rows($fetchUserResult) == 1) {
            //convert the record into assoc array
            $userRecord = mysqli_fetch_assoc($fetchUserResult);
        } else {
            $showUserStatus = 2;
        }
    }
}

//Pack the response into a object
$result = new stdClass();
$result->showUserStatus = $showUserStatus;
/* Put the user data into the result object */
$result->userId = $userId;
$result->name = $userRecord["name"] ?? null;
$result->biography = $userRecord["biography"] ?? null;
/* Format the birth date to format dd-mm-yyyy */
$birthDateFormated = explode("-", $userRecord["birth_date"]);
$birthDateFormated = $birthDateFormated[2] . "/" . $birthDateFormated[1] . "/" . $birthDateFormated[0];
$result->birthDate = $birthDateFormated ?? null;
$result->phoneNumber = $userRecord["phone_number"] ?? null;
$result->email = $userRecord["email"] ?? null;
$result->location = $userRecord["location"] ?? null;
$result->avatar = $userRecord["avatar"] ?? null;

/* Format the Last Activity*/
/* Set the time zone to são paulo */
date_default_timezone_set("America/Sao_Paulo");

/* Catch the last activity in date time format */
$dateTime = strtotime($userRecord["last_activity"]);

/* Time Variables */
$actualDay = date("d");
$lastActivityDay = date("d", $dateTime);
$lastActivityDayOfWeek = date("l", $dateTime);


/* Function that format the last Activity */
function lastActivityFormated($lastActivityDay, $actualDay, $lastActivityDayOfWeek, $dateTime)
{
    /* If it is in the same week, change the date format to days of the week */
    if ($lastActivityDay == $actualDay) {
        $lastActivityFormatted = "Last activity " . "Today" . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else if ($lastActivityDay == ($actualDay - 1)) {
        $lastActivityFormatted = "Last activity " . "Yesterday" . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else if ($lastActivityDay == ($actualDay - 2)) {
        $lastActivityFormatted = "Last activity " . $lastActivityDayOfWeek . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else if ($lastActivityDay == ($actualDay - 3)) {
        $lastActivityFormatted = "Last activity " . $lastActivityDayOfWeek . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else if ($lastActivityDay == ($actualDay - 4)) {
        $lastActivityFormatted = "Last activity " . $lastActivityDayOfWeek . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else if ($lastActivityDay == ($actualDay - 5)) {
        $lastActivityFormatted = "Last activity " . $lastActivityDayOfWeek . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else if ($lastActivityDay == ($actualDay - 6)) {
        $lastActivityFormatted = "Last activity " . $lastActivityDayOfWeek . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    } else {
        $lastActivityFormatted = "Last activity " . date("d/m/Y", $dateTime) . " at " . date("H:i", $dateTime);
        return $lastActivityFormatted;
    }
}

$result->lastActivity = lastActivityFormated($lastActivityDay, $actualDay, $lastActivityDayOfWeek, $dateTime) ?? null;
//Print the result of object in JSON format
echo (json_encode($result, JSON_PRETTY_PRINT));
