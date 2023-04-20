<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/config/database.php";
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

    <section class="signin-section section">
        <div class="signin-container container">
            <div class="signin-img container-img">
                <img src="<?= ROOT_URL ?>img/undraw_chatting_re_j55r.svg" alt="">
            </div>
            <div class="signin-content container-content">
                <h1 class="signin-title content-title">Sign In</h1>
                <form class="signin-form content-form" action="" method="POST" enctype="multipart/form-data">
                    <input type="email" name="email" class="signin-input input" placeholder="Email:">
                    <input type="password" name="password" class="signin-input input" placeholder="Password:">
                </form>
                <button type="submit" class="btn signin-btn content-btn">Sign In</button>
                <span>Don't Have An Account? <a href="<?= ROOT_URL ?>pages/signup.php">Sign Up</a></span>
            </div>
        </div>
    </section>
    <!--================================ GOOGLE FONTS ================================-->
    <script src="<?= ROOT_URL ?>js/main.js"></script>
</body>

</html>