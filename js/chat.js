//Global Variables
let globalLoading = document.getElementById("global-loading");
let k = 0;
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

function showUserProfileInnerEvent() {
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
chatHeader.addEventListener("click", () => {
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
        }
    }, 50);
})


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
        if (userProfileId == userId || isAdmin != undefined) {
            setTimeout(() => {
                let avatarName;
                progressBar.classList.add("progress-bar-active");

                var formData = EasyHttpRequest.InstantiateFormData();
                EasyHttpRequest.AddField(formData, "user-id", userProfileId);
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
        EasyHttpRequest.AddField(formData, "user-id", userProfileId);
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

function sendMessageOnEnter(event) {
    if (event.key === "Enter") {
        send.click();
    }
}
let isSending = false;

function sendMessage() {
    if (message.value != "" && isSending == false) {
        isSending = true;
        globalLoading.classList.add("global-loading-show");
        setTimeout(() => {
            k++;
            message = document.getElementById("message-field");
            let content = `<div class="chat-messages">    
                    <div class="chat-message">
                    <div class = "message-img-box open-user-profile" id="message-img-box-${k}" onmouseover="showMiniProfile(${k})" onmouseout="hideMiniProfile()" >
                    <img src = "../img/user.png" class = "message-img img-circle" onclick = "showUserProfileInnerEvent()" onmouseout = "hideMiniProfile()">
                    </div>
                    <div class="message">
                    ${message.value}
                    </div>
                    </div>
                    </div>`
            chatMessages.innerHTML += content;
            message.value = "";
            globalLoading.classList.remove("global-loading-show");
            isSending = false;
            chatBox.scrollTop = 9999999;
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

function showChat() {

    globalLoading.classList.add("global-loading-show");
    chat.forEach(n => n.classList.remove("chat-content-box-show"));
    chatBlank.classList.remove("blank-content-hide");
    setTimeout(() => {
        chatContent.classList.add("chat-content-show");
        chatBlank.classList.add("blank-content-hide");
        chat.forEach(n => n.classList.add("chat-content-box-show"));
        globalLoading.classList.remove("global-loading-show");
    }, 1000);
}

/* ==================== SEARCH RESULTS  =================== */
let searchInput = document.getElementById("search-input");
let searchResultBox = document.getElementById("search-result-box");
let searchLoading = document.getElementById("search-loading")
let isShowingResults = false;
searchInput.addEventListener("keypress", (event) => {
    searchResultBox.classList.remove("search-result-box-show");
    searchLoading.classList.add("search-loading-show");
    setTimeout(() => {
        console.log(searchInput == document.activeElement);
        if (searchInput == document.activeElement) {
            searchResultBox.classList.add("search-result-box-show");
            searchLoading.classList.remove("search-loading-show");
            isShowingResults = true;
        } else {
            searchLoading.classList.remove("search-loading-show");
        }
    }, 1000);
})

let hideSearchResults = document.querySelectorAll(".hide-search-results");
hideSearchResults.forEach(n => n.addEventListener("click", () => {
    if (isShowingResults == true) {
        searchResultBox.classList.remove("search-result-box-show");
        isShowingResults = false;
    }
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
let mustShowMiniProfile = true;

function showMiniProfile(id) {
    let targetElement = document.getElementById("message-img-box-" + id);
    mustShowMiniProfile = true;

    let elementPosition = miniProfile.getBoundingClientRect();
    let targetElementPosition = targetElement.getBoundingClientRect();
    console.log(elementPosition);

    miniProfile.style.top = (targetElementPosition.top - 170) + "px";
    miniProfile.style.left = (targetElementPosition.right) + "px";

    /*
     miniProfile.style.top = (targetElementPosition.top - 170) + "px";
     miniProfile.style.right = (targetElementPosition.right + 550) + "px";
     */

    setTimeout(() => {
        if (mustShowMiniProfile == true) {
            miniProfile.classList.add("mini-profile-show");
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