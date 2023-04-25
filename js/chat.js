//Global Variables
let globalLoading = document.getElementById("global-loading");
let k = 0;

let messageId = 0;

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



    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
        function () {
            /* When The Request Is Done */

            /* Create The Chats */
            function loadChat(n, index) {
                if (n.chatInfo[0].img == "") {
                    var img = "chat-generic-img.png";
                } else {
                    var img = n.chatInfo[0].img;
                }
                newChat =
                    `
                    <div class = "chats channels" onclick = "showChat('${rootUrl}',${index})" >
                    <div class = "chats-img-box">
                    <img src = "${rootUrl}img/${img}" class = "chats-img img-circle" >
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
                        } else {
                            document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}',${id})`)
                        }
                    }

                    if (localStorage.getItem("userId") != id) {
                        let logoutBtn = document.getElementById("logout-profile");
                        logoutBtn.style.display = "none";
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
                        } else {
                            document.getElementById("update-0").setAttribute("onclick", `updateAvatar('${rootUrl}',${id})`)
                        }
                    }

                    if (localStorage.getItem("userId") != id) {
                        let logoutBtn = document.getElementById("logout-profile");
                        logoutBtn.style.display = "none";
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
                                document.getElementById("profile-img").src = rootUrl + "admin/received-files/avatars/" + chats.chatInfo[0].img;
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
                                document.getElementById("profile-img").src = rootUrl + "admin/received-files/avatars/" + chats.chatInfo[0].img;
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
                            updateImgs(avatarName, rootUrl);
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
function updateImgs(avatarName, rootUrl) {
    let profileImg = document.getElementById("profile-img");
    let userImg = document.getElementById("user-img");
    profileImg.src = rootUrl + "admin/received-files/avatars/" + avatarName;
    userImg.src = rootUrl + "admin/received-files/avatars/" + avatarName;
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
for (let i = 128512; i <= 129488; i++) {
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
                        }
                    }
                    //If success
                    else {

                        message = document.getElementById("message-field");
                        let content = `<div class="chat-messages">    
                    <div class="chat-message chat-our-message">
                    <div class = "message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${localStorage.getItem("userId")}, ${k})" onmouseout="hideMiniProfile()" >
                    <img src="${rootUrl}${jsonResult.avatar}" class = "message-img img-circle" onclick = "showUserProfileInnerEvent('${rootUrl}', ${localStorage.getItem("userId")})" onmouseout = "hideMiniProfile()" id="message-id-${k}">
                    </div>
                    <div class="message">
                    ${message.value}
                    </div>
                    </div>
                    </div>`
                        k++;
                        chatMessages.innerHTML += content;
                        message.value = "";
                        messageLoading.classList.remove("send-message-loading-show");
                        sendMessageIcon.classList.remove("send-hide");
                        isSending = false;
                        chatBox.scrollTop = 9999999;
                    }
                },
                function () {
                    /* Case The Request can't be done */
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });
        }, 1000);
    }
}

/* ==================== SHOW EMOJIS =================== */
function showEmoji(emojiUnicode) {
    message.value += "&#" + emojiUnicode;
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
    fileInput2.disabled = true;
    submitBtn3.disabled = true;
    fileCloseBtn.style.display = "none";
    fileLoading.style.display = "inline-block";
    setTimeout(() => {
        message = document.getElementById("message-field");
        message.value = `<img src="${fileInput.value}" alt="Image Not Found">`;
        fileSend.classList.remove("file-send-content-show");
        fileLoading.style.display = "none";
        fileInput2.disabled = false;
        submitBtn3.disabled = false;
    }, 1000);
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
    fileInput2.disabled = true;
    submitBtn3.disabled = true;
    fileCloseBtn.style.display = "none";
    fileLoading.style.display = "inline-block";
    let videoUrl = fileInput.value;
    videoUrl = videoUrl.split("https://www.youtube.com/watch?v=")
    console.log(videoUrl)
    setTimeout(() => {
        message = document.getElementById("message-field");
        message.value = `<iframe src="https://www.youtube.com/embed/${videoUrl[1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        fileSend.classList.remove("file-send-content-show");
        fileLoading.style.display = "none";
        fileInput2.disabled = false;
        submitBtn3.disabled = false;
    }, 1000);
}

/* ==================== SHOW CHAT when a conversation is opened  =================== */
let chatBlank = document.getElementById("chat-blank");
let chat = document.querySelectorAll(".chat-content-box");
let chatContent = document.getElementById("chat-content");

function showChat(rootUrl, id) {
    globalLoading.classList.add("global-loading-show");
    chat.forEach(n => n.classList.remove("chat-content-box-show"));
    chatBlank.classList.remove("blank-content-hide");


    EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", "",
        function () {
            /* When The Request Is Done */
            document.getElementById("chat-messages-box").innerHTML = "";

            /* Create The Chats */

            groupImg = rootUrl + "img/chat-generic-img.png";
            if (chats.chatInfo[0].img != "") {
                groupImg = rootUrl + "admin/received-files/chat-img/" + chat.chatInfo[0].img;
            }
            document.getElementById("chat-img").src = groupImg;
            document.getElementById("chat-name").innerHTML = chats.chatInfo[0].name;
            document.getElementById("chat-desc").innerHTML = chats.chatInfo[0].description;


            function showMessages(n, index) {

                userImg = rootUrl + "img/" + "403024_avatar_boy_male_user_young_icon.png"
                if (n.img != "") {
                    userImg = rootUrl + "admin/received-files/avatars/" + n.img;
                }
                userClass = "";
                if (localStorage.getItem("userId") == n.userId) {
                    userClass = "chat-our-message"
                }
                let message =
                    `
                <div class="chat-messages">
                        <div class="chat-message ${userClass}">
                            <div class="message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile('${rootUrl}',${n.userId}, ${k})" onmouseout="hideMiniProfile()">
                                <img src="${userImg}" alt="" class="message-img img-circle" onclick="showUserProfileInnerEvent('${rootUrl}',${n.userId})" id="message-id-${k}">
                            </div>
                            <div class="message">${n.message}</div>
                        </div>
                    </div>
                `
                k++;
                document.getElementById("chat-messages-box").innerHTML += message;
            }

            chats.chatMessage.forEach(showMessages)

            setTimeout(() => {
                document.getElementById("send").setAttribute("onclick", `sendMessage('${rootUrl}', ${id})`)
                document.getElementById("chat-header").setAttribute("onclick", `showChatInfo('${rootUrl}', ${id})`);
                chatContent.classList.add("chat-content-show");
                chatBlank.classList.add("blank-content-hide");
                chat.forEach(n => n.classList.add("chat-content-box-show"));
                globalLoading.classList.remove("global-loading-show");
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
let isShowingResults = false;
let isSearching = [];
let isSearchIndex;
let milliseconds = new Date();
/* milliseconds = milliseconds.setTime(date.getTime()); */

function searchChats(rootUrl, date, randomNumber) {
    isSearching.forEach(n => n = false);
    date = new Date();
    randomNumber = Math.random() * ((milliseconds.setTime(date.getTime())) - 0) + 0
    isSearching[randomNumber] = false;
    if (isSearching[randomNumber] == false) {
        isSearching[randomNumber] = true;
        searchInput = document.getElementById("search-input");
        searchResultBox = document.getElementById("search-result-box");
        searchResultBox.innerHTML = "";
        searchResultBox.classList.remove("search-result-box-show");
        searchLoading = document.getElementById("search-loading");
        searchLoading.classList.add("search-loading-show");
        let chats = [];
        let chatsDiv;

        if (isSearching[randomNumber] == true) {
            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "chat-name", searchInput.value);
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);
            EasyHttpRequest.StartAsyncGetRequest(rootUrl + "apis/read-chat-messages-api.php", formDataCompiled,
                function () {
                    if (isSearching[randomNumber] == true) {
                        /* When The Request Is Done */
                        isSearching[randomNumber] = false;

                        /* Create The Chats */
                        function loadChat(n, index) {
                            if (n.chatInfo[0].img == "") {
                                var img = "chat-generic-img.png";
                            } else {
                                var img = n.chatInfo[0].img;
                            }
                            newChat =
                                `
                                <div class = "chats search-chat" onclick = "showChat(${index})" >
                                <div class = "chats-img-box">
                                <img src = "${rootUrl}img/${img}" class = "chats-img img-circle" >
                                </div> 
                                <div class = "chats-info" >
                                <div class = "chats-name-box" >
                                <h4 class = "chats-name">${n.chatInfo[0].name}</h4> 
                                </div> 
                                <hr class = "search-chats-hr hr">
                                </div> 
                                </div>
                                `
                            searchResultBox.innerHTML += newChat;
                        }

                        setTimeout(() => {
                            searchResultBox.innerHTML = "";

                            chats.forEach(loadChat);

                            chatsDiv = document.querySelectorAll(".search-chat");
                            chatsDiv.forEach(n => n.classList.add("chats-show"));
                            let searchLoading = document.getElementById("search-loading");
                            searchLoading.classList.remove("search-loading-show");

                        }, 100);
                    }
                },
                function (textResult, jsonResult) {
                    if (isSearching[randomNumber] == true) {
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
                            searchResultBox.classList.add("search-result-box-show");
                            isShowingResults = true;

                        }
                    }
                },
                function () {
                    /* Case The Request can't be done */
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });

        }

    }
}

/* let hideSearchResults = document.querySelectorAll(".hide-search-results");
hideSearchResults.forEach(n => n.addEventListener("click", () => {
    searchResultBox.innerHTML = "";
    searchResultBox.classList.remove("search-result-box-show");
    searchLoading.classList.remove("search-loading-show");
    isShowingResults = false;
    isSearching.forEach(n => n = false);

})) */

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
let mustShowMiniProfile;


function showMiniProfile(rootUrl, userId, id) {

    mustShowMiniProfile = true;

    let targetElement = document.getElementById("message-img-box-" + id);

    let elementPosition = miniProfile.getBoundingClientRect();
    let targetElementPosition = targetElement.getBoundingClientRect();

    miniProfile.style.top = (targetElementPosition.top - 140) + "px";
    miniProfile.style.left = (targetElementPosition.right - 40) + "px";

    /*
     miniProfile.style.top = (targetElementPosition.top - 170) + "px";
     miniProfile.style.right = (targetElementPosition.right + 550) + "px";
     */

    setTimeout(() => {
        if (mustShowMiniProfile == true) {



            var formData = EasyHttpRequest.InstantiateFormData();
            EasyHttpRequest.AddField(formData, "user-id", userId);
            var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

            /* if (localStorage.getItem("isAdmin") != null || localStorage.getItem("userId") == id) {
                apiPath = rootUrl + "apis/show-user-profile-api.php";
            } */
            EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/show-user-api.php", formDataCompiled,
                function () {
                    /* When The Request Is Done */
                    if (mustShowMiniProfile == true) {
                        /* Create The Chats */

                        miniProfile.classList.add("mini-profile-show");
                    }
                },


                function (textResult, jsonResult) {
                    console.log(textResult);
                    //If error
                    if (jsonResult.showUserStatus != 0) {
                        switch (jsonResult.showUserStatus) {
                            case 1:
                            case 2:
                                ShowPopUpDialog("popup-error", "Error!", "User Don't Exists");

                                let miniProfileName = document.getElementById("mini-profile-name");
                                miniProfileName.innerHTML = "None";
                                let miniProfileBio = document.getElementById("mini-profile-bio");
                                miniProfileBio.innerHTML = "None";
                                let miniProfileActivity = document.getElementById("mini-profile-activity");
                                miniProfileActivity.innerHTML = "None";
                                let miniProfileImg = document.getElementById("mini-profile-img");
                                miniProfileImg.src = rootUrl + "img/403024_avatar_boy_male_user_young_icon.png";


                                break;
                        }
                    }
                    //If success
                    else {
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

                    }
                },
                function () {
                    /* Case The Request can't be done */
                    ShowPopUpDialog("popup-error", "Error!", "There was an error, please try again later.");
                });
        }
    }, 1000);
}

function hideMiniProfile() {
    mustShowMiniProfile = false;



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