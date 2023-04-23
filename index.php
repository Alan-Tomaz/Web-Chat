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

<body>

    <section class="hero-section">
        <div class="content-container">
            <h1 class="hero-section-title">WEB CHAT</h1>
            <h3 class="hero-section-subtitle">Chat with new people about different subjects in real time, in a practical
                and easy way</h3>
            <div class="hero-buttons">
                <a href="<?= ROOT_URL ?>pages/chat.php" class="chat-btn btn">Chat Now</a>
                <span>Or</span>
                <a href="<?= ROOT_URL ?>pages/signup.php" class="register-btn btn">Register</a>
            </div>
        </div>
        <div class="img-container">
            <img src="<?= ROOT_URL ?>img/undraw_chat_re_re1u.svg" class="hero-img">
        </div>
    </section>
    <!--================================ GOOGLE FONTS ================================-->
    <script src="<?= ROOT_URL ?>js/main.js"></script>
</body>

</html>