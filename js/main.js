//Show dialog box
function ShowPopUpDialog(id, title, message) {
    //Get elements of popup
    var popupElement = document.getElementById(id);
    var titleElement = document.querySelectorAll("#popup-title");
    var messageElement = document.querySelectorAll("#popup-text");
    var buttonElement = document.querySelectorAll("#ok-btn");

    //Build the popup
    titleElement.forEach(n => n.innerHTML = title);
    messageElement.forEach(n => n.innerHTML = message);

    //Show the popup
    popupElement.classList.add("open-popup");
}

/* ==================== HIDE POPUP =================== */

function hideConfirmMessage() {
    const popup = document.querySelectorAll(".popup");
    popup.forEach(n => n.classList.remove("open-popup"));
}