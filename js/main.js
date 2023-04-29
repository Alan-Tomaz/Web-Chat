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

/* ==================== SHOW ALERT BAR =================== */

//Show dialog box
let showAlertTimeOut;
let hideAlertTimeOut;
let hideAlertDisplayTimeOut;

function ShowAlert(id, type, title, message) {




    clearTimeout(showAlertTimeOut);
    clearTimeout(hideAlertTimeOut);
    clearTimeout(hideAlertDisplayTimeOut);

    //Get elements of popup
    var alertElement = document.getElementById(id);
    var titleElement = document.getElementById("alert-title");
    var messageElement = document.getElementById("alert-text");

    alertElement.style.display = "flex";
    alertElement.classList.remove("alert-show");


    switch (type) {
        case "error":
        case "Error":
        case "ERROR":
            alertElement.classList.remove("alert-success")
            alertElement.classList.add("alert-error")
            break;
        case "Success":
        case "success":
        case "SUCCESS":
            alertElement.classList.remove("alert-error")
            alertElement.classList.add("alert-success")
            break;
    }

    //Build the popup
    titleElement.innerHTML = title;
    messageElement.innerHTML = message;

    //Show the popup
    alertElement.style.display = "flex";
    showAlertTimeOut = setTimeout(() => {
        alertElement.classList.add("alert-show");
        hideAlertTimeOut = setTimeout(() => {
            alertElement.classList.remove("alert-show");
            hideAlertDisplayTimeOut = setTimeout(() => {
                alertElement.style.display = "none";
            }, 1100);
        }, 5000);
    }, 10);
}