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
    setTimeout(() => {
        isShowing = true;
        profileCard.classList.add("profile-active");

    }, 100);
}));

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

    loading.style.display = "inline-block";
    isRunning = true;
    setTimeout(() => {
        popup.classList.add("open-popup");
        popupTitle.innerHTML = "Update Data"
        popupText.innerHTML = "Data Successfully Updated"
        info.style.display = "inline-block";
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