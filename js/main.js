//Show dialog box
function ShowPopUpDialog(id, title, message) {
    //Get elements of popup
    var popupElement = document.getElementById(id);
    var titleElement = document.getElementById("popup-title");
    var messageElement = document.getElementById("popup-text");
    var buttonElement = document.getElementById("ok-btn");

    //Build the popup
    titleElement.innerHTML = title;
    messageElement.innerHTML = message;

    //Show the popup
    popupElement.classList.add("open-popup");
}

/* ==================== HIDE POPUP =================== */

function hideConfirmMessage() {
    const popup = document.querySelectorAll(".popup");
    popup.forEach(n => n.classList.remove("open-popup"));
}