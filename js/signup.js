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
    newBirthOriginalValue = birthOriginal.value.split("-")
    newBirthOriginalValue = newBirthOriginalValue[2] + "/" + newBirthOriginalValue[1] + "/" + newBirthOriginalValue[0];
    birthFake.value = newBirthOriginalValue;
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
    var phoneNumber = document.getElementById("phone").value;
    var birth = document.getElementById("birth-date-impostor").value;
    var location = document.getElementById("location").value;
    var biography = document.getElementById("bio-input").value;
    biography = biography.replace(/\n/g, "");
    var password = document.getElementById("password").value;
    var passwordR = document.getElementById("password-retype").value;


    const lowerPasswordRegex = /(?=.*[a-z])/,
        upperPasswordRegex = /(?=.*[A-Z])/,
        numberPasswordRegex = /(?=.*[0-9])/,
        specialPasswordRegex = /(?=.*[!@#\$%\^&\*])/;


    /* Function of validate the number according to the Brazilian format */
    const validatePhoneNumber = function (phoneNumber) {

        mobilePhonePattern = /^\s*([(]\d{2}[)]|\d{0})[-. ]?(\d{1}|\d{0})[-. ]?(\d{4}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/;

        return mobilePhonePattern.test(phoneNumber);
    }

    /* Function of validate the email */
    const validateEmailAddress = function (email) {

        emailPattern = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/;

        return emailPattern.test(email);
    }

    /* Function of validate the birth date */
    const validateBirthDate = function (birthDate) {

        datePattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

        return datePattern.test(birthDate);
    }



    //If some is empty, cancel
    if (username == "" || email == "" || phoneNumber == "" || birth == "" || location == "" || biography == "" || password == "" || passwordR == "") {
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

    //If password don't have at least one lowercase character, cancel
    else if (!lowerPasswordRegex.test(password)) {
        ShowPopUpDialog("popup", "Error", "The Password must have at least one lowercase character");
        return;
    }
    //If password don't have at least one uppercase character, cancel
    else if (!upperPasswordRegex.test(password)) {
        ShowPopUpDialog("popup", "Error", "The Password must have at least one uppercase character");
        return;
    }
    //If password don't have at least one number, cancel
    else if (!numberPasswordRegex.test(password)) {
        ShowPopUpDialog("popup", "Error", "The Password must have at least one number");
        return;
    }
    //If password don't have at least one special character, cancel
    else if (!specialPasswordRegex.test(password)) {
        ShowPopUpDialog("popup", "Error", "The Password must have at least one special character");
        return;
    }

    //If the phone number format is wrong, cancel
    else if (!validatePhoneNumber(phoneNumber)) {
        ShowPopUpDialog("popup", "Error!", "The Phone Number Format Is Wrong!");
        return;
    }
    //If the birth date format is wrong, cancel
    else if (!validateBirthDate(birth)) {
        ShowPopUpDialog("popup", "Error!", "Your Birth Date Format is Wrong!");
        return;
    }

    //If the email format is wrong, cancel
    else if (!validateEmailAddress(email)) {
        ShowPopUpDialog("popup", "Error!", "The Email Format Is Wrong!");
        return;
    }

    // Use AJAX to comunicate to backend and send data to Database
    else {
        //Create the FormData
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "username", username);
        EasyHttpRequest.AddField(formData, "email", email);
        EasyHttpRequest.AddField(formData, "phone-number", phoneNumber);
        EasyHttpRequest.AddField(formData, "birth", birth);
        EasyHttpRequest.AddField(formData, "location", location);
        EasyHttpRequest.AddField(formData, "biography", biography);
        EasyHttpRequest.AddField(formData, "password", password);
        EasyHttpRequest.AddField(formData, "password-retype", password);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        //Change the UI

        var signUpButton = document.getElementById("sign-up-button");
        const formLoading = document.getElementById("form-loading");

        signUpButton.disabled = true;
        signUpButton.classList.add("content-btn-loading");
        formLoading.classList.add("form-loading-show");

        //Do the API request
        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/signup-api.php", formDataCompiled,
            function () {
                //Reset the UI
                var signUpButton = document.getElementById("sign-up-button");
                signUpButton.disabled = false;
                signUpButton.classList.remove("content-btn-loading");
                formLoading.classList.remove("form-loading-show");
            },
            function (textResult, jsonResult) {
                //If error
                console.log(textResult);
                if (jsonResult.signupStatus != 0) {

                    //Show custom error message
                    switch (jsonResult.signupStatus) {
                        case 1:
                            ShowPopUpDialog("popup", "Error!", "The formulary have empty fields. Please, fill all fields of formulary!");
                            break;
                        case 2:
                            ShowPopUpDialog("popup", "Error!", "The Email Format Is Wrong!");
                            break;
                        case 3:
                            ShowPopUpDialog("popup", "Error!", "The Phone Number Format Is Wrong!");
                            break;
                        case 4:
                            ShowPopUpDialog("popup", "Error!", "Your Birth Date Format is Wrong!");
                            break;
                        case 5:
                            ShowPopUpDialog("popup", "Error!", "Your Password is Too Short!");
                            break;
                        case 6:
                            ShowPopUpDialog("popup", "Error!", "The Passwords don't match!");
                            break;
                        case 7:
                            ShowPopUpDialog("popup", "Error!", "Your password does not meet our complexity requirements. The password must have at least 8 characters, and at least one lowercase letter, one uppercase letter, one number and one special character");
                        case 8:
                            ShowPopUpDialog("popup", "Error!", "This Email Already Exists!");
                            break;
                    }
                }
                //If success
                else {
                    //Redirect to chat
                    window.location.href = rootUrl + "pages/chat.php";
                }
            },
            function () {
                ShowPopUpDialog("popup", "Error!", "There was an error, please try again later.");
            });
    }
}