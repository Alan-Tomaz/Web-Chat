//Global Variables
let globalLoading = document.getElementById("global-loading");
let k = 0;
let intervals = [];
let y = -1;
let messageId = 0;
let messagesId = [];

function loadPage(id, isAdmin) {
    localStorage.setItem("userId", id);
    if (isAdmin == 1) {
        localStorage.setItem("isAdmin", isAdmin);
    } else {
        localStorage.setItem("isAdmin", undefined);
    }
}

/* ==================== LOAD THE CHATS =================== */

function loadChats(rootUrl) {
    const chatList = document.getElementById("chats-list");
    let chats = "";
    let chatsDiv;
    searchLoading.classList.add("search-loading-show");

    let atualChats = document.querySelectorAll(".channels");
    atualChats.forEach(n => n.remove());

    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
        function () {
            /* When The Request Is Done */

            /* Create The Chats */
            function loadChat(n, index) {
                if (n.chatInfo[0].img == "") {
                    var img = "img/chat-generic-img.png";
                } else {
                    var img = "admin/received-files/chat-img/" + n.chatInfo[0].img;
                }
                newChat =
                    `
                    <div class = "chats channels" onclick = "showChat('${rootUrl}',${index})" >
                    <div class = "chats-img-box">
                    <img src = "${rootUrl}${img}" class = "chats-img img-circle" id="chats-img-index">
                    </div> 
                    <div class = "chats-info" >
                    <div class = "chats-name-box" >
                    <h4 class = "chats-name">${n.chatInfo[0].name}</h4> 
                    </div> 
                    <hr class = "chats-hr hr">
                    </div> 
                    </div>
                    `
                chatList.innerHTML += newChat;
            }

            chats.forEach(loadChat);

            setTimeout(() => {

                chatsDiv = document.querySelectorAll(".channels");
                chatsDiv.forEach(n => n.classList.add("chats-show"));
                let searchLoading = document.getElementById("search-loading");
                searchLoading.classList.remove("search-loading-show");
            }, 500);
        },


        function (textResult, jsonResult) {
            console.log(textResult);
            //If error
            if (jsonResult.readChatStatus != 0) {
                switch (jsonResult.readChatStatus) {
                    case 1:
                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                }
            }
            //If success
            else {
                chats = jsonResult.allChats;
            }
        },
        function () {
            /* Case The Request can't be done */
            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
        });
}

/* ==================== GET THE AVATAR NAME FILE AND PUT ON THE INPUT =================== */

let avatarInput = document.getElementById('avatar'),
    fileName = document.getElementById('file-name');

if (avatarInput) {
    avatarInput.addEventListener('change', function () {
        fileName.value = this.files[0].name;
    });
}

/* ==================== SCROLL THE CHAT TO THE END =================== */
let chatBox = document.getElementById('chat-messages-box');
if (chatBox) {
    chatBox.scrollTop = 9999999;
}

/* ==================== SHOW AND HIDE THE PROFILE CARD =================== */
let userProfileId;
let profileCard = document.getElementById("profile-card");

let isShowing = false;

let hideUserProfile = document.querySelectorAll(".hide-user-profile");

hideUserProfile.forEach(n => n.addEventListener("click", () => {
    isShowing = false;
    setTimeout(() => {
        document.getElementById("update-avatar").value = "";
        closeAll();
        profileCard.classList.remove("profile-active-user");
        profileCard.classList.remove("profile-active");
    }, 50);
}));

let showUserProfile = document.querySelectorAll(".open-user-profile");

showUserProfile.forEach(n => n.addEventListener("click", () => {
    if (isShowing == true) {
        profileCard.classList.remove("profile-active");
        globalLoading.classList.add("global-loading-show");
        setTimeout(() => {
            profileCard.classList.add("profile-active");
            globalLoading.classList.remove("global-loading-show");
        }, 100)
    } else {
        globalLoading.classList.add("global-loading-show");
        setTimeout(() => {
            isShowing = true;
            profileCard.classList.add("profile-active");
            globalLoading.classList.remove("global-loading-show");
        }, 100);
    }
}));

function showUserProfileInnerEvent(rootUrl, id) {
    let user = 0;
    if (isShowing == true) {
        profileCard.classList.remove("profile-active");
        globalLoading.classList.add("global-loading-show");
        setTimeout(() => {

            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "user-id", id);
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

            apiPath = rootUrl + "apis/show-user-api.php";

            /* if (localStorage.getItem("isAdmin") != null || localStorage.getItem("userId") == id) {
                apiPath = rootUrl + "apis/show-user-profile-api.php";
            } */
            EasyHttpRequest.StartAsyncPostRequest(apiPath, formDataCompiled,
                function () {
                    /* When The Request Is Done */
                    hideChatInfoEditable(rootUrl, id);
                    /* Create The Chats */

                    profileCard.classList.add("profile-active");
                    globalLoading.classList.remove("global-loading-show");

                    if (localStorage.getItem("isAdmin") != 1 && localStorage.getItem("userId") != id) {
                        let logoutBtn = document.getElementById("logout-profile");
                        logoutBtn.style.display = "none";

                        let editBtns = document.querySelectorAll(".edit-btn");
                        editBtns.forEach(n => n.style.display = "none");

                        let profileNewImg = document.getElementById("upload-avatar");
                        profileNewImg.style.display = "none";


                    } else {
                        let logoutBtn = document.getElementById("logout-profile");
                        logoutBtn.style.display = "inline-block";

                        document.getElementById("logout-profile").innerHTML = '<i class="uil uil-signout "></i>Logout';
                        document.getElementById("logout-profile").setAttribute("onclick", `Logout('${rootUrl}')`);


                        let editBtns = document.querySelectorAll(".edit-btn");
                        editBtns.forEach(n => n.style.display = "inline-block");

                        let profileNewImg = document.getElementById("upload-avatar");
                        profileNewImg.style.display = "inline-block";

                        let checkBtns = document.querySelectorAll(".check-btn");
                        checkBtns.forEach(changeUpdateData);

                        function changeUpdateData(n, index) {
                            n.setAttribute("onclick", `updateData(${index}, '${rootUrl}', ${id}, ${localStorage.getItem("isAdmin")})`);
                        }
                        if (localStorage.getItem("isAdmin") == 1) {
                            if (localStorage.getItem("userId") != id) {
                                document.getElementById("logout-profile").innerHTML = 'Delete User';
                                document.getElementById("logout-profile").setAttribute("onclick", `deleteUserPopup('${rootUrl}', ${id})`);
                                document.getElementById("logout-profile").style.display = "inline-block";
                            }
                            document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}',${id}, ${localStorage.getItem("isAdmin")})`)
                        } else {
                            document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}',${id})`)
                        }
                    }





                    document.querySelectorAll(".profile-info-1").forEach(n => n.classList.remove("profile-hide"));
                    document.querySelectorAll(".profile-info-2").forEach(n => n.classList.remove("profile-hide"));
                    document.querySelectorAll(".profile-info-3").forEach(n => n.classList.remove("profile-hide"));
                    document.querySelectorAll(".profile-info-4").forEach(n => n.classList.remove("profile-hide"));
                    if (localStorage.getItem("isAdmin") != 1 && localStorage.getItem("userId") != id) {
                        document.querySelectorAll(".profile-info-7").forEach(n => n.classList.add("profile-hide"));
                    } else {
                        document.querySelectorAll(".profile-info-7").forEach(n => n.classList.remove("profile-hide"));
                    }

                    document.getElementById("info-icon-5").className = "uil uil-envelope info-icon";
                    document.getElementById("info-name-5").innerHTML = "Email:";

                    document.getElementById("info-icon-6").className = "uil uil-location-point info-icon";
                    document.getElementById("info-name-6").innerHTML = "Location:";



                },


                function (textResult, jsonResult) {
                    console.log(textResult);
                    //If error
                    if (jsonResult.showUserStatus != 0) {
                        switch (jsonResult.showUserStatus) {
                            case 1:
                            case 2:
                                ShowPopUpDialog("popup-error", "Error!", "User Don't Exists");

                                let userInfo1 = document.getElementById("info-1");
                                userInfo1.innerHTML = "None";
                                let userInfo2 = document.getElementById("info-2");
                                userInfo2.innerHTML = "None";
                                let userInfo3 = document.getElementById("info-3");
                                userInfo3.innerHTML = "None";
                                let userInfo4 = document.getElementById("info-4");
                                userInfo4.innerHTML = "None";
                                let userInfo5 = document.getElementById("info-5");
                                userInfo5.innerHTML = "None";
                                let userInfo6 = document.getElementById("info-6");
                                userInfo6.innerHTML = "None";
                                let profileImg = document.getElementById("profile-img");
                                /* put a common avatar img for users that don't have a specified avatar*/
                                profileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";



                                let lastActivity = document.getElementById("last-activity");
                                lastActivity.innerHTML = "None";

                                break;
                        }
                    }
                    //If success
                    else {
                        user = jsonResult;
                        /* Get the user data and put on the elements */
                        let userInfo1 = document.getElementById("info-1");
                        userInfo1.innerHTML = jsonResult.name;
                        let userInfo2 = document.getElementById("info-2");
                        userInfo2.innerHTML = jsonResult.biography;
                        let userInfo3 = document.getElementById("info-3");
                        userInfo3.innerHTML = jsonResult.birthDate;
                        let userInfo4 = document.getElementById("info-4");
                        userInfo4.innerHTML = jsonResult.phoneNumber;
                        let userInfo5 = document.getElementById("info-5");
                        userInfo5.innerHTML = jsonResult.email;
                        let userInfo6 = document.getElementById("info-6");
                        userInfo6.innerHTML = jsonResult.location;
                        let profileImg = document.getElementById("profile-img");
                        /* put a common avatar img for users that don't have a specified avatar*/
                        if (jsonResult.avatar == "") {
                            profileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";
                        } else {
                            profileImg.src = rootUrl + "admin/received-files/avatars/" + jsonResult.avatar;
                        }
                        let lastActivity = document.getElementById("last-activity");
                        lastActivity.innerHTML = jsonResult.lastActivity;
                        /* Format the last activity */

                    }
                },
                function () {
                    /* Case The Request can't be done */
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });
        }, 100)
    } else {
        globalLoading.classList.add("global-loading-show");
        setTimeout(() => {
            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "user-id", id);
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

            apiPath = rootUrl + "apis/show-user-api.php";

            /* if (localStorage.getItem("isAdmin") != null || localStorage.getItem("userId") == id) {
                apiPath = rootUrl + "apis/show-user-profile-api.php";
            } */
            EasyHttpRequest.StartAsyncPostRequest(apiPath, formDataCompiled,
                function () {
                    /* When The Request Is Done */
                    hideChatInfoEditable(rootUrl, id)
                    /* Create The Chats */

                    isShowing = true;
                    profileCard.classList.add("profile-active");
                    globalLoading.classList.remove("global-loading-show");

                    if (localStorage.getItem("isAdmin") != 1 && localStorage.getItem("userId") != id) {
                        let logoutBtn = document.getElementById("logout-profile");
                        logoutBtn.style.display = "none";

                        let editBtns = document.querySelectorAll(".edit-btn");
                        editBtns.forEach(n => n.style.display = "none");

                        let profileNewImg = document.getElementById("upload-avatar");
                        profileNewImg.style.display = "none";


                    } else {
                        let logoutBtn = document.getElementById("logout-profile");
                        logoutBtn.style.display = "inline-block";

                        document.getElementById("logout-profile").innerHTML = '<i class="uil uil-signout "></i>Logout';
                        document.getElementById("logout-profile").setAttribute("onclick", `Logout('${rootUrl}')`);

                        let editBtns = document.querySelectorAll(".edit-btn");
                        editBtns.forEach(n => n.style.display = "inline-block");

                        let profileNewImg = document.getElementById("upload-avatar");
                        profileNewImg.style.display = "inline-block";

                        let checkBtns = document.querySelectorAll(".check-btn");
                        checkBtns.forEach(changeUpdateData);

                        function changeUpdateData(n, index) {
                            n.setAttribute("onclick", `updateData(${index}, '${rootUrl}', ${id}, ${localStorage.getItem("isAdmin")})`);
                        }
                        if (localStorage.getItem("isAdmin") == 1) {
                            document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}',${id}, ${localStorage.getItem("isAdmin")})`)
                            if (localStorage.getItem("userId") != id) {
                                document.getElementById("logout-profile").innerHTML = 'Delete User';
                                document.getElementById("logout-profile").setAttribute("onclick", `deleteUserPopup('${rootUrl}', ${id})`);
                                document.getElementById("logout-profile").style.display = "inline-block";
                            }
                        } else {
                            document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}',${id})`)
                        }
                    }







                    document.querySelectorAll(".profile-info-1").forEach(n => n.classList.remove("profile-hide"));
                    document.querySelectorAll(".profile-info-2").forEach(n => n.classList.remove("profile-hide"));
                    document.querySelectorAll(".profile-info-3").forEach(n => n.classList.remove("profile-hide"));
                    document.querySelectorAll(".profile-info-4").forEach(n => n.classList.remove("profile-hide"));
                    if (localStorage.getItem("isAdmin") != 1 && localStorage.getItem("userId") != id) {
                        document.querySelectorAll(".profile-info-7").forEach(n => n.classList.add("profile-hide"));
                    } else {
                        document.querySelectorAll(".profile-info-7").forEach(n => n.classList.remove("profile-hide"));
                    }

                    document.getElementById("info-icon-5").className = "uil uil-envelope info-icon";
                    document.getElementById("info-name-5").innerHTML = "Email:";

                    document.getElementById("info-icon-6").className = "uil uil-location-point info-icon";
                    document.getElementById("info-name-6").innerHTML = "Location:";



                },


                function (textResult, jsonResult) {
                    console.log(textResult);
                    //If error
                    if (jsonResult.showUserStatus != 0) {
                        switch (jsonResult.showUserStatus) {
                            case 1:
                            case 2:
                                ShowPopUpDialog("popup-error", "Error!", "User Don't Exists");

                                let userInfo1 = document.getElementById("info-1");
                                userInfo1.innerHTML = "None";
                                let userInfo2 = document.getElementById("info-2");
                                userInfo2.innerHTML = "None";
                                let userInfo3 = document.getElementById("info-3");
                                userInfo3.innerHTML = "None";
                                let userInfo4 = document.getElementById("info-4");
                                userInfo4.innerHTML = "None";
                                let userInfo5 = document.getElementById("info-5");
                                userInfo5.innerHTML = "None";
                                let userInfo6 = document.getElementById("info-6");
                                userInfo6.innerHTML = "None";
                                let profileImg = document.getElementById("profile-img");
                                /* put a common avatar img for users that don't have a specified avatar*/
                                profileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";



                                let lastActivity = document.getElementById("last-activity");
                                lastActivity.innerHTML = "None";

                                break;
                        }
                    }
                    //If success
                    else {
                        user = jsonResult;
                        /* Get the user data and put on the elements */
                        let userInfo1 = document.getElementById("info-1");
                        userInfo1.innerHTML = jsonResult.name;
                        let userInfo2 = document.getElementById("info-2");
                        userInfo2.innerHTML = jsonResult.biography;
                        let userInfo3 = document.getElementById("info-3");
                        userInfo3.innerHTML = jsonResult.birthDate;
                        let userInfo4 = document.getElementById("info-4");
                        userInfo4.innerHTML = jsonResult.phoneNumber;
                        let userInfo5 = document.getElementById("info-5");
                        userInfo5.innerHTML = jsonResult.email;
                        let userInfo6 = document.getElementById("info-6");
                        userInfo6.innerHTML = jsonResult.location;
                        let profileImg = document.getElementById("profile-img");
                        /* put a common avatar img for users that don't have a specified avatar*/
                        if (jsonResult.avatar == "") {
                            profileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";
                        } else {
                            profileImg.src = rootUrl + "admin/received-files/avatars/" + jsonResult.avatar;
                        }
                        let lastActivity = document.getElementById("last-activity");
                        lastActivity.innerHTML = jsonResult.lastActivity;
                        /* Format the last activity */

                    }
                },
                function () {
                    /* Case The Request can't be done */
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });
        }, 100);
    }
}

function showOwnUserProfile(rootUrl, userId) {
    let isRequesting = false;
    if (isRequesting == false) {
        userProfileId = userId;
        if (isShowing == true) {

            setTimeout(() => {
                isShowing = true;
            }, 40);
            //Create the FormData
            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "user-id", userId);
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

            profileCard.classList.remove("profile-active-user");
            profileCard.classList.remove("profile-active");
            globalLoading.classList.add("global-loading-show");

            isRequesting = true;
            setTimeout(() => {
                EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/show-user-profile-api.php", formDataCompiled,
                    function () {
                        hideChatInfoEditable(rootUrl, userId)

                        isRequesting = false;
                        profileCard.classList.add("profile-active");
                        profileCard.classList.add("profile-active-user");
                        globalLoading.classList.remove("global-loading-show");

                        document.querySelectorAll(".profile-info-1").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-2").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-3").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-4").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-7").forEach(n => n.classList.remove("profile-hide"));

                        document.getElementById("info-icon-5").className = "uil uil-envelope info-icon";
                        document.getElementById("info-name-5").innerHTML = "Email:";

                        document.getElementById("info-icon-6").className = "uil uil-location-point info-icon";
                        document.getElementById("info-name-6").innerHTML = "Location:";
                    },
                    function (textResult, jsonResult) {
                        console.log(textResult);
                        //If error
                        if (jsonResult.showUserStatus != 0) {

                            switch (jsonResult.showUserStatus) {
                                case 1:
                                case 2:
                                    ShowPopUpDialog("popup-error", "Error!", "User Don't Exists");
                                    break;
                            }
                        }
                        //If success
                        else {
                            /* Get the user data and put on the elements */
                            let userInfo1 = document.getElementById("info-1");
                            userInfo1.innerHTML = jsonResult.name;
                            let userInfo2 = document.getElementById("info-2");
                            userInfo2.innerHTML = jsonResult.biography;
                            let userInfo3 = document.getElementById("info-3");
                            userInfo3.innerHTML = jsonResult.birthDate;
                            let userInfo4 = document.getElementById("info-4");
                            userInfo4.innerHTML = jsonResult.phoneNumber;
                            let userInfo5 = document.getElementById("info-5");
                            userInfo5.innerHTML = jsonResult.email;
                            let userInfo6 = document.getElementById("info-6");
                            userInfo6.innerHTML = jsonResult.location;
                            let profileImg = document.getElementById("profile-img");
                            /* put a common avatar img for users that don't have a specified avatar*/
                            if (jsonResult.avatar == "") {
                                profileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";
                            } else {
                                profileImg.src = rootUrl + "admin/received-files/avatars/" + jsonResult.avatar;
                            }
                            let lastActivity = document.getElementById("last-activity");
                            lastActivity.innerHTML = jsonResult.lastActivity;
                            /* Format the last activity */

                            const logoutBtn = document.getElementById("logout-profile");
                            logoutBtn.style.display = "inline-block";

                            document.getElementById("logout-profile").innerHTML = '<i class="uil uil-signout "></i>Logout';
                            document.getElementById("logout-profile").setAttribute("onclick", `Logout('${rootUrl}')`);

                            const editBtns = document.querySelectorAll(".edit-btn");
                            editBtns.forEach(n => n.style.display = "inline-block");

                            const profileNewImg = document.getElementById("upload-avatar");
                            profileNewImg.style.display = "inline-block";
                        }
                    },
                    function () {
                        ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                    });

            }, 100)
        } else {
            /* A request can only be done if is not a pending request */
            //Create the FormData
            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "user-id", userId);
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

            //Change the UI
            globalLoading.classList.add("global-loading-show");

            isRequesting = true;
            setTimeout(() => {
                EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/show-user-profile-api.php", formDataCompiled,
                    function () {

                        hideChatInfoEditable(rootUrl, userId)

                        isRequesting = false;
                        isShowing = true;
                        profileCard.classList.add("profile-active");
                        profileCard.classList.add("profile-active-user");
                        globalLoading.classList.remove("global-loading-show");
                        document.querySelectorAll(".profile-info-1").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-2").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-3").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-4").forEach(n => n.classList.remove("profile-hide"));
                        document.querySelectorAll(".profile-info-7").forEach(n => n.classList.remove("profile-hide"));

                        document.getElementById("info-icon-5").className = "uil uil-envelope info-icon";
                        document.getElementById("info-name-5").innerHTML = "Email:";

                        document.getElementById("info-icon-6").className = "uil uil-location-point info-icon";
                        document.getElementById("info-name-6").innerHTML = "Location:";
                    },
                    function (textResult, jsonResult) {
                        console.log(textResult);
                        //If error
                        if (jsonResult.showUserStatus != 0) {

                            switch (jsonResult.showUserStatus) {
                                case 1:
                                case 2:
                                    ShowPopUpDialog("popup-error", "Error!", "User Don't Exists");
                                    break;
                            }
                        }
                        //If success
                        else {
                            /* Get the user data and put on the elements */
                            let userInfo1 = document.getElementById("info-1");
                            userInfo1.innerHTML = jsonResult.name;
                            let userInfo2 = document.getElementById("info-2");
                            userInfo2.innerHTML = jsonResult.biography;
                            let userInfo3 = document.getElementById("info-3");
                            userInfo3.innerHTML = jsonResult.birthDate;
                            let userInfo4 = document.getElementById("info-4");
                            userInfo4.innerHTML = jsonResult.phoneNumber;
                            let userInfo5 = document.getElementById("info-5");
                            userInfo5.innerHTML = jsonResult.email;
                            let userInfo6 = document.getElementById("info-6");
                            userInfo6.innerHTML = jsonResult.location;
                            let profileImg = document.getElementById("profile-img");
                            /* put a common avatar img for users that don't have a specified avatar*/
                            if (jsonResult.avatar == "") {
                                profileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";
                            } else {
                                profileImg.src = rootUrl + "admin/received-files/avatars/" + jsonResult.avatar;
                            }
                            let lastActivity = document.getElementById("last-activity");
                            lastActivity.innerHTML = jsonResult.lastActivity;
                            /* Format the last activity */

                            const logoutBtn = document.getElementById("logout-profile");
                            logoutBtn.style.display = "inline-block";

                            document.getElementById("logout-profile").innerHTML = '<i class="uil uil-signout "></i>Logout';
                            document.getElementById("logout-profile").setAttribute("onclick", `Logout('${rootUrl}')`);

                            const editBtns = document.querySelectorAll(".edit-btn");
                            editBtns.forEach(n => n.style.display = "inline-block");

                            const profileNewImg = document.getElementById("upload-avatar");
                            profileNewImg.style.display = "inline-block";
                        }
                    },
                    function () {
                        ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                    });
            }, 100);

        }
    }
}

//SHOW WHEN THE HEADER IS CLICKED
let chatHeader = document.getElementById("chat-header")
let isClickedInBackIcon = false;

function showChatInfo(rootUrl, chatId) {
    setTimeout(() => {
        if (isClickedInBackIcon == false) {
            chatHeader.classList.add("chat-header-show-profile");
            setTimeout(() => {
                chatHeader.classList.remove("chat-header-show-profile");
            }, 100);
            if (isShowing == true) {
                profileCard.classList.remove("profile-active");
                globalLoading.classList.add("global-loading-show");
                setTimeout(() => {
                    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
                        function () {

                            /* When The Request Is Done */


                            /* Create The Chats */

                            document.querySelectorAll(".profile-info-1").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-2").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-3").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-4").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-7").forEach(n => n.classList.add("profile-hide"));
                            if (chats.chatInfo[0].img == "") {
                                document.getElementById("profile-img").src = rootUrl + "img/" + "chat-generic-img.png";
                            } else {
                                document.getElementById("profile-img").src = rootUrl + "admin/received-files/chat-img/" + chats.chatInfo[0].img;
                            }


                            document.getElementById("last-activity").innerHTML = "Created In " + chats.chatInfo[0].creationDate;
                            document.getElementById("info-icon-5").className = "uil uil-chat info-icon";
                            document.getElementById("info-name-5").innerHTML = "Chat Name:";
                            document.getElementById("info-5").innerHTML = chats.chatInfo[0].name;
                            document.getElementById("info-icon-6").className = "uil uil-file-alt info-icon";
                            document.getElementById("info-name-6").innerHTML = "Description:";
                            document.getElementById("info-6").innerHTML = chats.chatInfo[0].description;


                            document.getElementById("logout-profile").style.display = "none";

                            document.querySelectorAll(".edit-btn").forEach(n => n.style.display = "none");


                            document.getElementById("upload-avatar").style.display = "none";

                            if (localStorage.getItem("isAdmin") == 1) {
                                showChatInfoEditable(rootUrl, chatId);
                                document.getElementById("edit-5").style.display = "inline-block";
                                document.getElementById("edit-6").style.display = "inline-block";
                                document.getElementById("upload-avatar").style.display = "inline-block";
                                document.getElementById("logout-profile").style.display = "inline-block";
                            }
                            setTimeout(() => {
                                isShowing = true;
                                profileCard.classList.add("profile-active");
                                globalLoading.classList.remove("global-loading-show");



                            }, 100);
                        },
                        function (textResult, jsonResult) {

                            console.log(textResult);

                            //If error
                            if (jsonResult.readChatStatus != 0) {
                                switch (jsonResult.readChatStatus) {
                                    case 1:
                                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                                }
                            }
                            //If success
                            else {

                                chats = jsonResult.allChats[chatId];


                            }
                        },
                        function () {
                            /* Case The Request can't be done */
                            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                        });

                }, 100)
            } else {
                globalLoading.classList.add("global-loading-show");
                setTimeout(() => {

                    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
                        function () {

                            /* When The Request Is Done */


                            /* Create The Chats */

                            document.querySelectorAll(".profile-info-1").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-2").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-3").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-4").forEach(n => n.classList.add("profile-hide"));
                            document.querySelectorAll(".profile-info-7").forEach(n => n.classList.add("profile-hide"));
                            if (chats.chatInfo[0].img == "") {
                                document.getElementById("profile-img").src = rootUrl + "img/" + "chat-generic-img.png";
                            } else {
                                document.getElementById("profile-img").src = rootUrl + "admin/received-files/chat-img/" + chats.chatInfo[0].img;
                            }


                            document.getElementById("last-activity").innerHTML = "Created In " + chats.chatInfo[0].creationDate;
                            document.getElementById("info-icon-5").className = "uil uil-chat info-icon";
                            document.getElementById("info-name-5").innerHTML = "Chat Name:";
                            document.getElementById("info-5").innerHTML = chats.chatInfo[0].name;
                            document.getElementById("info-icon-6").className = "uil uil-file-alt info-icon";
                            document.getElementById("info-name-6").innerHTML = "Description:";
                            document.getElementById("info-6").innerHTML = chats.chatInfo[0].description;

                            document.getElementById("logout-profile").style.display = "none";

                            document.querySelectorAll(".edit-btn").forEach(n => n.style.display = "none");


                            document.getElementById("upload-avatar").style.display = "none";
                            if (localStorage.getItem("isAdmin") == 1) {
                                showChatInfoEditable(rootUrl, chatId);
                                document.getElementById("edit-5").style.display = "inline-block";
                                document.getElementById("edit-6").style.display = "inline-block";
                                document.getElementById("upload-avatar").style.display = "inline-block";
                                document.getElementById("logout-profile").style.display = "inline-block";

                            }

                            setTimeout(() => {


                                isShowing = true;
                                profileCard.classList.add("profile-active");
                                globalLoading.classList.remove("global-loading-show");



                            }, 100);
                        },
                        function (textResult, jsonResult) {

                            console.log(textResult);

                            //If error
                            if (jsonResult.readChatStatus != 0) {
                                switch (jsonResult.readChatStatus) {
                                    case 1:
                                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                                }
                            }
                            //If success
                            else {

                                chats = jsonResult.allChats[chatId];


                            }
                        },
                        function () {
                            /* Case The Request can't be done */
                            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                        });
                }, 100);
            }
        }
    }, 50);
}

/* Show Chat Edit Content if Is Admin */
function showChatInfoEditable(rootUrl, chatId) {
    document.getElementsByName("email")[0].placeholder = "Insert The New Chat Name";
    document.getElementsByName("location")[0].placeholder = "Insert The New Chat Description";
    document.getElementById("update-0").setAttribute("onclick", `updateChatInfo(0,'${rootUrl}', ${chatId})`);
    document.getElementById("update-5").setAttribute("onclick", `updateChatInfo(5,'${rootUrl}', ${chatId})`);
    document.getElementById("update-6").setAttribute("onclick", `updateChatInfo(6,'${rootUrl}', ${chatId})`);
    document.getElementById("logout-profile").innerHTML = "Delete Chat";
    document.getElementById("logout-profile").setAttribute("onclick", `deleteChatPopup('${rootUrl}', ${chatId})`);
}

/* Hide ChatInfo */
function hideChatInfoEditable(rootUrl, id) {
    document.getElementsByName("email")[0].placeholder = "Insert Your New Email";
    document.getElementsByName("location")[0].placeholder = "Insert Your New Location";
    document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}', ${id})`);
    document.getElementById("update-5").setAttribute("onclick", `updateData(5,'${rootUrl}', ${id})`);
    document.getElementById("update-6").setAttribute("onclick", `updateData(6,'${rootUrl}', ${id})`);
    document.getElementById("logout-profile").innerHTML = '<i class="uil uil-signout "></i>Logout';
    document.getElementById("logout-profile").setAttribute("onclick", `Logout('${rootUrl}')`);
}

/* ==================== SHOW AND HIDE THE INNER INPUT =================== */
let isRunning = false;

function showInput(id) {
    if (isRunning != true) {
        let hideOtherInputs = document.querySelectorAll(".inner-input");
        let = showInfos = document.querySelectorAll(".info")
        hideOtherInputs.forEach(n => n.style.display = "none");
        showInfos.forEach(n => n.style.display = "inline-block");
        let hideCheckBtns = document.querySelectorAll(".check-btn");
        hideCheckBtns.forEach(n => n.style.display = "none");
        let = showEditBtns = document.querySelectorAll(".edit-btn");
        showEditBtns.forEach(n => n.style.display = "inline-block");
        let = hideCloseBtns = document.querySelectorAll(".close-btn");
        hideCloseBtns.forEach(n => n.style.display = "none");
        let updateImg = document.getElementById("update-img")

        updateImg.style.display = "none";

        if (id) {
            let closeBtn = document.getElementById("close-" + id)
            let editBtn = document.getElementById("edit-" + id);
            let input = document.getElementById("inner-input-" + id);
            let info = document.getElementById("info-" + id);
            let checkBtn = document.getElementById("update-" + id);
            closeBtn.style.display = "inline-block";
            info.style.display = "none";
            input.style.display = "inline-block";
            checkBtn.style.display = "inline-block";
            editBtn.style.display = "none";
        }
    }
}

/* ==================== UPDATE AVATAR ALERT=================== */
let updateInput = document.getElementById('update-avatar');

function updateAvatarAlert() {
    if (updateInput.value != "" && isRunning == false) {
        fileName = document.getElementById("avatar-name");

        fileName.innerHTML = updateInput.files[0].name;
        let updateImg = document.getElementById("update-img")
        updateImg.style.display = "flex";
        let closeBtn = document.getElementById("close-0");
        let checkBtn = document.getElementById("update-0");
        closeBtn.style.display = "inline-block";
        checkBtn.style.display = "inline-block";
    }
}

/* ==================== UPDATE AVATAR =================== */

function updateAvatar(rootUrl, userId, isAdmin) {
    if (updateInput.value != "") {
        let closeBtn = document.getElementById("close-0");
        let updateImg = document.getElementById("update-img")
        let checkBtn = document.getElementById("update-0");
        let loading = document.getElementById("loading-0");
        let progressBar = document.getElementById("progress-bar");
        let actualProgress = document.getElementById("progress");
        actualProgress.style.width = "0%";
        checkBtn.style.display = "none";
        closeBtn.style.display = "none";
        loading.style.display = "inline-block";
        isRunning = true;
        console.log(isAdmin);
        if (userProfileId == userId || isAdmin != undefined) {
            setTimeout(() => {
                let avatarName;
                progressBar.classList.add("progress-bar-active");

                var formData = EasyHttpRequest.InstantiateFormData();
                EasyHttpRequest.AddField(formData, "user-id", userId);
                /*                 var formDataCompiled = EasyHttpRequest.BuildFormData(formData);
                 */
                EasyHttpRequest.StartAsyncFileUpload(rootUrl + "apis/edit-user-api.php", "update-avatar", 0, "avatar", formData,
                    function () {
                        setTimeout(() => {
                            updateImg.style.display = "none";
                            loading.style.display = "none";
                            isRunning = false;
                            progressBar.classList.remove("progress-bar-active");
                            updateImgs(avatarName, rootUrl, userId);
                        }, 1000);
                    },
                    /* Progress Back */
                    function (progress, totalProgress) {
                        actualProgress.style.width = progress + "%";
                    },
                    function (textResult, jsonResult) {
                        console.log(textResult);
                        //If error
                        if (jsonResult.editUserStatus != 0) {
                            switch (jsonResult.editUserStatus) {
                                case 1:
                                    ShowPopUpDialog("popup-error", "Error!", "The formulary have empty fields. Please, fill all fields of formulary!");
                                    break;
                                case 2:
                                    ShowPopUpDialog("popup-error", "Error!", "The Email Format Is Wrong!");
                                    break;
                                case 3:
                                    ShowPopUpDialog("popup-error", "Error!", "The Phone Number Format Is Wrong!");
                                    break;
                                case 4:
                                    ShowPopUpDialog("popup-error", "Error!", "Your Birth Date Format is Wrong!");
                                    break;
                                case 5:
                                    ShowPopUpDialog("popup-error", "Error!", "Your Password is Too Short!");
                                    break;
                                case 6:
                                    ShowPopUpDialog("popup-error", "Error!", "Your password does not meet our complexity requirements. The password must have at least 8 characters, and at least one lowercase letter, one uppercase letter, one number and one special character");
                                    break;
                                case 7:
                                    ShowPopUpDialog("popup-error", "Error!", "This Email Already Exists!");
                                    break;
                                case 8:
                                    ShowPopUpDialog("popup-error", "Error!", "You Don't have permission to do this");
                                    break;
                                case 9:
                                    ShowPopUpDialog("popup-error", "Error!", "This User Don't Exists");
                                    break;
                                case 10:
                                    ShowPopUpDialog("popup-error", "Error!", "File Too Big");
                                    break;
                                case 11:
                                    ShowPopUpDialog("popup-error", "Error!", "Extension Not Supported");
                                    break;
                                case 12:
                                    ShowPopUpDialog("popup-error", "Error!", "Directory Not Found");
                                    break;
                            }
                        }
                        //If success
                        else {
                            ShowPopUpDialog("popup", "Update Avatar", "Avatar Succesfully Updated");
                            avatarName = jsonResult.avatarName;
                        }
                    },
                    function () {
                        ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                    });
            }, 1000);
        } else {
            ShowPopUpDialog("popup-error", "Error", "You don't have permission for this")
        }
    }
}

/* UPDATE IMAGES FUNCTION */
function updateImgs(avatarName, rootUrl, userId) {

    let profileImg = document.getElementById("profile-img");
    if (userId == localStorage.getItem("userId")) {
        let userImg = document.getElementById("user-img");
        userImg.src = rootUrl + "admin/received-files/avatars/" + avatarName;
    }
    profileImg.src = rootUrl + "admin/received-files/avatars/" + avatarName;

}

/* ==================== UPDATE DATA =================== */
function updateData(id, rootUrl, userId, isAdmin) {
    let input = document.getElementById("inner-input-" + id);
    let editBtn = document.getElementById("edit-" + id);
    let info = document.getElementById("info-" + id);
    let checkBtn = document.getElementById("update-" + id);
    let loading = document.getElementById("loading-" + id);
    let hideCloseBtns = document.querySelectorAll(".close-btn");
    hideCloseBtns.forEach(n => n.style.display = "none");
    checkBtn.style.display = "none";
    input.disabled = true;
    loading.style.display = "inline-block";
    isRunning = true;
    if (userProfileId == userId || isAdmin != undefined) {
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "user-id", userId);
        EasyHttpRequest.AddField(formData, `${input.name}`, input.value);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        isRequesting = true;
        setTimeout(() => {
            EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/edit-user-api.php", formDataCompiled,
                function () {
                    info.style.display = "inline-block";
                    input.disabled = false;
                    input.style.display = "none";
                    editBtn.style.display = "inline-block";
                    loading.style.display = "none";
                    isRunning = false;
                },
                function (textResult, jsonResult) {
                    console.log(textResult);
                    //If error
                    if (jsonResult.editUserStatus != 0) {
                        switch (jsonResult.editUserStatus) {
                            case 1:
                                ShowPopUpDialog("popup-error", "Error!", "The formulary have empty fields. Please, fill all fields of formulary!");
                                break;
                            case 2:
                                ShowPopUpDialog("popup-error", "Error!", "The Email Format Is Wrong!");
                                break;
                            case 3:
                                ShowPopUpDialog("popup-error", "Error!", "The Phone Number Format Is Wrong!");
                                break;
                            case 4:
                                ShowPopUpDialog("popup-error", "Error!", "Your Birth Date Format is Wrong!");
                                break;
                            case 5:
                                ShowPopUpDialog("popup-error", "Error!", "Your Password is Too Short!");
                                break;
                            case 6:
                                ShowPopUpDialog("popup-error", "Error!", "Your password does not meet our complexity requirements. The password must have at least 8 characters, and at least one lowercase letter, one uppercase letter, one number and one special character");
                                break;
                            case 7:
                                ShowPopUpDialog("popup-error", "Error!", "This Email Already Exists!");
                                break;
                            case 8:
                                ShowPopUpDialog("popup-error", "Error!", "You Don't have permission to do this");
                                break;
                            case 9:
                                ShowPopUpDialog("popup-error", "Error!", "This User Don't Exists");
                                break;
                            case 10:
                                ShowPopUpDialog("popup-error", "Error!", "File Too Big");
                                break;
                            case 11:
                                ShowPopUpDialog("popup-error", "Error!", "Extension Not Supported");
                                break;
                            case 12:
                                ShowPopUpDialog("popup-error", "Error!", "Directory Not Found");
                                break;
                        }
                    }
                    //If success
                    else {
                        ShowPopUpDialog("popup", "Update Data", "Data Succesfully Updated");
                        if (info != document.getElementById("info-" + 7)) {
                            info.innerHTML = input.value;
                        }
                        if (info == document.getElementById("info-" + 3)) {
                            newBirthInputValue = input.value.split("-")
                            newBirthInputValue = newBirthInputValue[2] + "/" + newBirthInputValue[1] + "/" + newBirthInputValue[0];
                            info.innerHTML = newBirthInputValue;
                        }
                    }
                },
                function () {
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });
        }, 1000);
    } else {
        ShowPopUpDialog("popup-error", "Error", "You don't have permission for this")
    }

}

/* ==================== DELETE USER =================== */
function deleteUserPopup(rootUrl, userId) {
    let deleteScreen = document.getElementById("delete-screen");
    let deleteUserPopup = document.getElementById("delete-popup");
    let deletePopupTitle = document.getElementById("delete-popup-title");
    let deletePopupText = document.getElementById("delete-popup-text");
    let deletePopupBtn = document.getElementById("delete-popup-btn-text");
    if (localStorage.getItem("isAdmin") != undefined) {
        deletePopupText.innerHTML = "Are You Sure That You Want To Delete This User?";
        deletePopupTitle.innerHTML = "Delete User";
        deletePopupBtn.innerHTML = "Delete User";
        deleteScreen.style.display = "flex";
        deleteUserPopup.style.display = "flex";
        document.getElementById("delete-popup-btn").setAttribute("onclick", `deleteUser('${rootUrl}', ${userId})`)
        setTimeout(() => {
            deleteScreen.classList.add("delete-screen-show");
            deleteUserPopup.classList.add("delete-popup-show");
        }, 10);
    } else {
        ShowPopUpDialog("popup-error", "Error", "You don't have permission for this");
    }
}

/* hide delete user popup */
function hideDeletePopup() {
    let deleteScreen = document.getElementById("delete-screen");
    let deleteUserPopup = document.getElementById("delete-popup");
    deleteScreen.classList.remove("delete-screen-show");
    deleteUserPopup.classList.remove("delete-popup-show");
    setTimeout(() => {
        deleteScreen.style.display = "none";
        deleteUserPopup.style.display = "none";
    }, 1100);

}

function deleteUser(rootUrl, userId) {
    if (localStorage.getItem("isAdmin") != undefined) {
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "user-id", userId);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/delete-user-api.php", formDataCompiled,
            function () {

            },
            function (textResult, jsonResult) {
                console.log(textResult);
                //If error
                if (jsonResult.deleteUserStatus != 0) {
                    switch (jsonResult.deleteUserStatus) {
                        case 1:
                            ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
                            break;
                        case 2:
                            ShowAlert("alert-bar", "Error", "Error", "Error");
                            break;
                        case 3:
                            ShowAlert("alert-bar", "Error", "Error", "This User Dont Exists");
                            break;
                        case 4:
                            ShowAlert("alert-bar", "Error", "Error", "Directory Non-existent");
                            break;
                    }
                }
                //If success
                else {
                    hideDeletePopup();
                    ShowAlert("alert-bar", "Success", "Success", "User Successfully Deleted");
                }
            },
            function () {
                ShowAlert("alert-bar", "Error", "Error", "There's an error, please try again later");
            });
    } else {
        ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
    }
}

/* ==================== CLOSE BTN =================== */
function closeAll() {
    if (isRunning != true) {
        let hideOtherInputs = document.querySelectorAll(".inner-input");
        let = showInfos = document.querySelectorAll(".info")
        hideOtherInputs.forEach(n => n.style.display = "none");
        showInfos.forEach(n => n.style.display = "inline-block");
        let hideCheckBtns = document.querySelectorAll(".check-btn");
        hideCheckBtns.forEach(n => n.style.display = "none");
        let = showEditBtns = document.querySelectorAll(".edit-btn")
        showEditBtns.forEach(n => n.style.display = "inline-block");
        let updateImg = document.getElementById("update-img")
        let loading = document.getElementById("loading-0");
        let hideCloseBtns = document.querySelectorAll(".close-btn");
        hideCloseBtns.forEach(n => n.style.display = "none");

        updateImg.style.display = "none";
        loading.style.display = "none";
    }
}

/* ==================== PHONE NUMBER IMPUT FORMATATION =================== */
const phoneNumberInput = document.getElementById("inner-input-4");

/*  
 * Phone number formatting when the key is pressioned on the imput
 */
phoneNumberInput.addEventListener("keydown", () => {
    // phone number input

    /* 
     * assoc the formatting function to a const and later define the value of input as this const
     */
    const formattedInputValue = formatPhoneNumber(phoneNumberInput.value);
    phoneNumberInput.value = formattedInputValue;
})

function formatPhoneNumber(value) {
    if (!value)
        return value;
    const phoneNumberInput = value.replace(/[^\d]/g, ''),
        phoneNumberLength = phoneNumberInput.length;
    if (phoneNumberLength < 3)
        return phoneNumberInput;
    if (phoneNumberLength < 4) {
        return `(${phoneNumberInput.slice(0, 2)}) ${phoneNumberInput.slice(2,3)}`;
    }
    if (phoneNumberLength < 8) {
        return `(${phoneNumberInput.slice(0, 2)}) ${phoneNumberInput.slice(2,3)} ${phoneNumberInput.slice(3)}`;
    }
    return `(${phoneNumberInput.slice(0,2)}) ${phoneNumberInput.slice(2,3)} ${phoneNumberInput.slice(3,7)}-${phoneNumberInput.slice(7,10)}`
}

/* ==================== SHOW AND HIDE EMOJIS BOX=================== */
let emoji = document.getElementById("emoji-btn");
let emojiList = document.getElementById("emoji-list");
let emojiBox = document.getElementById("emoji-box");

/* for (let i = 128512; i <= 129488; i++) {
    let j = 0;
    emojiCode = `<li class = 'emojis' id='emoji-${j}' onclick='showEmoji(${i})'>&#${i}</li>`
    emojiList.innerHTML += emojiCode;
    if (i == 128567) {
        i = 128576;
    }
    if (i == 128580) {
        i = 129295;
    }
    if (i == 129301) {
        i = 129311;
    }
    if (i == 129317) {
        i = 129318
    }
    if (i == 129327) {
        i = 129487;
    }
} */
let m = 0;
let o = 0;
let p = 0;
for (let i = 128512; i <= 129488; i++) {

    if (p == 10) {
        o++
        p = 0;
    }

    emojiCode = `<li class = 'emojis' id='emoji-${o}${p}' onclick='showEmoji(${o},${p})'>&#${i}</li>`

    emojiList.innerHTML += emojiCode;
    if (i == 128567) {
        i = 128576;
    }
    if (i == 128580) {
        i = 129295;
    }
    if (i == 129301) {
        i = 129311;
    }
    if (i == 129317) {
        i = 129318
    }
    if (i == 129327) {
        i = 129487;
    }
    m++
    p++
}
let notHideEmoji = false;
emojiList.addEventListener("click", () => {
    notHideEmoji = true;
    setTimeout(() => {
        notHideEmoji = false;
    }, 50);
});
emoji.addEventListener("click", () => {
    if (emojiBox.className == "emoji-box emoji-box-show") {
        emojiBox.classList.remove("emoji-box-show");
    } else {
        clipBox.classList.remove("clip-box-show");

        emojiBox.classList.add("emoji-box-show");
        notHideEmoji = true;
        setTimeout(() => {
            notHideEmoji = false;
        }, 50);
    }
})

/* ==================== SHOW AND HIDE CLIP BOX =================== */
let clip = document.getElementById("clip-btn");
let clipList = document.getElementById("clip-list");
let clipBox = document.getElementById("clip-box");

let notHideClip = false;
clipList.addEventListener("click", () => {
    notHideClip = true;
    setTimeout(() => {
        notHideClip = false;
    }, 50);
});
clip.addEventListener("click", () => {
    if (clipBox.className == "clip-box clip-box-show") {
        clipBox.classList.remove("clip-box-show");
    } else {
        emojiBox.classList.remove("emoji-box-show");
        clipBox.classList.add("clip-box-show");
        notHideClip = true;
        setTimeout(() => {
            notHideClip = false;
        }, 50);
    }
})
/* ==================== show or hide emojis box and clips box when clicking away =================== */

hideEmojisClipes = document.querySelectorAll(".hide-emojis-clips");
hideEmojisClipes.forEach(n => n.addEventListener("click", () => {
    setTimeout(() => {
        if (notHideEmoji == false) {
            emojiBox.classList.remove("emoji-box-show");
        }
        if (notHideClip == false) {
            clipBox.classList.remove("clip-box-show");
        }
    }, 10);

}))

/* ===================== SEND MESSAGE =================== */
let send = document.getElementById("send");
let chatMessages = document.getElementById("chat-messages-box");
let message = document.getElementById("message-field");
let messageLoading = document.getElementById("send-message-loading");
let sendMessageIcon = document.getElementById("send-message-icon");

function sendMessageOnEnter(event) {
    if (event.key === "Enter") {
        send.click();
    }
}
let isSending = false;

function sendMessage(rootUrl, chatId) {
    if (message.value != "" && isSending == false) {
        isSending = true;
        message = document.getElementById("message-field");
        sendMessageIcon.classList.add("send-hide");
        messageLoading.classList.add("send-message-loading-show");
        setTimeout(() => {

            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "chat", chatId);
            EasyHttpRequest.AddField(formData, "message", message.value);
            EasyHttpRequest.AddField(formData, "userId", localStorage.getItem("userId"));
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

            EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/post-message-api.php", formDataCompiled,
                function () {
                    /* When The Request Is Done */
                    /* Create The Chats */



                },


                function (textResult, jsonResult) {
                    console.log(textResult);
                    //If error
                    if (jsonResult.postMessageStatus != 0) {
                        switch (jsonResult.postMessageStatus) {
                            case 1:
                                ShowPopUpDialog("popup-error", "Error!", "Non-existent Directory");

                                message.value = "";
                                messageLoading.classList.remove("send-message-loading-show");
                                sendMessageIcon.classList.remove("send-hide");
                                isSending = false;
                                break;
                            case 2:
                                ShowPopUpDialog("popup-error", "Error!", "You're Not Logged");

                                message.value = "";
                                messageLoading.classList.remove("send-message-loading-show");
                                sendMessageIcon.classList.remove("send-hide");
                                isSending = false;
                                break;
                            case 3:
                                ShowPopUpDialog("popup-error", "Error!", "You're Not Logged");

                                message.value = "";
                                messageLoading.classList.remove("send-message-loading-show");
                                sendMessageIcon.classList.remove("send-hide");
                                isSending = false;
                                break;
                        }
                    }
                    //If success
                    else {

                        message = document.getElementById("message-field");
                        let content = `<div class="chat-messages" id="chat-messages-${k}" onmouseover="showOptionBtn(${k}, ${localStorage.getItem("userId")})" onmouseout="hideOptionBtn(${k}, ${localStorage.getItem("userId")})">    
                    <div class="chat-message chat-our-message" id="message-${k}">
                    <div class="message-options-container" id="message-options-container-${k}">
                                <div class="message-options-btn-box">
                                    <i class="uil uil-ellipsis-v message-options-btn" id="message-options-btn-${k}" onclick="showMessagesOptions('${rootUrl}',${k}, ${chatId}, ${localStorage.getItem("userId")})"></i>
                                </div>
                            </div>
                    <div class = "message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${localStorage.getItem("userId")}, ${k}, ${true})" onmouseout="hideMiniProfile()" >
                    <img src="${rootUrl}${jsonResult.avatar}" class = "message-img img-circle" onclick = "showUserProfileInnerEvent('${rootUrl}', ${localStorage.getItem("userId")})" onmouseout = "hideMiniProfile()" id="message-id-${k}">
                    </div>
                    <div class="message" id="message-text-${k}">
                    ${message.value}
                    </div>
                    </div>
                    </div>`

                        if (k < 98) {
                            k++
                        }



                        let n = 0;
                        let m = 0;
                        for (let i = 128512; i <= 129488; i++) {

                            if (n == 10) {
                                m++;
                                n = 0;
                            }

                            let emojiCode = "&#" + i;
                            let pattern = new RegExp(`\€[${m}][${n}]`, "g");

                            content = content.replace(pattern, emojiCode);
                            console.log(content);
                            /* console.log(content.replace(pattern, emojiCode)) */
                            if (i == 128567) {
                                i = 128576;
                            }
                            if (i == 128580) {
                                i = 129295;
                            }
                            if (i == 129301) {
                                i = 129311;
                            }
                            if (i == 129317) {
                                i = 129318
                            }
                            if (i == 129327) {
                                i = 129487;
                            }
                            n++;

                        }
                        content = content.replace(/%DOMAIN%/gi, `${rootUrl}`);
                        if (k < 98) {
                            chatMessages.innerHTML += content;
                        }
                        message.value = "";
                        messageLoading.classList.remove("send-message-loading-show");
                        sendMessageIcon.classList.remove("send-hide");
                        isSending = false;
                        chatBox.scrollTop = 9999999;

                        reloadChat(rootUrl, chatId)
                        intervals.forEach(n => {
                            clearInterval(n);
                        });
                        intervals.push(setInterval(() => {
                            reloadChat(rootUrl, chatId)
                        }, 5000));
                    }
                },
                function () {
                    /* Case The Request can't be done */
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });
        }, 10);
    }
}

/* ==================== SHOW EMOJIS =================== */
function showEmoji(emojiDecimalCode, emojiUnityCode) {
    message.value += "€" + `${emojiDecimalCode}${emojiUnityCode}`;
}

/* ==================== SHOW IMAGE AND VIDEO TEMPLATE =================== */
let fileSend = document.getElementById("file-send-content");
let imgBtn = document.getElementById("img-btn");
let fileSendAlert1 = document.getElementById("file-alert-1");
let fileSendAlert2 = document.getElementById("file-alert-2");
let fileInput = document.getElementById("url-file-input");
let fileInput2 = document.getElementById("file-input");
let submitBtn1 = document.getElementById("submit-1");
let submitBtn2 = document.getElementById("submit-2");
let submitBtn3 = document.getElementById("submit-3");
let isInserting = false;
let fileCloseBtn = document.getElementById("close-file-box");
let fileLoading = document.getElementById("file-box-loading");

imgBtn.addEventListener("click", () => {
    fileSend.classList.remove("file-send-content-show");
    submitBtn1.style.display = "inline-block";
    submitBtn2.style.display = "none";
    setTimeout(() => {
        fileCloseBtn.style.display = "inline-block";
        fileSend.classList.add("file-send-content-show");
        clipBox.classList.remove("clip-box-show");
        fileSendAlert1.innerHTML = "Insert The Image URL";
        fileSendAlert2.innerHTML = "Upload The Image FILE";
    }, 100);
})

function closeFileSendBox() {
    fileSend.classList.remove("file-send-content-show");
}

function insertTheImageUrl() {
    if (fileInput.value != "") {
        fileInput2.disabled = true;
        submitBtn3.disabled = true;
        fileCloseBtn.style.display = "none";
        fileLoading.style.display = "inline-block";
        setTimeout(() => {
            message = document.getElementById("message-field");
            message.value += `<img src='${fileInput.value}' class='image-message' alt='Image Not Found'>`;
            message.value = message.value.replace(/\&/g, "¥");
            fileSend.classList.remove("file-send-content-show");
            fileLoading.style.display = "none";
            fileInput2.disabled = false;
            submitBtn3.disabled = false;
        }, 1000);
    } else {
        ShowPopUpDialog("popup-error", "Error!", "Insert The URL");
    }
}

function insertTheFile(rootUrl, chatId) {
    if (fileInput2.value != "") {

        fileInput.disabled = true;
        submitBtn1.disabled = true;
        submitBtn2.disabled = true;
        fileCloseBtn.style.display = "none";
        fileLoading.style.display = "inline-block";

        if (isSending == false) {
            isSending = true;
            fileInput2 = document.getElementById("file-input");
            setTimeout(() => {

                var formData = EasyHttpRequest.InstantiateFormData();
                EasyHttpRequest.AddField(formData, "chat", chatId);
                EasyHttpRequest.AddField(formData, "userId", localStorage.getItem("userId"));

                EasyHttpRequest.StartAsyncFileUpload(rootUrl + "apis/post-media-api.php", "file-input", 0, "media", formData,
                    function () {
                        /* When The Request Is Done */
                        /* Create The Chats */
                        fileSend.classList.remove("file-send-content-show");
                        fileCloseBtn.style.display = "inline-block";
                        fileLoading.style.display = "none";
                        fileInput.disabled = false;
                        submitBtn1.disabled = false;
                        submitBtn2.disabled = false;

                    },
                    function (progress, totalProgress) {

                    },
                    function (textResult, jsonResult) {
                        console.log(textResult);
                        //If error
                        if (jsonResult.postMediaStatus != 0) {
                            switch (jsonResult.postMediaStatus) {
                                case 1:
                                    ShowPopUpDialog("popup-error", "Error!", "Non-existent Directory");



                                    isSending = false;
                                    break;
                                case 2:
                                    ShowPopUpDialog("popup-error", "Error!", "You're Not Logged");
                                    isSending = false;
                                    break;
                                case 3:
                                    ShowPopUpDialog("popup-error", "Error!", "File Non-Existent");
                                    isSending = false;
                                    break;
                                case 4:
                                    ShowPopUpDialog("popup-error", "Error!", "File Not Supported");
                                    isSending = false;
                                    break;
                                case 5:
                                    ShowPopUpDialog("popup-error", "Error!", "File Too Big");
                                    isSending = false;
                                    break;
                            }
                        }
                        //If success
                        else {

                            let content = `<div class="chat-messages" id="chat-messages-${k}" onmouseover="showOptionBtn(${k}, ${localStorage.getItem("userId")})" onmouseout="hideOptionBtn(${k}, ${localStorage.getItem("userId")})">    
                    <div class="chat-message chat-our-message" id="message-${k}">
                    <div class="message-options-container" id="message-options-container-${k}">
                        <div class="message-options-btn-box">
                            <i class="uil uil-ellipsis-v message-options-btn" id="message-options-btn-${k}" onclick="showMessagesOptions('${rootUrl}',${k}, ${chatId}, ${localStorage.getItem("userId")}, ${true})"></i>
                        </div>
                    </div>
                    <div class = "message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${localStorage.getItem("userId")}, ${k}, ${true})" onmouseout="hideMiniProfile()" >
                    <img src="${rootUrl}${jsonResult.avatar}" class = "message-img img-circle" onclick = "showUserProfileInnerEvent('${rootUrl}', ${localStorage.getItem("userId")})" onmouseout = "hideMiniProfile()" id="message-id-${k}">
                    </div>
                    <div class="message" id="message-text-${k}">
                    ${jsonResult.mediaMessage}
                    </div>
                    </div>
                    </div>`

                            if (k < 98) {
                                k++
                            }
                            content = content.replace(/%DOMAIN%/gi, `${rootUrl}`);
                            if (k < 98) {
                                chatMessages.innerHTML += content;
                            }
                            isSending = false;
                            chatBox.scrollTop = 9999999;
                        }
                        reloadChat(rootUrl, chatId)
                        intervals.forEach(n => {
                            clearInterval(n);
                        });
                        intervals.push(setInterval(() => {
                            reloadChat(rootUrl, chatId)
                        }, 5000));
                    },
                    function () {
                        /* Case The Request can't be done */
                        ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                    });
            }, 1000);
        }
    } else {
        ShowPopUpDialog("popup-error", "Error!", "Insert The File");
    }
}


let videoBtn = document.getElementById("video-btn");

videoBtn.addEventListener("click", () => {
    fileSend.classList.remove("file-send-content-show");
    submitBtn1.style.display = "none";
    submitBtn2.style.display = "inline-block";
    setTimeout(() => {
        fileCloseBtn.style.display = "inline-block";
        fileSend.classList.add("file-send-content-show");
        clipBox.classList.remove("clip-box-show");
        fileSendAlert1.innerHTML = "Insert The Youtube Video URL";
        fileSendAlert2.innerHTML = "Upload The Video FILE";
    }, 100);

})

function insertTheVideoUrl() {
    if (fileInput.value != "") {
        fileInput2.disabled = true;
        submitBtn3.disabled = true;
        fileCloseBtn.style.display = "none";
        fileLoading.style.display = "inline-block";
        let videoUrl = fileInput.value;
        if (videoUrl.match(/https:\/\/youtu\.be\//i)) {
            videoUrl = videoUrl.split("https://youtu.be/");
        } else {
            videoUrl = videoUrl.split("https://www.youtube.com/watch?v=");
        }
        console.log(videoUrl)
        setTimeout(() => {
            message = document.getElementById("message-field");
            message.value += `<iframe src='https://www.youtube.com/embed/${videoUrl[1]}' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen=''></iframe>`;
            fileSend.classList.remove("file-send-content-show");
            fileLoading.style.display = "none";
            fileInput2.disabled = false;
            submitBtn3.disabled = false;
        }, 1000);
    } else {
        ShowPopUpDialog("popup-error", "Error!", "Insert The URL");

    }
}

/* ==================== SHOW CHAT when a conversation is opened  =================== */
let chatBlank = document.getElementById("chat-blank");
let chat = document.querySelectorAll(".chat-content-box");
let chatContent = document.getElementById("chat-content");

function showChat(rootUrl, id) {
    let isYourMessage;
    globalLoading.classList.add("global-loading-show");
    chat.forEach(n => n.classList.remove("chat-content-box-show"));
    chatBlank.classList.remove("blank-content-hide");


    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
        function () {
            /* When The Request Is Done */
            document.getElementById("chat-messages-box").innerHTML = "";

            /* Create The Chats */

            let groupImg = rootUrl + "img/chat-generic-img.png";
            if (chats.chatInfo[0].img != "") {
                groupImg = rootUrl + "admin/received-files/chat-img/" + chats.chatInfo[0].img;
            }
            document.getElementById("chat-img").src = groupImg;
            document.getElementById("chat-name").innerHTML = chats.chatInfo[0].name;
            document.getElementById("chat-desc").innerHTML = chats.chatInfo[0].description;

            /* TEST, CASE HAVE ERROR, REMOVE */
            k = 0;

            let isMedia;

            function showMessages(n, index) {
                isYourMessage = false;
                isMedia = false;
                userImg = rootUrl + "img/" + "403024_avatar_boy_male_user_young_icon.png"
                if (n.img != "") {
                    userImg = rootUrl + "admin/received-files/avatars/" + n.img;
                }
                userClass = "";
                if (localStorage.getItem("userId") == n.userId) {
                    userClass = "chat-our-message"
                    isYourMessage = true;
                }
                if (n.isDeleted == true) {

                    let message =
                        `
                    <div class="chat-messages" id="chat-messages-${k}" onmouseover="showOptionBtn(${k}, ${n.userId}, ${true})" onmouseout="hideOptionBtn(${k}, ${localStorage.getItem("userId")})">
                        <div class="chat-message ${userClass}" id="message-${k}">
                            <div class="message-options-container" id="message-options-container-${k}">
                                <div class="message-options-btn-box">
                                    <i class="uil uil-ellipsis-v message-options-btn" id="message-options-btn-${k}" onclick="showMessagesOptions('${rootUrl}',${k},${id}, ${n.userId}, ${isMedia})"></i>
                                </div>
                            </div>
                            <div class="message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${n.userId}, ${k}, ${isYourMessage})" onmouseout="hideMiniProfile()">
                                <img src="${userImg}" alt="" class="message-img img-circle" onclick="showUserProfileInnerEvent('${rootUrl}',${n.userId})" id="message-id-${k}">
                            </div>
                            <div class="message" id="message-text-${k}"><b><i>Message Deleted</i></b></div>
                        </div>
                    </div>
                `

                    if (k < 98) {
                        k++
                    }
                    messagesId.push(n.msgId);
                    y = n.msgId;
                    document.getElementById("chat-messages-box").innerHTML += message;

                } else {
                    if (n.messageMedia != "") {
                        isMedia = true;
                    }
                    let message =
                        `
                    <div class="chat-messages" id="chat-messages-${k}" onmouseover="showOptionBtn(${k}, ${n.userId})" onmouseout="hideOptionBtn(${k}, ${localStorage.getItem("userId")})">
                        <div class="chat-message ${userClass}" id="message-${k}">
                            <div class="message-options-container" id="message-options-container-${k}">
                                <div class="message-options-btn-box">
                                    <i class="uil uil-ellipsis-v message-options-btn" id="message-options-btn-${k}" onclick="showMessagesOptions('${rootUrl}',${k},${id}, ${n.userId}, ${isMedia})"></i>
                                </div>
                            </div>
                            <div class="message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${n.userId}, ${k}, ${isYourMessage})" onmouseout="hideMiniProfile()">
                                <img src="${userImg}" alt="" class="message-img img-circle" onclick="showUserProfileInnerEvent('${rootUrl}',${n.userId})" id="message-id-${k}">
                            </div>
                            <div class="message" id="message-text-${k}">${n.message}</div>
                        </div>
                    </div>
                `

                    if (k < 98) {
                        k++
                    }
                    messagesId.push(n.msgId);
                    y = n.msgId;

                    let r = 0;
                    let m = 0;
                    for (let i = 128512; i <= 129488; i++) {

                        if (r == 10) {
                            m++;
                            r = 0;
                        }

                        let emojiCode = "&#" + i;
                        let pattern = new RegExp(`\€[${m}][${r}]`, "g");

                        message = message.replace(pattern, emojiCode);
                        /* console.log(content.replace(pattern, emojiCode)) */
                        if (i == 128567) {
                            i = 128576;
                        }
                        if (i == 128580) {
                            i = 129295;
                        }
                        if (i == 129301) {
                            i = 129311;
                        }
                        if (i == 129317) {
                            i = 129318
                        }
                        if (i == 129327) {
                            i = 129487;
                        }
                        r++;

                    }
                    message = message.replace(/%DOMAIN%/gi, `${rootUrl}`);
                    document.getElementById("chat-messages-box").innerHTML += message;
                }
            }

            if (chats.chatMessage.length >= 1) {
                chats.chatMessage.forEach(showMessages)
            }

            setTimeout(() => {
                intervals.forEach(n => {
                    clearInterval(n);
                });
                intervals.push(setInterval(() => {
                    reloadChat(rootUrl, id)
                }, 5000));

                document.getElementById("submit-3").setAttribute("onclick", `insertTheFile('${rootUrl}', ${id})`)
                document.getElementById("send").setAttribute("onclick", `sendMessage('${rootUrl}', ${id})`)
                document.getElementById("chat-header").setAttribute("onclick", `showChatInfo('${rootUrl}', ${id})`);
                chatContent.classList.add("chat-content-show");
                chatBlank.classList.add("blank-content-hide");
                chat.forEach(n => n.classList.add("chat-content-box-show"));
                globalLoading.classList.remove("global-loading-show");
                chatBox = document.getElementById('chat-messages-box');
                chatBox.scrollTop = 9999999;

            }, 500);
        },


        function (textResult, jsonResult) {
            console.log(textResult);
            //If error
            if (jsonResult.readChatStatus != 0) {
                switch (jsonResult.readChatStatus) {
                    case 1:
                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                }
            }
            //If success
            else {
                chats = jsonResult.allChats[id];
            }
        },
        function () {
            /* Case The Request can't be done */
            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
        });
}

/* ==================== SEARCH RESULTS  =================== */
let searchInput = document.getElementById("search-input");
let searchResultBox = document.getElementById("search-result-box");
let searchLoading = document.getElementById("search-loading")
let setTimeOutSearchingInstances = [];
/* milliseconds = milliseconds.setTime(date.getTime()); */

function searchChats(rootUrl) {
    setTimeOutSearchingInstances.forEach(n => {
        clearTimeout(n);
    });

    searchInput = document.getElementById("search-input");
    searchResultBox = document.getElementById("search-result-box");
    searchResultBox.innerHTML = "";
    searchResultBox.classList.remove("search-result-box-show");
    searchLoading = document.getElementById("search-loading");
    searchLoading.classList.add("search-loading-show");
    let chats = [];
    let chatsDiv;

    setTimeOutSearchingInstances.push(setTimeout(() => {

        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "chat-name", searchInput.value);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);
        EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", formDataCompiled,
            function () {
                /* When The Request Is Done */

                setTimeOutSearchingInstances.push(setTimeout(() => {


                    /* Create The Chats */
                    function loadChat(n, index) {
                        if (n.chatInfo[0].img == "") {
                            var img = "img/chat-generic-img.png";
                        } else {
                            var img = "admin/received-files/chat-img/" + n.chatInfo[0].img;
                        }
                        newChat =
                            `
                                <div class = "chats search-chat" onclick = "showChat('${rootUrl}', ${n.chatInfo[0].chatId})">
                                <div class = "chats-img-box">
                                <img src = "${rootUrl}${img}" class = "chats-img img-circle" id="chats-img-index">
                                </div> 
                                <div class = "chats-info">
                                <div class = "chats-name-box" >
                                <h4 class = "chats-name">${n.chatInfo[0].name}</h4> 
                                </div> 
                                <hr class = "search-chats-hr hr">
                                </div> 
                                </div>
                                `
                        searchResultBox.innerHTML += newChat;
                    }

                    setTimeOutSearchingInstances.push(setTimeout(() => {

                        if (chats != "undefined") {
                            chats.forEach(loadChat);
                        }

                        chatsDiv = document.querySelectorAll(".search-chat");
                        chatsDiv.forEach(n => n.classList.add("chats-show"));
                        let searchLoading = document.getElementById("search-loading");
                        searchLoading.classList.remove("search-loading-show");

                    }, 100));
                }, 10));

            },
            function (textResult, jsonResult) {
                console.log(textResult);

                setTimeOutSearchingInstances.push(setTimeout(() => {
                    //If error
                    if (jsonResult.readChatStatus != 0) {
                        chats = "undefined";
                        switch (jsonResult.readChatStatus) {
                            case 1:
                                ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                                break;
                            case 2:

                                /* Create The Chats */
                                setTimeOutSearchingInstances.push(setTimeout(() => {
                                    searchResultBox.classList.add("search-result-box-show");
                                    searchResultBox.innerHTML = "";
                                    searchResultBox.innerHTML +=
                                        `
                                        <div class = "chats search-chat chat-not-found">
                                            No Chat Found
                                        </div>
                                    `;

                                }, 100));
                                break;
                        }
                    }

                    //If success
                    else {
                        setTimeOutSearchingInstances.push(setTimeout(() => {
                            searchResultBox.innerHTML = "";
                            chats = jsonResult.allChats;
                            searchResultBox.classList.add("search-result-box-show");
                        }, 10));
                    }
                }, 10));
            }

            ,
            function () {
                /* Case The Request can't be done */
                ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
            });
    }, 1000));
}




let hideSearchResults = document.querySelectorAll(".hide-search-results");
hideSearchResults.forEach(n => n.addEventListener("click", () => {
    searchResultBox.innerHTML = "";
    searchResultBox.classList.remove("search-result-box-show");
    searchLoading.classList.remove("search-loading-show");
    setTimeOutSearchingInstances.forEach(n => {
        clearTimeout(n);
    });
}))

/* ==================== Return to the previous page =================== */
let backToThePreviousPage = document.getElementById("previous-page");
let profileLoading = document.getElementById("profile-loading");

function previousPage(page) {

    if (page == 0) {
        isClickedInBackIcon = true;
        globalLoading.classList.add("global-loading-show");
        setTimeout(() => {
            chatContent.classList.remove("chat-content-show");
            chat.forEach(n => n.classList.remove("chat-content-box-show"));
            chatBlank.classList.remove("blank-content-hide");
            globalLoading.classList.remove("global-loading-show");
            isClickedInBackIcon = false;
        }, 1000);
    } else if (page == 1) {
        isShowing = false;
        profileLoading.classList.add("profile-loading-show");
        setTimeout(() => {
            profileLoading.classList.remove("profile-loading-show");
            profileCard.classList.remove("profile-active");
            profileCard.classList.remove("profile-active-user");
        }, 1000);
    }
}

/* ==================== SHOW MINI PROFILE CARD WHEN THE IMG IS HOVERED =================== */


let miniProfile = document.getElementById("mini-profile");
miniProfileTimeouts = [];

function showMiniProfile(rootUrl, userId, id, isYourMessageParam) {

    miniProfileTimeouts.forEach(n => {
        clearTimeout(n);
    });

    let targetElement = document.getElementById("message-img-box-" + id);

    let elementPosition = miniProfile.getBoundingClientRect();
    let targetElementPosition = targetElement.getBoundingClientRect();

    miniProfile.style.top = (targetElementPosition.top - 140) + "px";
    miniProfile.style.left = (targetElementPosition.right - 40) + "px";

    if (isYourMessageParam == true) {
        miniProfile.style.left = (targetElementPosition.right - 250) + "px";
    }

    /*
     miniProfile.style.top = (targetElementPosition.top - 170) + "px";
     miniProfile.style.right = (targetElementPosition.right + 550) + "px";
     */

    miniProfileTimeouts.push(setTimeout(() => {
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "user-id", userId);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        /* if (localStorage.getItem("isAdmin") != null || localStorage.getItem("userId") == id) {
            apiPath = rootUrl + "apis/show-user-profile-api.php";
        } */
        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/show-user-api.php", formDataCompiled,
            function () {
                /* When The Request Is Done */
                /* Create The Chats */
                miniProfileTimeouts.push(setTimeout(() => {
                    miniProfile.classList.add("mini-profile-show");
                }, 10));
            },



            function (textResult, jsonResult) {
                console.log(textResult);
                //If error
                if (jsonResult.showUserStatus != 0) {
                    switch (jsonResult.showUserStatus) {
                        case 1:
                        case 2:
                            ShowPopUpDialog("popup-error", "Error!", "User Don't Exists");

                            miniProfileTimeouts.push(setTimeout(() => {

                                let miniProfileName = document.getElementById("mini-profile-name");
                                miniProfileName.innerHTML = "None";
                                let miniProfileBio = document.getElementById("mini-profile-bio");
                                miniProfileBio.innerHTML = "None";
                                let miniProfileActivity = document.getElementById("mini-profile-activity");
                                miniProfileActivity.innerHTML = "None";
                                let miniProfileImg = document.getElementById("mini-profile-img");
                                miniProfileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";
                            }, 10));


                            break;
                    }
                }
                //If success
                else {
                    miniProfileTimeouts.push(setTimeout(() => {

                        let miniProfileName = document.getElementById("mini-profile-name");
                        if (jsonResult.name.length > 30) {
                            miniProfileName.innerHTML = jsonResult.name.slice(0, 30) + "...";
                        } else {
                            miniProfileName.innerHTML = jsonResult.name;
                        }
                        let miniProfileBio = document.getElementById("mini-profile-bio");

                        if (jsonResult.biography.length > 40) {
                            miniProfileBio.innerHTML = jsonResult.biography.slice(0, 40) + "...";
                        } else {
                            miniProfileBio.innerHTML = jsonResult.biography;
                        }
                        let miniProfileActivity = document.getElementById("mini-profile-activity");
                        miniProfileActivity.innerHTML = jsonResult.lastActivity;
                        let miniProfileImg = document.getElementById("mini-profile-img");

                        if (jsonResult.avatar == "") {
                            miniProfileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";
                        } else {
                            miniProfileImg.src = rootUrl + "admin/received-files/avatars/" + jsonResult.avatar;
                        }
                    }, 10));

                }
            },
            function () {
                /* Case The Request can't be done */
                ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
            });

    }, 1000));
}

function hideMiniProfile() {
    miniProfileTimeouts.forEach(n => {
        clearTimeout(n);
    });
    miniProfile.classList.remove("mini-profile-show");
}

/* ==================== Make the User Logout ===================  */
function Logout(rootUrl) {
    //Change the UI
    searchLoading.classList.add("search-loading-show");
    /* Prevents too many requests from being made */
    let requestedLogout = false;
    //Do the request
    if (requestedLogout == false) {
        requestedLogout = true;
        EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/logout-api.php", null,
            function () {
                //when the request is done
                searchLoading.classList.remove("search-loading-show");
                requestedLogout = false;
            },
            function (textResult, jsonResult) {
                //when the request is successfully
                //Redirect to home
                window.location.href = rootUrl + "index.php";
            },
            function () {
                //when the request is failure
                ShowPopUpDialog("popup-error", "Error!", "Something is wrong right now, please try again later");
            });
    }
}

/* ==================== SHOW CREATE CHAT POPUP ===================  */

let createChatPopupScreen = document.getElementById("add-chat-screen");
let createChatPopup = document.getElementById("add-chat-popup");

function showAddChatPopup() {
    createChatPopupScreen.style.display = "flex";
    setTimeout(() => {
        createChatPopupScreen.classList.add("add-chat-screen-show");
        createChatPopup.classList.add("add-chat-popup-show");
    }, 10);
}

/* ==================== HIDE CREATE CHAT POPUP ===================  */
let canClose = true;

function hideAddChatPopup() {
    if (canClose == true) {
        createChatPopupScreen.classList.remove("add-chat-screen-show");
        createChatPopup.classList.remove("add-chat-popup-show");

        setTimeout(() => {
            createChatPopupScreen.style.display = "none";
        }, 1500);
    }
}

/* ==================== Change chat img file name when the input is changed ===================  */
let createChatBtn = document.getElementById("add-chat-btn")
let createChatFileInput = document.getElementById("add-chat-img");
let createChatFileNameDiv = document.getElementById("add-chat-img-text");

function changeFileName() {
    createChatFileNameDiv.innerHTML = createChatFileInput.files[0].name;
}

/* ==================== CREATE NEW CHAT ===================  */
let newChatName = document.getElementById("add-chat-name");
let newChatDesc = document.getElementById("add-chat-desc");
let newChatImg = document.getElementById("add-chat-img");
let newChatloadingBar = document.getElementById("add-chat-loading-bar")
let newChatloading = document.getElementById("add-chat-loading")

function createChat(rootUrl) {
    if (newChatName.value != "" && newChatDesc.value != "" && newChatImg.value != "") {

        newChatloadingBar.classList.add("add-chat-loading-show");
        canClose = false;

        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "chat-name", newChatName.value);
        newChatDesc.value = newChatDesc.value.replace(/\n/g, "");
        EasyHttpRequest.AddField(formData, "chat-description", newChatDesc.value);


        EasyHttpRequest.StartAsyncFileUpload(rootUrl + "apis/create-chat-api.php", "add-chat-img", 0, "chat-img", formData,
            function () {
                /* When The Request Is Done */

                newChatloadingBar.classList.remove("add-chat-loading-show");
                canClose = true;


                createChatPopupScreen.classList.remove("add-chat-screen-show");
                createChatPopup.classList.remove("add-chat-popup-show");

                setTimeout(() => {
                    createChatPopupScreen.style.display = "none";
                }, 1500);
            },
            function (progress, totalProgress) {
                newChatloading.style.width = progress + "%";

            },
            function (textResult, jsonResult) {
                console.log(textResult);
                //If error
                if (jsonResult.addChatStatus != 0) {
                    switch (jsonResult.addChatStatus) {
                        case 1:
                            ShowAlert("alert-bar", "ERROR", "Error!", "You Don't Have Permission For This");
                            break;
                        case 2:
                            ShowAlert("alert-bar", "ERROR", "Error!", "There are empty fields, please fill them in");
                            break;
                        case 3:
                            ShowAlert("alert-bar", "ERROR", "Error!", "The File Alread Exists");
                            break;
                        case 4:
                            ShowAlert("alert-bar", "ERROR", "Error!", "Non-existent directory");
                            break;
                        case 5:
                            ShowAlert("alert-bar", "ERROR", "Error!", "This File Format Is Not Supported");
                            break;
                        case 6:
                            ShowAlert("alert-bar", "ERROR", "Error!", "This File is Too Big");
                            break;
                    }
                }
                //If success
                else {
                    loadChats(rootUrl);

                }
            },
            function () {
                /* Case The Request can't be done */
                ShowAlert("alert-bar", "ERROR", "Error!", "There was an error, please try again later.");
            });
    } else {
        ShowAlert("alert-bar", "ERROR", "Error!", "There are empty fields, please fill them in");
    }
}

/* ==================== EDIT CHAT ===================  */
function updateChatInfo(inputId, rootUrl, chatId) {
    let confirmationBtn = document.getElementById("update-" + inputId);
    if (inputId != 0) {
        let input = document.getElementById("inner-input-" + inputId);
        if (input.value != "") {
            if (localStorage.getItem("isAdmin") != undefined) {
                let editBtn = document.getElementById("edit-" + inputId);
                let info = document.getElementById("info-" + inputId);
                let loading = document.getElementById("loading-" + inputId);
                let hideCloseBtns = document.querySelectorAll(".close-btn");
                hideCloseBtns.forEach(n => n.style.display = "none");
                confirmationBtn.style.display = "none";
                input.disabled = true;
                loading.style.display = "inline-block";
                isRunning = true;

                var formData = EasyHttpRequest.InstantiateFormData();
                EasyHttpRequest.AddField(formData, "chat-id", chatId);
                if (inputId == 5) {
                    var inputName = "chat-name";
                }
                if (inputId == 6) {
                    var inputName = "chat-desc";
                }
                EasyHttpRequest.AddField(formData, inputName, input.value);
                var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

                isRequesting = true;
                setTimeout(() => {
                    EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/edit-chat-api.php", formDataCompiled,
                        function () {
                            info.style.display = "inline-block";
                            input.disabled = false;
                            input.style.display = "none";
                            editBtn.style.display = "inline-block";
                            loading.style.display = "none";
                            isRunning = false;
                        },
                        function (textResult, jsonResult) {
                            console.log(textResult);
                            //If error
                            if (jsonResult.editChatStatus != 0) {
                                switch (jsonResult.editChatStatus) {
                                    case 1:
                                        ShowPopUpDialog("popup-error", "Error!", "You Don't have permission for This");
                                        break;
                                    case 2:
                                        ShowPopUpDialog("popup-error", "Error!", "Error");
                                        break;
                                    case 3:
                                        ShowPopUpDialog("popup-error", "Error!", "No data to be updated");
                                        break;
                                    case 4:
                                        ShowPopUpDialog("popup-error", "Error!", "There are empty fields, please fill them in");
                                        break;
                                    case 5:
                                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                                        break;
                                    case 6:
                                        ShowPopUpDialog("popup-error", "Error!", "Chat Non-existent");
                                        break;
                                    case 7:
                                        ShowPopUpDialog("popup-error", "Error!", "File Not Suported");
                                        break;
                                    case 8:
                                        ShowPopUpDialog("popup-error", "Error!", "File Too Big");
                                        break;
                                }
                            }

                            //If success
                            else {
                                info.innerHTML = input.value;
                                ShowPopUpDialog("popup", "Update Data", "Data Succesfully Updated");
                            }
                        },
                        function () {
                            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                        });
                }, 1000);
            } else {
                ShowPopUpDialog("popup-error", "Error!", "You Don't have permission for This");
            }
        } else {
            ShowPopUpDialog("popup-error", "Error!", "There are empty fields, please fill them in");

        }
    } else {
        let input = document.getElementById("update-avatar");
        if (input.value != "") {
            let closeBtn = document.getElementById("close-0");
            let updateImg = document.getElementById("update-img")
            let loading = document.getElementById("loading-0");
            let progressBar = document.getElementById("progress-bar");
            let actualProgress = document.getElementById("progress");
            actualProgress.style.width = "0%";
            confirmationBtn.style.display = "none";
            closeBtn.style.display = "none";
            loading.style.display = "inline-block";
            isRunning = true;
            if (localStorage.getItem("isAdmin") != undefined) {
                setTimeout(() => {
                    let imgName;
                    progressBar.classList.add("progress-bar-active");

                    var formData = EasyHttpRequest.InstantiateFormData();
                    EasyHttpRequest.AddField(formData, "chat-id", chatId);
                    /*                 var formDataCompiled = EasyHttpRequest.BuildFormData(formData);
                     */
                    EasyHttpRequest.StartAsyncFileUpload(rootUrl + "apis/edit-chat-api.php", "update-avatar", 0, "img", formData,
                        function () {
                            setTimeout(() => {
                                updateImg.style.display = "none";
                                loading.style.display = "none";
                                isRunning = false;
                                progressBar.classList.remove("progress-bar-active");
                                document.getElementById("profile-img").src = rootUrl + "admin/received-files/chat-img/" + imgName;
                                loadChats(rootUrl);
                                showChat(rootUrl, chatId);
                            }, 1000);
                        },
                        /* Progress Back */
                        function (progress, totalProgress) {
                            actualProgress.style.width = progress + "%";
                        },
                        function (textResult, jsonResult) {
                            console.log(textResult);
                            //If error
                            if (jsonResult.editChatStatus != 0) {
                                switch (jsonResult.editChatStatus) {
                                    case 1:
                                        ShowPopUpDialog("popup-error", "Error!", "You Don't have permission for This");
                                        break;
                                    case 2:
                                        ShowPopUpDialog("popup-error", "Error!", "Error");
                                        break;
                                    case 3:
                                        ShowPopUpDialog("popup-error", "Error!", "No data to be updated");
                                        break;
                                    case 4:
                                        ShowPopUpDialog("popup-error", "Error!", "There are empty fields, please fill them in");
                                        break;
                                    case 5:
                                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                                        break;
                                    case 6:
                                        ShowPopUpDialog("popup-error", "Error!", "Chat Non-existent");
                                        break;
                                    case 7:
                                        ShowPopUpDialog("popup-error", "Error!", "File Not Suported");
                                        break;
                                    case 8:
                                        ShowPopUpDialog("popup-error", "Error!", "File Too Big");
                                        break;
                                }

                            }
                            //If success
                            else {
                                ShowPopUpDialog("popup", "Update Avatar", "Avatar Succesfully Updated");
                                imgName = jsonResult.imgName;
                            }
                        },
                        function () {
                            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                        });
                }, 1000);
            } else {
                ShowPopUpDialog("popup-error", "Error", "You don't have permission for this")
            }
        }
    }
}

/* ==================== DELETE CHAT =================== */
function deleteChatPopup(rootUrl, chatId) {
    let deleteScreen = document.getElementById("delete-screen");
    let deleteUserPopup = document.getElementById("delete-popup");
    let deletePopupTitle = document.getElementById("delete-popup-title");
    let deletePopupText = document.getElementById("delete-popup-text");
    let deletePopupBtn = document.getElementById("delete-popup-btn-text");
    if (localStorage.getItem("isAdmin") != undefined) {
        deletePopupText.innerHTML = "Are You Sure That You Want To Delete This Chat?";
        deletePopupTitle.innerHTML = "Delete Chat";
        deletePopupBtn.innerHTML = "Delete Chat";
        deleteScreen.style.display = "flex";
        deleteUserPopup.style.display = "flex";
        document.getElementById("delete-popup-btn").setAttribute("onclick", `deleteChat('${rootUrl}', ${chatId})`)
        setTimeout(() => {
            deleteScreen.classList.add("delete-screen-show");
            deleteUserPopup.classList.add("delete-popup-show");
        }, 10);
    } else {
        ShowPopUpDialog("popup-error", "Error", "You don't have permission for this");
    }
}

function deleteChat(rootUrl, chatId) {
    let deleteChatLoading = document.getElementById("delete-popup-loading");
    let deleteChatBtn = document.getElementById("delete-popup-btn-text");


    deleteChatBtn.classList.add("delete-popup-btn-text-hide");
    setTimeout(() => {
        deleteChatBtn.style.display = "none";
        deleteChatLoading.style.display = "inline-block";
        setTimeout(() => {
            deleteChatLoading.classList.add("delete-popup-loading-show");
        }, 10);
    }, 300);

    if (localStorage.getItem("isAdmin") != undefined) {
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "chat-id", chatId);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/delete-chat-api.php", formDataCompiled,
            function () {

                deleteChatLoading.classList.remove("delete-popup-loading-show");
                setTimeout(() => {
                    deleteChatBtn.style.display = "inline-block";
                    deleteChatLoading.style.display = "none";
                    setTimeout(() => {
                        deleteChatBtn.classList.remove("delete-popup-btn-text-hide");
                    }, 10);
                }, 300);

            },
            function (textResult, jsonResult) {
                console.log(textResult);
                //If error
                if (jsonResult.deleteChatStatus != 0) {
                    switch (jsonResult.deleteChatStatus) {
                        case 1:
                            ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
                            break;
                        case 2:
                            ShowAlert("alert-bar", "Error", "Error", "Error");
                            break;
                        case 3:
                            ShowAlert("alert-bar", "Error", "Error", "Directory Non-existent");
                            break;
                    }
                }
                //If success
                else {
                    hideDeletePopup();
                    ShowAlert("alert-bar", "Success", "Success", "Chat Successfully Deleted");
                    loadChats(rootUrl);
                }
            },
            function () {
                ShowAlert("alert-bar", "Error", "Error", "There's an error, please try again later");
            });
    } else {
        ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
    }
}

/* ==================== SHOW MESSAGE OPTIONS =================== */

function showOptionBtn(msgId, userId, isDeleted) {
    if (localStorage.getItem("userId") == userId || localStorage.getItem("isAdmin") == 1) {
        if (isDeleted != true) {
            let messagesOptionsContainer = document.getElementById("message-options-container-" + msgId);
            messagesOptionsContainer.style.display = "flex";
        }
    }
}

function hideOptionBtn(msgId, userId) {
    if (localStorage.getItem("userId") == userId || localStorage.getItem("isAdmin") == 1) {
        let messagesOptionsContainer = document.getElementById("message-options-container-" + msgId);
        messagesOptionsContainer.style.display = "none";
    }
}

function showMessagesOptions(rootUrl, msgId, chatId, userId, isMedia) {
    let messagesOptionsContainer = document.querySelectorAll(".message-options-container");
    let messagesOptions = document.getElementById("message-options");
    let deleteOptionBtn = document.getElementById("delete-option-btn");
    let editOptionBtn = document.getElementById("edit-option-btn");

    messageRoot = document.getElementById("message-" + msgId);

    /* Remove The Style For Other options Popups */
    messagesOptionsContainer.forEach(n => n.classList.remove("message-options-container-show"));
    messagesOptions.style.display = "none";
    messagesOptions.classList.remove("message-options-show");

    editOptionBtn.setAttribute("onclick", `editMessagePopup('${rootUrl}', ${msgId}, ${chatId}, ${userId})`);
    if (isMedia == true) {
        editOptionBtn.setAttribute("onclick", `editMediaMessagePopup('${rootUrl}', ${msgId}, ${chatId}, ${userId})`);
    }
    deleteOptionBtn.setAttribute("onclick", `deleteMessagePopup('${rootUrl}', ${msgId}, ${chatId}, ${userId})`);


    let elementPosition = messagesOptions.getBoundingClientRect();
    let targetElementPosition = messagesOptionsContainer[msgId].getBoundingClientRect();



    messagesOptions.style.top = (targetElementPosition.top + 150) + "px";
    if (messageRoot.className == "chat-message chat-our-message") {
        messagesOptions.style.left = (targetElementPosition.right - 170) + "px";
    } else {
        messagesOptions.style.left = (targetElementPosition.right) + "px";
    }



    setTimeout(() => {
        /* Add the options Popups */
        messagesOptionsContainer[msgId].classList.add("message-options-container-show");
        messagesOptions.style.display = "flex";
        setTimeout(() => {
            messagesOptions.style.top = (targetElementPosition.top + 50) + "px";
            messagesOptions.classList.add("message-options-show");
        }, 10);
    }, 10);
}

/* HIDE MESSAGE OPTIONS */
let hideMessageOptionsElements = document.querySelectorAll(".hide-message-options").forEach(n => n.addEventListener("click", hideMessageOptions));

function hideMessageOptions() {
    let messagesOptionsContainer = document.querySelectorAll(".message-options-container");
    let messagesOptions = document.getElementById("message-options");
    messagesOptionsContainer.forEach(n => n.classList.remove("message-options-container-show"));
    messagesOptions.style.display = "none";
    messagesOptions.classList.remove("message-options-show");
}

function editMessagePopup(rootUrl, msgId, chatId, userId) {
    if (localStorage.getItem("isAdmin") == 1 || localStorage.getItem("userId") == userId) {
        hideMessageOptions()
        let messageScreen = document.getElementById("message-options-screen");
        let messagePopup = document.getElementById("edit-message-popup");
        let editMessageBtn = document.getElementById("edit-message-btn");
        editMessageBtn.setAttribute("onclick", `editMessage('${rootUrl}', ${msgId}, ${chatId}, ${userId})`)
        messageScreen.style.display = "flex";
        messagePopup.style.display = "flex";
        setTimeout(() => {
            messagePopup.classList.add("edit-message-popup-show");
            messageScreen.classList.add("message-options-screen-show");
        }, 10);
    }
}

function editMediaMessagePopup(rootUrl, msgId, chatId, userId) {
    if (localStorage.getItem("isAdmin") == 1 || localStorage.getItem("userId") == userId) {
        hideMessageOptions()
        let messageScreen = document.getElementById("message-options-screen");
        let messagePopup = document.getElementById("edit-media-message-popup");
        let editMediaMessageBtn = document.getElementById("edit-media-message-btn");
        editMediaMessageBtn.setAttribute("onclick", `editMediaMessage('${rootUrl}', ${msgId}, ${chatId}, ${userId})`)
        messageScreen.style.display = "flex";
        messagePopup.style.display = "flex";
        setTimeout(() => {
            messagePopup.classList.add("edit-media-message-popup-show");
            messageScreen.classList.add("message-options-screen-show");
        }, 10);
    }
}

function deleteMessagePopup(rootUrl, msgId, chatId, userId) {
    if (localStorage.getItem("isAdmin") == 1 || localStorage.getItem("userId") == userId) {
        hideMessageOptions()
        let messageScreen = document.getElementById("message-options-screen");
        let messagePopup = document.getElementById("delete-message-popup");
        let deleteMessageBtn = document.getElementById("delete-message-btn");
        deleteMessageBtn.setAttribute("onclick", `deleteMessage('${rootUrl}', ${msgId}, ${chatId}, ${userId})`)
        messageScreen.style.display = "flex";
        messagePopup.style.display = "flex";
        setTimeout(() => {
            messagePopup.classList.add("delete-message-popup-show");
            messageScreen.classList.add("message-options-screen-show");
        }, 10);
    }
}

function hideEditMessagePopup() {
    let messageScreen = document.getElementById("message-options-screen");
    let messagePopup = document.getElementById("edit-message-popup");
    messagePopup.classList.remove("edit-message-popup-show");
    messageScreen.classList.remove("message-options-screen-show");
    setTimeout(() => {
        messageScreen.style.display = "none";
        messagePopup.style.display = "none";
    }, 1000);
}

function hideEditMediaMessagePopup() {
    let messageScreen = document.getElementById("message-options-screen");
    let messagePopup = document.getElementById("edit-media-message-popup");
    messagePopup.classList.remove("edit-media-message-popup-show");
    messageScreen.classList.remove("message-options-screen-show");
    setTimeout(() => {
        messageScreen.style.display = "none";
        messagePopup.style.display = "none";
    }, 1000);
}

function hideDeleteMessagePopup() {
    let messageScreen = document.getElementById("message-options-screen");
    let messagePopup = document.getElementById("delete-message-popup");
    messagePopup.classList.remove("delete-message-popup-show");
    messageScreen.classList.remove("message-options-screen-show");
    setTimeout(() => {
        messageScreen.style.display = "none";
        messagePopup.style.display = "none";
    }, 1000);
}

/* ==================== Change chat img file name when the input is changed ===================  */

function changeMediaMessage() {
    let changeMediaMessageInput = document.getElementById("edit-media-message");
    let changeMediaMessageNameDiv = document.getElementById("edit-media-message-img-text");
    changeMediaMessageNameDiv.innerHTML = changeMediaMessageInput.files[0].name;
}

/* Edit Media Message */
function editMediaMessage(rootUrl, msgId, chatId, userId) {
    if (localStorage.getItem("isAdmin") == 1 || localStorage.getItem("userId") == userId) {

        let mediaMessageInput = document.getElementById("edit-media-message");
        if (mediaMessageInput.value != "") {
            let currentMessageText = document.getElementById("message-text-" + msgId);
            let loadingBar = document.getElementById("edit-message-media-loading-bar");
            loadingBar.classList.add("add-chat-loading-show");


            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "user-id", userId);
            EasyHttpRequest.AddField(formData, "msg-id", msgId);
            EasyHttpRequest.AddField(formData, "chat-id", chatId);

            EasyHttpRequest.StartAsyncFileUpload(rootUrl + "apis/edit-media-message-api.php", "edit-media-message", 0, "new-media", formData,
                function () {
                    /* When The Request is Done */
                    loadingBar.classList.remove("add-chat-loading-show");
                },
                function (progressCallback, totalProgress) {
                    document.getElementById("edit-message-media-loading").style.width = progressCallback + "%";
                },
                function (textResult, jsonResult) {
                    console.log(textResult);
                    //If error
                    if (jsonResult.editMediaMessageStatus != 0) {
                        switch (jsonResult.editMediaMessageStatus) {
                            case 1:
                                ShowAlert("alert-bar", "Error", "Error", "Empty Values")
                                break;
                            case 2:
                                ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This")
                                break;
                            case 3:
                                ShowAlert("alert-bar", "Error", "Error", "Directory Non-Existent")
                                break;
                            case 6:
                                ShowAlert("alert-bar", "Error", "Error", "Chat Don't Exists")
                                break;
                            case 4:
                                ShowAlert("alert-bar", "Error", "Error", "File Type Not Supported")
                                break;
                            case 5:
                                ShowAlert("alert-bar", "Error", "Error", "File Too Big")
                                break;
                            case 7:
                                ShowAlert("alert-bar", "Error", "Error", "Message Don't Exists")
                                break;

                        }
                    }
                    //If success
                    else {
                        hideEditMediaMessagePopup()
                        ShowAlert("alert-bar", "success", "Success", "Message Successfully Updated")
                        currentMessageText.innerHTML = jsonResult.newMessage;
                    }
                },
                function () {
                    ShowAlert("alert-bar", "Error", "Error", "There's an error, please try again later")
                });
        } else {
            ShowAlert("alert-bar", "Error", "Error", "Empty Fields");
        }
    } else {
        ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
    }
}


function editMessage(rootUrl, msgId, chatId, userId) {
    if (localStorage.getItem("isAdmin") == 1 || localStorage.getItem("userId") == userId) {

        let newMessage = document.getElementById("edit-message-text");
        let editMessageLoading = document.getElementById("edit-message-loading");
        let editBtnMessage = document.getElementById("edit-message-btn-text")
        let currentMessageText = document.getElementById("message-text-" + msgId);
        let newEditMessage;

        editBtnMessage.classList.add("edit-message-btn-text-hide");
        setTimeout(() => {
            editMessageLoading.classList.add("edit-message-loading-show");
            editBtnMessage.style.display = "none";
            setTimeout(() => {
                editMessageLoading.style.display = "inline-block";
            }, 10);
        }, 300);
        newMessage.value = newMessage.value.replace(/\n/g, "");
        console.log(newMessage.value);
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "new-message", newMessage.value);
        EasyHttpRequest.AddField(formData, "user-id", userId);
        EasyHttpRequest.AddField(formData, "msg-id", msgId);
        EasyHttpRequest.AddField(formData, "chat-id", chatId);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/edit-message-api.php", formDataCompiled,
            function () {
                /* When The Request is Done */
                editMessageLoading.classList.remove("edit-message-loading-show");
                setTimeout(() => {
                    editMessageLoading.style.display = "none";
                    editBtnMessage.style.display = "inline-block";
                    setTimeout(() => {
                        editBtnMessage.classList.remove("edit-message-btn-text-hide");
                    }, 10);
                }, 300);
                if (newEditMessage != undefined) {
                    let r = 0;
                    let m = 0;
                    for (let i = 128512; i <= 129488; i++) {

                        if (r == 10) {
                            m++;
                            r = 0;
                        }

                        let emojiCode = "&#" + i;
                        let pattern = new RegExp(`\€[${m}][${r}]`, "g");

                        newEditMessage = newEditMessage.replace(pattern, emojiCode);
                        /* console.log(content.replace(pattern, emojiCode)) */
                        if (i == 128567) {
                            i = 128576;
                        }
                        if (i == 128580) {
                            i = 129295;
                        }
                        if (i == 129301) {
                            i = 129311;
                        }
                        if (i == 129317) {
                            i = 129318
                        }
                        if (i == 129327) {
                            i = 129487;
                        }
                        r++;
                    }
                    currentMessageText.innerHTML = newEditMessage;
                }
            },
            function (textResult, jsonResult) {
                console.log(textResult);
                //If error
                if (jsonResult.editMessageStatus != 0) {
                    switch (jsonResult.editMessageStatus) {
                        case 1:
                            ShowAlert("alert-bar", "Error", "Error", "Empty Values")
                            break;
                        case 2:
                            ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This")
                            break;
                        case 3:
                            ShowAlert("alert-bar", "Error", "Error", "Directory Non-Existent")
                            break;
                        case 4:
                            ShowAlert("alert-bar", "Error", "Error", "Message Don't Exists")
                            break;
                        case 5:
                            ShowAlert("alert-bar", "Error", "Error", "Message Deleted")
                            break;

                    }
                }
                //If success
                else {
                    hideEditMessagePopup()
                    ShowAlert("alert-bar", "success", "Success", "Message Successfully Updated")
                    newEditMessage = jsonResult.newMessage;
                }
            },
            function () {
                ShowAlert("alert-bar", "Error", "Error", "There's an error, please try again later")
            });
    } else {
        ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
    }
}

function deleteMessage(rootUrl, msgId, chatId, userId) {
    if (localStorage.getItem("isAdmin") == 1 || localStorage.getItem("userId") == userId) {

        let deleteMessageLoading = document.getElementById("delete-message-loading");
        let deleteBtnMessage = document.getElementById("delete-message-btn-text")
        let currentMessage = document.getElementById("chat-messages-" + msgId);

        deleteBtnMessage.classList.add("delete-message-btn-text-hide");
        setTimeout(() => {
            deleteMessageLoading.classList.add("delete-message-loading-show");
            deleteBtnMessage.style.display = "none";
            setTimeout(() => {
                deleteMessageLoading.style.display = "inline-block";
            }, 10);
        }, 300);

        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "user-id", userId);
        EasyHttpRequest.AddField(formData, "msg-id", msgId);
        EasyHttpRequest.AddField(formData, "chat-id", chatId);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/delete-message-api.php", formDataCompiled,
            function () {
                /* When The Request is Done */
                deleteMessageLoading.classList.remove("delete-message-loading-show");
                setTimeout(() => {
                    deleteMessageLoading.style.display = "none";
                    deleteBtnMessage.style.display = "inline-block";
                    setTimeout(() => {
                        deleteBtnMessage.classList.remove("delete-message-btn-text-hide");
                    }, 10);
                }, 300);
            },
            function (textResult, jsonResult) {
                console.log(textResult);
                //If error
                if (jsonResult.deleteMessageStatus != 0) {
                    switch (jsonResult.deleteMessageStatus) {
                        case 1:
                            ShowAlert("alert-bar", "Error", "Error", "Empty Values")
                            break;
                        case 2:
                            ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This")
                            break;
                        case 3:
                            ShowAlert("alert-bar", "Error", "Error", "Directory Non-Existent")
                            break;
                        case 4:
                            ShowAlert("alert-bar", "Error", "Error", "Message Don't Exists")
                            break;
                        case 5:
                            ShowAlert("alert-bar", "Error", "Error", "Message Already Deleted")
                            break;

                    }
                }
                //If success
                else {
                    hideDeleteMessagePopup()
                    ShowAlert("alert-bar", "Success", "Success", "Message Successfully Deleted")
                    document.getElementById("message-text-" + msgId).innerHTML = "<b><i>Message Deleted</i></b>";
                }
            },
            function () {
                ShowAlert("alert-bar", "Error", "Error", "There's an error, please try again later")
            });
    } else {
        ShowAlert("alert-bar", "Error", "Error", "You Don't Have Permission For This");
    }
}

/* RELOAD THE CHAT TO BRING NEW MESSAGES */

let reloadChats;
let oldMessageElement;
let oldMessage;
let newMessageChat;
let chatsLength;
let isYourMessageReload;
let userClassReload;
let isMediaReload;
let messageTest;

function reloadChat(rootUrl, id) {
    let reloadLoading = document.getElementById("reload-loading");
    reloadLoading.classList.add("reload-loading-show");



    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
        function () {
            /* When The Request Is Done */

            setTimeout(() => {
                if (reloadChats != undefined) {

                    function changeActualMessages(n, index) {

                        if (document.getElementById(`chat-messages-${index}`) != null) {
                            oldMessageElement = document.getElementById(`message-text-${index}`);
                            messageTest = n.message.replace(/%DOMAIN%/gi, `${rootUrl}`);
                            messageTest = messageTest.replace(/'/gi, '"');
                            console.log(messageTest);
                            console.log(oldMessageElement.innerHTML);
                            console.log(n.msgId);
                            console.log(messagesId[index]);
                            if (n.msgId != messagesId[index] || messageTest != oldMessageElement.innerHTML) {
                                isYourMessageReload = false;
                                isMediaReload = false;
                                userImg = rootUrl + "img/" + "403024_avatar_boy_male_user_young_icon.png";
                                if (n.img != "") {
                                    userImg = rootUrl + "admin/received-files/avatars/" + n.img;
                                }
                                userClassReload = "";
                                if (localStorage.getItem("userId") == n.userId) {
                                    userClassReload = "chat-our-message";
                                    isYourMessageReload = true;
                                }
                                if (n.messageMedia != "") {
                                    isMediaReload = true;
                                }

                                /* 
                                document.getElementById("chat-messages-" + index).id = `chat-messages-${index}`;
                                document.getElementById("message-" + index).id = `message-${index}`;
                                document.getElementById("message-options-btn-" + index).id = `message-options-btn-${index}`;
                                document.getElementById("message-img-box-" + index).id = `message-img-box-${index}`;
                                document.getElementById("message-id-" + index).id = `message-id-${index}`;
                                document.getElementById("message-text-" + index).id = `message-text-${index}`;
                                document.getElementById("message-options-container-" + index).id = `message-options-container-${index}`; 
                                */

                                document.getElementById("chat-messages-" + index).setAttribute("onmouseover", `showOptionBtn(${index}, ${n.userId})`);
                                document.getElementById(`message-${index}`).className = `chat-message ${userClassReload}`;
                                document.getElementById(`message-options-btn-${index}`).setAttribute("onclick", `showMessagesOptions('${rootUrl}', ${index}, ${id}, ${n.userId}, ${isMediaReload})`);
                                document.getElementById(`message-img-box-${index}`).setAttribute("onmouseover", `showMiniProfile('${rootUrl}',${n.userId}, ${index}, ${isYourMessageReload})`);
                                document.getElementById(`message-id-${index}`).src = `${userImg}`;
                                document.getElementById(`message-id-${index}`).setAttribute("onclick", `showUserProfileInnerEvent('${rootUrl}',${n.userId})`);






                                if (n.isDeleted == true) {
                                    document.getElementById("chat-messages-" + index).setAttribute("onmouseover", `showOptionBtn(${index}, ${n.userId}, ${true})`);
                                    oldMessageElement.innerHTML = "<b><i>Message Deleted</i></b>";
                                } else {
                                    newMessageChat = n.message;
                                    if (oldMessageElement.innerHTML != newMessageChat) {
                                        let r = 0;
                                        let m = 0;
                                        for (let i = 128512; i <= 129488; i++) {

                                            if (r == 10) {
                                                m++;
                                                r = 0;
                                            }

                                            let emojiCode = "&#" + i;
                                            let pattern = new RegExp(`\€[${m}][${r}]`, "g");

                                            newMessageChat = newMessageChat.replace(pattern, emojiCode);
                                            if (i == 128567) {
                                                i = 128576;
                                            }
                                            if (i == 128580) {
                                                i = 129295;
                                            }
                                            if (i == 129301) {
                                                i = 129311;
                                            }
                                            if (i == 129317) {
                                                i = 129318
                                            }
                                            if (i == 129327) {
                                                i = 129487;
                                            }
                                            r++;
                                        }
                                        messagesId[index] = n.msgId;
                                        newMessageChat = newMessageChat.replace(/%DOMAIN%/gi, `${rootUrl}`);
                                        oldMessageElement.innerHTML = newMessageChat;

                                    }
                                }
                            }
                        }
                    }
                }

                reloadChats.chatMessage.forEach(changeActualMessages);

                if (k < 98) {
                    reloadChats.chatMessage.forEach(n => {
                        if (n.userId != localStorage.getItem("userId")) {
                            if (n.msgId > y) {
                                isYourMessageReload = false;
                                isMedia = false;
                                userImg = rootUrl + "img/" + "403024_avatar_boy_male_user_young_icon.png";
                                if (n.img != "") {
                                    userImg = rootUrl + "admin/received-files/avatars/" + n.img;
                                }
                                userClass = "";
                                if (localStorage.getItem("userId") == n.userId) {
                                    userClass = "chat-our-message"
                                    isYourMessageReload = true;
                                }
                                if (n.messageMedia != "") {
                                    isMedia = true;
                                }
                                let message =
                                    `
                                                    <div class="chat-messages" id="chat-messages-${k}" onmouseover="showOptionBtn(${k}, ${n.userId})" onmouseout="hideOptionBtn(${k}, ${localStorage.getItem("userId")})">
                                                    <div class="chat-message ${userClass}" id="message-${k}">
                                                    <div class="message-options-container" id="message-options-container-${k}">
                                                    <div class="message-options-btn-box">
                                                    <i class="uil uil-ellipsis-v message-options-btn" id="message-options-btn-${k}" onclick="showMessagesOptions('${rootUrl}',${k},${id}, ${n.userId}, ${isMedia})"></i>
                                                    </div>
                                                    </div>
                                                    <div class="message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${n.userId}, ${k}, ${isYourMessageReload})" onmouseout="hideMiniProfile()">
                                                    <img src="${userImg}" alt="" class="message-img img-circle" onclick="showUserProfileInnerEvent('${rootUrl}',${n.userId})" id="message-id-${k}">
                                                    </div>
                                                    <div class="message" id="message-text-${k}">${n.message}</div>
                                                    </div>
                                                    </div>
                                                    `
                                if (k < 98) {
                                    k++
                                }
                                messagesId.push(n.msgId);
                                y = n.msgId;
                                let r = 0;
                                let m = 0;
                                for (let i = 128512; i <= 129488; i++) {

                                    if (r == 10) {
                                        m++;
                                        r = 0;
                                    }

                                    let emojiCode = "&#" + i;
                                    let pattern = new RegExp(`\€[${m}][${r}]`, "g");

                                    message = message.replace(pattern, emojiCode);
                                    if (i == 128567) {
                                        i = 128576;
                                    }
                                    if (i == 128580) {
                                        i = 129295;
                                    }
                                    if (i == 129301) {
                                        i = 129311;
                                    }
                                    if (i == 129317) {
                                        i = 129318
                                    }
                                    if (i == 129327) {
                                        i = 129487;
                                    }
                                    r++;

                                }

                                message = message.replace(/%DOMAIN%/gi, `${rootUrl}`);
                                document.getElementById("chat-messages-box").innerHTML += message;

                                chatBox.scrollTop = 9999999;
                            }
                        }
                    });
                }
            }, 100);
            setTimeout(() => {

                reloadLoading.classList.remove("reload-loading-show");
            }, 150);
        },


        function (textResult, jsonResult) {
            //If error
            if (jsonResult.readChatStatus != 0) {
                switch (jsonResult.readChatStatus) {
                    case 1:
                        ShowPopUpDialog("popup-error", "Error!", "Non-existent directory");
                }
            }
            //If success
            else {
                reloadChats = jsonResult.allChats[id];


            }
        },
        function () {
            /* Case The Request can't be done */
            ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
        });
}