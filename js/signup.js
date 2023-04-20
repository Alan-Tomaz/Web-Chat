/* ======================= PHONE NUMBER FORMATTING ========================== */
const phoneNumber = document.getElementById("phone");

/*  
 * Phone number formatting when the key is pressioned on the imput
 */
phoneNumber.addEventListener("keydown", () => {
    // phone number input

    /* 
     * assoc the formatting function to a const and later define the value of input as this const
     */
    const formattedInputValue = formatPhoneNumber(phoneNumber.value);
    phoneNumber.value = formattedInputValue;
})

/* function formatPhoneNumber(value) {
    if (!value)
        return value;
    const phoneNumber = value.replace(/[^\d]/g, ''),
        phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3)
        return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    return `(${phoneNumber.slice(0,2)}) ${phoneNumber.slice(2,7)}-${phoneNumber.slice(7,10)}`
} */

function formatPhoneNumber(value) {
    if (!value)
        return value;
    const phoneNumber = value.replace(/[^\d]/g, ''),
        phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3)
        return phoneNumber;
    if (phoneNumberLength < 4) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2,3)}`;
    }
    if (phoneNumberLength < 8) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2,3)} ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0,2)}) ${phoneNumber.slice(2,3)} ${phoneNumber.slice(3,7)}-${phoneNumber.slice(7,10)}`
}

/* ============================ SHOW DATA INPUT =========================== */
//Find elements of birth
var birthFake = document.getElementById("birth-date-impostor");
var birthOriginal = document.getElementById("birth-date-hidden");
//Setup the events
window.onscroll = function () {
    TranslateTheBirthField();
}
TranslateTheBirthField();

//On click on field
function OnClickBirthField() {
    //Send fake click to original birth input
    birthOriginal.showPicker();
    TranslateTheBirthField();
}

//On change data of original birth field, put it on impostor too
function OnChangeValueFromOriginalBirth() {
    //Pass the data
    birthFake.value = birthOriginal.value;
}

//Auto put the fake birth field to next of impostor field
function TranslateTheBirthField() {
    //Get impostor birth field position and translate the original birth field to below of him
    var rect = birthFake.getBoundingClientRect();
    birthOriginal.style.top = (rect.top + 46) + "px";
    birthOriginal.style.left = rect.left + "px";
}


/* ============================ MAKE SIGNUP WITH AJAX AND THE BACKEND API =========================== */

//On click on sign up button
function OnClickSignUp(rootUrl) {
    //Get value for all fields
    var username = document.getElementById("nick").value;
    var email = document.getElementById("email").value;
    var telephone = document.getElementById("phone").value;
    var birth = document.getElementById("birth-date-impostor").value;
    var location = document.getElementById("location").value;
    var biography = document.getElementById("bio-input").value;
    var password = document.getElementById("password").value;
    var passwordR = document.getElementById("password-retype").value;

    /* Function of validate the number according to the Brazilian format */
    function validatePhoneNumber(phoneNumber) {
        /* phoneNumber = phoneNumber.replace(/\s/g, ''); */

        mobilePhonePattern = /^\s*([(]\d{2}[)]|\d{0})[-. ]?(\d{1}|\d{0})[-. ]?(\d{4}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/;

        return mobilePhonePattern.test(phoneNumber);
    }

    /* Function of validate the email */
    function validatePhoneNumber(email) {
        /* phoneNumber = phoneNumber.replace(/\s/g, ''); */

        emailPattern = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/;

        return emailPattern.test(email);
    }

    //If some is empty, cancel
    if (username == "" || email == "" || telephone == "" || birth == "" || location == "" || biography == "" || password == "" || passwordR == "") {
        ShowPopUpDialog("popup", "Error!", "The formulary have empty fields. Please, fill all fields of formulary!");
        return;
    }

    //If password is too short, cancel
    else if (password.length < 8) {
        ShowPopUpDialog("popup", "Error!", "Your Password is Too Short!");
        return;
    }
    //If passwords don't match, cancel
    else if (password != passwordR) {
        ShowPopUpDialog("popup", "Error!", "The Passwords don't match!");
        return;
    }


    //If the phone number format is wrong, cancel
    else if (!validatePhoneNumber(telephone)) {
        ShowPopUpDialog("popup", "Error!", "The Phone Number Format Is Wrong!");
        return;
    }

    //If the email format is wrong, cancel
    else if (!validateEmail(email)) {
        ShowPopUpDialog("popup", "Error!", "The Email Format Is Wrong!");
        return;
    }

    // Use AJAX to comunicate to backend and send data to Database
    else {
        //Create the FormData
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "username", username);
        EasyHttpRequest.AddField(formData, "email", email);
        EasyHttpRequest.AddField(formData, "telephone", telephone);
        EasyHttpRequest.AddField(formData, "birth", birth);
        EasyHttpRequest.AddField(formData, "location", location);
        EasyHttpRequest.AddField(formData, "biography", biography);
        EasyHttpRequest.AddField(formData, "password", password);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        //Change the UI

        var signUpButton = document.getElementById("sign-up-button");
        const formLoading = document.getElementById("form-loading");

        signUpButton.disabled = "true";
        signUpButton.classList.add("content-btn-loading");
        formLoading.classList.add("form-loading-show");

        //Do the API request
        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/sign-up.php", formDataCompiled,
            function () {
                //Reset the UI
                var signUpButton = document.getElementById("sign-up-button");
                signUpButton.disabled = "false";
                signUpButton.classList.remove("content-btn-loading");
                formLoading.classList.remove("form-loading-show");
            },
            function (textResult, jsonResult) {
                //If error
                if (jsonResult.isSignUpSuccess == false) {
                    //Show custom error message
                    if (jsonResult.usernameStatus == 0)
                        ShowPopUpDialog("popup", "Error!", "Invalid Username!");
                    if (jsonResult.emailStatus == 0)
                        ShowPopUpDialog("popup", "Error!", "Invalid Email!");
                }
                //If success
                if (jsonResult.isSignUpSuccess == true) {
                    //Redirect to chat
                    window.location.href = rootUrl + "pages/chat.php";
                }
            },
            function () {
                //ao dar erro
            });
    }
}