<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/partials/header.php";
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
    <section class="signin-section section">
        <div class="signin-container container">
            <div class="signin-img container-img">
                <img src="<?= ROOT_URL ?>img/undraw_chatting_re_j55r.svg" alt="">
            </div>
            <div class="signin-content container-content">
                <h1 class="signin-title content-title">Sign In</h1>
                <div class="signin-form content-form">
                    <input type="email" id="email" class="signin-input input" placeholder="Email:">
                    <input type="password" id="password" class="signin-input input" placeholder="Password:">
                </div>
                <div class="form-footer">
                    <button id="sign-in-button" class="btn signup-btn content-btn" onclick="OnClickSignIn('<?= ROOT_URL ?>')">Sign In</button>
                    <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="form-loading" id="form-loading">
                </div>
                <span>Don't Have An Account? <a href="<?= ROOT_URL ?>pages/signup.php">Sign Up</a></span>
            </div>
        </div>
    </section>
    <!--================================ JS SCRIPTS ================================-->
    <!-- GENERAL JS SCRIPT -->
    <script src="<?= ROOT_URL ?>js/main.js"></script>
    <!-- SIGN IN PAGE SCRIPT -->
    <script src="<?= ROOT_URL ?>js/signin.js"></script>
    <!-- AJAX LIBRARY -->
    <script src="<?= ROOT_URL ?>js/ajax-lib.js"></script>
</body>

</html>