//Global Variables
let globalLoading = document.getElementById("global-loading");

/* ==================== GET THE AVATAR NAME FILE AND PUT ON THE INPUT =================== */

let avatarInput = document.getElementById('avatar'),
    fileName = document.getElementById('file-name');

if (avatarInput) {
    avatarInput.addEventListener('change', function () {
        fileName.value = this.files[0].name;
    });
}

/* ==================== SCROLL THE CHAT TO THE END =================== */
let chatBox = document.getElementById('chat-box');
if (chatBox) {
    chatBox.scrollTop = 9999999;
}

/* ==================== SHOW AND HIDE THE PROFILE CARD =================== */
let profileCard = document.getElementById("profile-card");

let isShowing = true;

let hideUserProfile = document.querySelectorAll(".hide-user-profile");

hideUserProfile.forEach(n => n.addEventListener("click", () => {
    isShowing = false;
    profileCard.classList.remove("profile-active");
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
let updateInput = document.getElementById('upload-avatar');

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

function updateAvatar() {
    if (updateInput.value != "") {
        let closeBtn = document.getElementById("close-0");
        let updateImg = document.getElementById("update-img")
        let checkBtn = document.getElementById("update-0");
        let loading = document.getElementById("loading-0");
        let popup = document.getElementById("popup");
        let popupTitle = document.getElementById("popup-title");
        let popupText = document.getElementById("popup-text");
        let input = document.getElementById("upload-avatar");
        checkBtn.style.display = "none";
        closeBtn.style.display = "none";
        loading.style.display = "inline-block";
        isRunning = true;
        setTimeout(() => {
            popup.classList.add("open-popup");
            popupTitle.innerHTML = "Update Avatar"
            popupText.innerHTML = "Avatar Successfully Updated"
            updateImg.style.display = "none";
            loading.style.display = "none";
            isRunning = false;
        }, 5000);
    }
}

/* ==================== UPDATE DATA =================== */
function updateData(id) {
    let input = document.getElementById("inner-input-" + id);
    let editBtn = document.getElementById("edit-" + id);
    let info = document.getElementById("info-" + id);
    let checkBtn = document.getElementById("update-" + id);
    let loading = document.getElementById("loading-" + id);
    let hideCloseBtns = document.querySelectorAll(".close-btn");
    hideCloseBtns.forEach(n => n.style.display = "none");
    checkBtn.style.display = "none";
    let popup = document.getElementById("popup");
    let popupTitle = document.getElementById("popup-title");
    let popupText = document.getElementById("popup-text");
    input.disabled = "true";
    loading.style.display = "inline-block";
    isRunning = true;
    setTimeout(() => {
        popup.classList.add("open-popup");
        popupTitle.innerHTML = "Update Data"
        popupText.innerHTML = "Data Successfully Updated"
        info.style.display = "inline-block";
        input.disabled = "false";
        input.style.display = "none";
        editBtn.style.display = "inline-block";
        loading.style.display = "none";
        isRunning = false;

    }, 5000);
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


/* ==================== HIDE POPUP =================== */

function hideConfirmMessage() {
    let popup = document.getElementById("popup");
    popup.classList.remove("open-popup");
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
})
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
})
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

function sendMessage() {
    globalLoading.classList.add("global-loading-show");
    setTimeout(() => {
        message = document.getElementById("message-field");
        let content = `<div class="chat-messages">    
                    <div class="chat-message">
                    <div class="message-img-box open-user-profile">
                        <img src="../img/user.png" class="message-img img-circle" onclick="showUserProfileInnerEvent()">
                    </div>
                    <div class="message">
                    ${message.value}
                    </div>
                    </div>
                    </div>`
        chatMessages.innerHTML += content;
        message.value = "";
        globalLoading.classList.remove("global-loading-show");
    }, 1000);
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

function showChat() {

    globalLoading.classList.add("global-loading-show");
    chat.forEach(n => n.classList.remove("chat-content-box-show"));
    chatBlank.classList.remove("blank-content-hide");
    setTimeout(() => {
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