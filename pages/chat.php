<?php
require $_SERVER["DOCUMENT_ROOT"] . "/Web Chat/partials/header.php";

$isLogged = isset($_SESSION["user-id"]);
if (isset($_SESSION["user-is-admin"])) {
    $isAdmin = isset($_SESSION["user-is-admin"]);
} else {
    $isAdmin = null;
}

if ($isLogged) {
    $userId = $_SESSION['user-id'];
    /* GET THE USER DATA FROM THE DATABASE */
    $userQuery = "SELECT * FROM users WHERE user_id = $userId";
    $userQueryResult = mysqli_query($connection, $userQuery);
    $user = mysqli_fetch_assoc($userQueryResult);
} else {
    $userId = 0;
}
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
    <!--================================ FAVCON ================================-->
    <link rel="shortcut icon" href="<?= ROOT_URL ?>img/favicon.svg" type="image/x-icon">
    <!--================================ CSS EXTERN ================================-->
    <link rel="stylesheet" href="<?= ROOT_URL ?>css/style.css">
    <!--================================ GOOGLE FONTS ================================-->
    <!-- Montserrat -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>

<body class="overflow-hidden" onload="loadChats('<?= ROOT_URL ?>'), loadPage(<?= $userId ?>, <?= $isAdmin ?>)">
    <div class="message-options" id="message-options">
        <button class="edit-option-btn" id="edit-option-btn" onclick="">Edit Message</button>
        <hr class="btn-hr hr">
        <button class="delete-option-btn" id="delete-option-btn" onclick="">Delete Message</button>
    </div>
    <div class="alert-bar" id="alert-bar">
        <h1 class="alert-title" id="alert-title">Error</h1>
        <p class="alert-text" id="alert-text">Error</p>
    </div>
    <div class="delete-screen" id="delete-screen">
        <div class="delete-popup" id="delete-popup">
            <i class="uil uil-times close-delete-popup" id="close-delete-popup" onclick="hideDeletePopup()"></i>
            <img src="<?= ROOT_URL ?>img/9004743_trash_delete_bin_remove_icon (1).png" class="delete-popup-img">
            <h2 class="delete-popup-title" id="delete-popup-title">Delete</h2>
            <p class="delete-popup-text" id="delete-popup-text">Are You Sure That You Want To Delete?</p>
            <div class="delete-popup-confirmation-btn">
                <div id="cancel-delete-popup-btn" class="cancel-delete-popup-btn btn" onclick="hideDeletePopup()">
                    <span id="cancel-delete-popup-btn-text">Cancel</span>
                </div>
                <div id="delete-popup-btn" class="delete-popup-btn btn" onclick="deleteUser()">
                    <span id="delete-popup-btn-text">Delete</span>
                    <img id="delete-popup-loading" class="delete-popup-loading" src="<?= ROOT_URL ?>img/Rolling-alt.svg">
                </div>
            </div>
        </div>
    </div>
    <div class="message-options-screen" id="message-options-screen">
        <div class="edit-message-popup" id="edit-message-popup">
            <i class="uil uil-times close-edit-message" id="close-edit-message" onclick="hideEditMessagePopup()"></i>
            <img src="<?= ROOT_URL ?>img/1055085_compose_edit_paper_pencil_write_icon.png" class="edit-message-img">
            <h2 class="edit-message-title" id="edit-message-title">Edit Message</h2>
            <textarea class="edit-message-text" id="edit-message-text" placeholder="New Message"></textarea>

            <div class="edit-message-confirmation-btn">
                <div id="edit-message-btn" class="edit-message-btn btn" onclick="editMessage()">
                    <span id="edit-message-btn-text" class="edit-message-btn-text">Edit Message</span>
                    <img id="edit-message-loading" class="edit-message-loading" src="<?= ROOT_URL ?>img/Rolling-alt.svg">
                </div>
            </div>
        </div>
        <!-- EDIT MEDIA MESSAGE -->
        <div class="edit-message-popup" id="edit-media-message-popup">
            <i class="uil uil-times close-edit-message" id="close-edit-message" onclick="hideEditMediaMessagePopup()"></i>
            <img src="<?= ROOT_URL ?>img/1055085_compose_edit_paper_pencil_write_icon.png" class="edit-message-img">
            <h2 class="edit-message-title" id="edit-message-title">Edit Message</h2>
            <div class="add-chat-img-box" id="edit-media-message-img-box">
                <input type="file" class="editMediaMessage" id="edit-media-message" name="edit-media-message" onchange="changeMediaMessage()">
                <label for="edit-media-message" class="add-chat-img-btn">Edit Media</label>
                <div class="add-chat-img-text" id="edit-media-message-img-text"></div>
            </div>
            <div class="edit-message-confirmation-btn">
                <div id="edit-media-message-btn" class="edit-message-btn btn" onclick="editMediaMessage()">
                    <span id="edit-media-message-btn-text" class="edit-message-btn-text">Edit Message</span>
                    <img id="edit-media-message-loading" class="edit-message-loading" src="<?= ROOT_URL ?>img/Rolling-alt.svg">
                </div>
            </div>
            <div class="add-chat-loading" id="edit-message-media-loading-bar">
                <div id="edit-message-media-loading"></div>
            </div>
        </div>
        <div class="delete-message-popup" id="delete-message-popup">
            <i class="uil uil-times delete-edit-message" id="delete-edit-message" onclick="hideDeleteMessagePopup()"></i>
            <img src="<?= ROOT_URL ?>img/9004743_trash_delete_bin_remove_icon (1).png" class="delete-message-img">
            <h2 class="delete-message-title" id="delete-message-title">Delete Message</h2>
            <p class="delete-message-text" id="delete-message-text">Are You Sure That You Want To Delete This Message?</p>
            <div class="delete-message-confirmation-btn">
                <div id="cancel-delete-message-btn" class="cancel-delete-message-btn btn" onclick="hideDeleteMessagePopup()">
                    <span id="cancel-delete-message-btn-text">Cancel</span>
                </div>
                <div id="delete-message-btn" class="delete-message-btn btn" onclick="deleteMessage()">
                    <span id="delete-message-btn-text" class="delete-message-btn-text">Delete Message</span>
                    <img id="delete-message-loading" class="delete-message-loading" src="<?= ROOT_URL ?>img/Rolling-alt.svg">
                </div>
            </div>
        </div>
    </div>
    </div>
    <?php if (isset($_SESSION["user-is-admin"])) : ?>
        <div class="add-chat-screen" id="add-chat-screen">
            <div class="add-chat-popup" id="add-chat-popup">
                <i class="uil uil-times close-add-chat" id="close-add-chat" onclick="hideAddChatPopup()"></i>
                <img src="<?= ROOT_URL ?>img/9004812_chat_message_bubble_communication_icon.png" class="add-chat-img">
                <h2 class="add-chat-popup-title" id="add-chat-title">Add New Chat</h2>
                <input type="text" class="add-chat-name" id="add-chat-name" placeholder="Chat Name">
                <textarea class="add-chat-desc" id="add-chat-desc" placeholder="Chat Description"></textarea>
                <div class="add-chat-img-box">
                    <input type="file" class="add-chat-img" id="add-chat-img" onchange="changeFileName()">
                    <label for="add-chat-img" class="add-chat-img-btn">Add Chat Image</label>
                    <div class="add-chat-img-text" id="add-chat-img-text"></div>
                </div>
                <div class="add-chat-confirmation-btn">
                    <button type="button" id="add-chat-btn" class="add-chat-btn btn" onclick="createChat('<?= ROOT_URL ?>')">Create Chat</button>
                </div>
                <div class="add-chat-loading" id="add-chat-loading-bar">
                    <div id="add-chat-loading"></div>
                </div>
            </div>
        </div>
    <?php endif ?>
    <div class="mini-profile" id="mini-profile">
        <div class="mini-profile-img">
            <img src="<?= ROOT_URL ?>img/user.png" id="mini-profile-img">
        </div>
        <div class="mini-profile-info">
            <h3 class="mini-profile-name" id="mini-profile-name">Alan</h3>
            <p class="mini-profile-biography" id="mini-profile-bio">Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Autem, officiis.</p>
            <p class=" mini-profile-activity" id="mini-profile-activity">Last Activity</p>
        </div>
    </div>
    <div class="popup" id="popup">
        <img src="<?= ROOT_URL ?>img/check.png">
        <h2 id="popup-title">Thank You!</h2>
        <p id="popup-text">Your Details Has Been Successfully Submitted. Thanks!</p>
        <div class="confirmation-btn">
            <button type="button" id="ok-btn" onclick="hideConfirmMessage()">Ok</button>
        </div>
    </div>
    <div class="popup popup-error" id="popup-error">
        <img src="<?= ROOT_URL ?>img/299045_sign_error_icon.png">
        <h2 id="popup-title" class="popup-title">Thank You!</h2>
        <p id="popup-text" class="popup-text">Your Details Has Been Successfully Submitted. Thanks!</p>
        <div class="confirmation-btn">
            <button type="button" id="ok-btn" onclick="hideConfirmMessage()">Ok</button>
        </div>
    </div>
    <div class="blue-range"></div>
    <section class="chat-section section">
        <div class="chat-container container">
            <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="global-loading" id="global-loading">
            <div class="chats-list hide-user-profile hide-search-results hide-message-options" id="chats-list">
                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="search-loading" id="search-loading">

                <div class="user-content hide-user-profile hide-emojis-clips">
                    <?php if (!$isLogged) : ?>
                        <div class="user-content-box">
                            <div class="login-box">
                                <a href="<?= ROOT_URL ?>pages/signin.php"><i class="uil uil-sign-out-alt"></i></a>
                                <h4>You're not logged. <a href="<?= ROOT_URL ?>pages/signin.php">Log in</a> To Send Messages</h4>
                            </div>
                        </div>
                    <?php else : ?>
                        <div class="user-content-box">
                            <div class="user-img-box" onclick="showOwnUserProfile('<?= ROOT_URL ?>',<?= $userId ?>)">
                                <?php if ($user["avatar"] == "") : ?>
                                    <img src="<?= ROOT_URL ?>img/403024_avatar_boy_male_user_young_icon.png" class="user-img img-circle" id="user-img">
                                <?php else : ?>
                                    <img src="<?= ROOT_URL ?>admin/received-files/avatars/<?= $user["avatar"] ?>" class="user-img img-circle" id="user-img">
                                <?php endif ?>
                            </div>
                            <div class="user-info">
                                <h3 class="user-name" onclick="showOwnUserProfile('<?= ROOT_URL ?>',<?= $userId + 1 ?>)"><?= $user["name"] ?></h3>
                                <p class="user-biography" onclick="showOwnUserProfile('<?= ROOT_URL ?>',<?= $userId ?>)">
                                    <?php if (strlen($user["biography"]) > 50) : ?>
                                        <?= substr($user["biography"], 0, 50) ?>...
                                    <?php else : ?>
                                        <?= $user["biography"] ?>
                                    <?php endif ?>
                                </p>
                                <a id="logout-button" class="logout" onclick="Logout('<?= ROOT_URL ?>')"><i class="uil uil-signout"></i>Logout</a>
                            </div>
                        </div>
                    <?php endif ?>
                    <div class="search-chats">
                        <i class="uil uil-search search-icon"></i>

                        <input type="search" class="search-input" id="search-input" placeholder="Search Chats" onkeypress="searchChats('<?= ROOT_URL ?>', event)">
                        <div class="search-result-box" id="search-result-box">
                            <div class="chats search-chat" onclick="showChat()">
                                <div class="chats-img-box">
                                    <img src="<?= ROOT_URL ?>img/user.png" class="chats-img img-circle">
                                </div>
                                <div class="chats-info">
                                    <div class="chats-name-box">
                                        <h4 class="chats-name">Alan</h4>
                                    </div>
                                    <hr class="search-chats-hr hr">
                                </div>

                            </div>
                            <div class="chats search-chat" onclick="showChat()">
                                <div class="chats-img-box">
                                    <img src="<?= ROOT_URL ?>img/user.png" class="chats-img img-circle">
                                </div>
                                <div class="chats-info">
                                    <div class="chats-name-box">
                                        <h4 class="chats-name">Alan</h4>
                                    </div>
                                    <hr class="chats-hr hr">
                                </div>

                            </div>
                        </div>
                    </div>
                    <hr class="user-hr hr">
                </div>
                <?php if (isset($_SESSION["user-is-admin"])) : ?>
                    <div class="add-chat-container">
                        <h1 class="add-chat-title">Add Chat</h1>
                        <div class="add-chat-box" onclick="showAddChatPopup()">
                            <i class="uil uil-plus add-chat"></i>
                        </div>
                        <hr class="user-hr hr">
                    </div>
                <?php endif ?>
            </div>

            <div class="chat-content" id="chat-content">
                <div class="blank-content hide-user-profile hide-search-results hide-message-options" id="chat-blank">
                    <div class="chat-blank-img">
                        <img src="<?= ROOT_URL ?>img/undraw_online_messaging_re_qft3.svg">
                    </div>
                    <h1 class="chat-blank-title">Hi! Welcome To Web Chat!</h1>
                    <p class="chat-blank-paragraph">Select a group and start chatting.</p>
                </div>
                <div class="chat-header chat-content-box hide-emojis-clips hide-search-results hide-message-options" id="chat-header" onclick="showChatInfo()">
                    <div class="header-vr vr"></div>
                    <div class="back-box" id="previous-page" onclick="previousPage(0)">
                        <i class="uil uil-arrow-left back"></i>
                    </div>
                    <div class="header-content">
                        <div class="chat-img-box">
                            <img src="<?= ROOT_URL ?>img/user.png" class="chat-img img-circle" id="chat-img">
                        </div>
                        <div class="chat-info">
                            <h4 class="chat-name" id="chat-name">Alan</h4>
                            <h5 class="chat-activity" id="chat-desc">Last ativity</h5>
                        </div>
                    </div>
                </div>
                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" id="reload-loading" class="reload-loading">
                <div class="chat-messages-box hide-user-profile hide-emojis-clips hide-search-results hide-message-options chat-content-box" id="chat-messages-box">

                </div>
                <div class="chat-footer hide-user-profile hide-search-results hide-message-options chat-content-box">
                    <div class="file-send-content" id="file-send-content">

                        <div class="file-send-box">
                            <p class="file-alert" id="file-alert-1">Insert The Youtube Video URL</p>
                            <input type="url" class="file-input" id="url-file-input">
                            <button class="input-submit" onclick="insertTheImageUrl()" id="submit-1">Submit</button>
                            <button class="input-submit" onclick="insertTheVideoUrl()" id="submit-2">Submit</button>
                        </div>
                        <span>OR</span>
                        <div class="file-send-box">
                            <p class="file-alert" id="file-alert-2">Upload a Video</p>
                            <input type="file" id="file-input" name="file-input">
                            <button class="input-submit" id="submit-3">Submit</button>
                            <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="file-send-loading" id="file-box-loading">
                        </div>
                        <i class="uil uil-times close-file" id="close-file-box" onclick="closeFileSendBox()"></i>

                    </div>
                    <div class="footer-vr vr"></div>
                    <div class="emoji-content">
                        <i class="uil uil-smile emoji" id="emoji-btn">
                        </i>
                        <div class="emoji-box" id="emoji-box">
                            <ul id="emoji-list">
                            </ul>
                            <img src="<?= ROOT_URL ?>img/down-arrow.png" alt="">
                        </div>
                    </div>
                    <div class="clip-content">
                        <i class="uil uil-paperclip clip" id="clip-btn"></i>
                        <div class="clip-box" id="clip-box">
                            <ul id="clip-list">
                                <li id="img-btn"><img src="<?= ROOT_URL ?>img/1591850_instagram_photo_icon.png"></li>
                                <li id="video-btn"><img src="<?= ROOT_URL ?>img/2530844_video_movie_play_button_clip_icon.png"></li>
                            </ul>
                        </div>
                    </div>
                    <input type="text" class="message-field" id="message-field" autocomplete="off" onkeypress="sendMessageOnEnter(event)" placeholder="Show us what you have to say">
                    <div class="send-box" id="send" onclick="sendMessage('<?= ROOT_URL ?>')">
                        <div>
                            <img src="<?= ROOT_URL ?>img/Rolling-alt.svg" class="send-message-loading" id="send-message-loading">
                            <i class="uil uil-message send" id="send-message-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="profile hide-emojis-clips hide-search-results hide-message-options" id="profile-card">
                    <div class="back-box back-box-profile" id="previous-page" onclick="previousPage(1)">
                        <i class="uil uil-arrow-left back"></i>
                    </div>
                    <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="profile-loading" id="profile-loading">
                    <div class="profile-img-box">
                        <img src="<?= ROOT_URL ?>img/user.png" alt="" class="profile-img img-circle" id="profile-img">
                        <label for="update-avatar">
                            <img src="<?= ROOT_URL ?>img/9004736_image_photo_picture_gallery_icon (2).png" class="img" onclick="showInput()" id="upload-avatar">
                        </label>
                    </div>
                    <div class="update-img" id="update-img">
                        <input type="file" name="update-avatar" id="update-avatar" onchange="updateAvatarAlert()">
                        <p class="avatar-alert">Are You Sure That You Want To Change Your Avatar To <span id="avatar-name">Chat</span>? </p>
                        <div class="update-avatar-btns">
                            <i class="uil uil-times close-btn" id="close-0" onclick="closeAll()"></i>
                            <i class="uil uil-check-circle  check-btn" id="update-0" onclick="updateAvatar('<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)"></i>
                            <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-0">
                        </div>
                        <div class="progress-bar" id="progress-bar">
                            <div class="progress" id="progress"></div>
                        </div>
                    </div>
                    <h6 class="last-activity" id="last-activity">Last activity</h6>
                    <div class="profile-infos-box">
                        <div class="profile-infos profile-info-1">
                            <div class="profile-info">

                                <div class="info-img">
                                    <i class="uil uil-user info-icon"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name">Name</h4>
                                    <input type="text" class="inner-input" id="inner-input-1" name="username" placeholder="Insert Your New Username">
                                    <p class="info" id="info-1">Alan</p>
                                </div>
                            </div>
                            <div class="update-btns">
                                <i class="uil uil-edit edit-btn" id="edit-1" onclick="showInput(1)"></i>
                                <i class="uil uil-check-circle check-btn" id="update-1" onclick="updateData(1, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)"></i>
                                <i class="uil uil-times close-btn" id="close-1" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-1">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-1">


                        <div class="profile-infos profile-info-2">
                            <div class="profile-info">
                                <div class="info-img">
                                    <i class="uil uil-info-circle info-icon"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name">Biography</h4>
                                    <input type="text" class="inner-input" id="inner-input-2" name="biography" placeholder="Insert Your New Biography">
                                    <p class="info" id="info-2">Lorem ipsum dolor sit amet.</p>
                                </div>
                            </div>
                            <div class="update-btns">
                                <i class="uil uil-edit edit-btn" id="edit-2" onclick="showInput(2)"></i>
                                <i class="uil uil-check-circle  check-btn" id="update-2" onclick="updateData(2, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)""></i>
                                <i class=" uil uil-times close-btn" id="close-2" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-2">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-2">

                        <div class="profile-infos profile-info-3">
                            <div class="profile-info">

                                <div class="info-img">
                                    <i class="uil uil-calendar-alt info-icon"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name">Birth Date</h4>
                                    <input type="date" class="inner-input" id="inner-input-3" name="birth-date" placeholder="Insert Your Birth Date">
                                    <p class="info" id="info-3">02/09/2004</p>
                                </div>
                            </div>
                            <div class="update-btns">
                                <i class="uil uil-edit edit-btn" id="edit-3" onclick="showInput(3)"></i>
                                <i class="uil uil-check-circle  check-btn" id="update-3" onclick="updateData(3, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)""></i>
                                <i class=" uil uil-times close-btn" id="close-3" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-3">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-3">

                        <div class="profile-infos profile-info-4">
                            <div class="profile-info">

                                <div class="info-img">
                                    <i class="uil uil-phone info-icon"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name">Phone Number</h4>
                                    <input type="tel" class="inner-input" id="inner-input-4" name="phone-number" placeholder="Insert Your New Phone Number">
                                    <p class="info" id="info-4">9999-9999</p>
                                </div>
                            </div>
                            <div class="update-btns">
                                <i class="uil uil-edit edit-btn" id="edit-4" onclick="showInput(4)"></i>
                                <i class="uil uil-check-circle  check-btn" id="update-4" onclick="updateData(4, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)""></i>
                                <i class=" uil uil-times close-btn" id="close-4" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-4">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-4">

                        <div class="profile-infos profile-info-5">
                            <div class="profile-info">

                                <div class="info-img">
                                    <i class="uil uil-envelope info-icon" id="info-icon-5"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name" id="info-name-5">E-mail</h4>
                                    <input type="email" class="inner-input" id="inner-input-5" name="email" placeholder="Insert Your New E-mail">
                                    <p class="info" id="info-5">alan4tomaz8@gmail.com</p>
                                </div>
                            </div>
                            <div class="update-btns">

                                <i class="uil uil-edit edit-btn" id="edit-5" onclick="showInput(5)"></i>
                                <i class="uil uil-check-circle check-btn" id="update-5" onclick="updateData(5, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)""></i>
                                <i class=" uil uil-times close-btn" id="close-5" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-5">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-5">

                        <div class="profile-infos profile-info-6">
                            <div class="profile-info">

                                <div class="info-img">
                                    <i class="uil uil-location-point info-icon" id="info-icon-6"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name" id="info-name-6">Location</h4>
                                    <input type="text" class="inner-input" id="inner-input-6" name="location" placeholder="Insert Your New Location">
                                    <p class="info" id="info-6">Minas Gerais, Brasil</p>
                                </div>
                            </div>
                            <div class="update-btns">

                                <i class="uil uil-edit edit-btn" id="edit-6" onclick="showInput(6)"></i>
                                <i class="uil uil-check-circle  check-btn" id="update-6" onclick="updateData(6, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)"></i>
                                <i class="uil uil-times close-btn" id="close-6" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-6">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-6">

                        <div class="profile-infos profile-info-7">
                            <div class="profile-info">
                                <div class="info-img">
                                    <i class="uil uil-key-skeleton info-icon"></i>
                                </div>
                                <div class="profile-info-content">
                                    <h4 class="info-name">Password</h4>
                                    <input type="password" class="inner-input" id="inner-input-7" name="password" placeholder="Insert Your New Password">
                                    <p class="info" id="info-7">**********</p>
                                </div>
                            </div>
                            <div class="update-btns">
                                <i class="uil uil-edit edit-btn" id="edit-7" onclick="showInput(7)"></i>
                                <i class="uil uil-check-circle  check-btn" id="update-7" onclick="updateData(7, '<?= ROOT_URL ?>',<?= $userId ?>, <?= $isAdmin ?>)"></i>
                                <i class=" uil uil-times close-btn" id="close-7" onclick="closeAll()"></i>
                                <img src="<?= ROOT_URL ?>img/Rolling-1s-200px.svg" class="loading" id="loading-7">
                            </div>
                        </div>
                        <hr class="profile-hr hr profile-info-7">

                    </div>
                    <a class="logout-btn" id="logout-profile" onclick="Logout('<?= ROOT_URL ?>')"><i class="uil uil-signout "></i>Logout</a>

                </div>
            </div>

        </div>
        </div>
    </section>
    <!--================================ GOOGLE FONTS ================================-->
    <script src="<?= ROOT_URL ?>js/main.js"></script>
    <script src="<?= ROOT_URL ?>js/chat.js"></script>
    <script src="<?= ROOT_URL ?>js/ajax-lib.js"></script>
</body>

</html>