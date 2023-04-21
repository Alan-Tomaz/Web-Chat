<?php
include $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/partials/header.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Chat</title>
    <!--================================ Unicons ================================CDN -->
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
    <!--================================ FAVICON ================================-->
    <link rel="shortcut icon" href="<?= ROOT_URL ?>img/favicon.svg" type="image/x-icon">
    <!--================================ CSS EXTERN ================================-->
    <link rel="stylesheet" href="<?= ROOT_URL ?>css/style.css">
    <!--================================ GOOGLE FONTS ================================-->
    <!-- Montserrat -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>

<body class="body-blue">
    <div class="popup" id="popup">
        <img src="<?= ROOT_URL ?>img/299045_sign_error_icon.png">
        <h2 id="popup-title">Thank You!</h2>
        <p id="popup-text">Your Details Has Been Successfully Submitted. Thanks!</p>
        <div class="confirmation-btn">
            <button type="button" id="ok-btn" onclick="hideConfirmMessage()">Ok</button>
        </div>
    </div>
    <section class="signup-section section">
        <div class="signup-container container">
            <div class="signup-img container-img">
                <img src="<?= ROOT_URL ?>img/undraw_begin_chat_re_v0lw.svg">
            </div>
            <div class="signup-content container-content">
                <h1 class="signup-title content-title">Sign Up</h1>
                <form class="signup-form content-form" method="POST">
                    <input type="text" id="nick" name="username" class="signup-input input" placeholder="Username:">
                    <input type="email" id="email" name="email" class="signup-input input" placeholder="Email:">
                    <input type="tel" id="phone" name="telephone" class="signup-input input" placeholder="Phone Number:">
                    <input type="text" id="birth-date-impostor" class="signup-input input" placeholder="Birth Date:" onclick="OnClickBirthField();" autocomplete="off">
                    <input type="text" id="location" name="location" class="signup-input input" placeholder="Location:">
                    <textarea cols="30" id="bio-input" placeholder="Biography:" class="signup-input input"></textarea>
                    <input type="password" id="password" name="create-password" class="signup-input input" placeholder="Password:">
                    <input type="password" id="password-retype" name="confirm-password" class="signup-input input" placeholder="Confirm Password:">
                </form>
                <input type="date" id="birth-date-hidden" onchange="OnChangeValueFromOriginalBirth();">
                <div class="form-footer">
                    <button id="sign-up-button" class="btn signup-btn content-btn" onclick="OnClickSignUp('<?= ROOT_URL ?>')">Sign Up</button>
                    <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="form-loading" id="form-loading">
                </div>
                <span>Already Have An Account? <a href="<?= ROOT_URL ?>pages/signin.php">Login</a></span>
            </div>
        </div>
    </section>
    <!--================================ GOOGLE FONTS ================================-->
    <script src="<?= ROOT_URL ?>js/main.js"></script>
    <script src="<?= ROOT_URL ?>js/signup.js"></script>
    <script src="<?= ROOT_URL ?>js/ajax-lib.js"></script>
</body>

</html>