/* ============================ MAKE SIGNIN WITH AJAX AND THE BACKEND API =========================== */

//On click on sign up button
function OnClickSignIn(rootUrl) {
    //Get value for all fields
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;


    /*  */
    //If some is empty, cancel
    if (email == "" || password == "") {
        ShowPopUpDialog("popup", "Error!", "The formulary have empty fields. Please, fill all fields of formulary!");
        return;
    }
    //If password is too short, cancel
    else if (password.length < 8) {
        ShowPopUpDialog("popup", "Error!", "Your Password is Too Short!");
        return;
    }

    // Use AJAX to comunicate to backend and made the sign in check
    else {
        //Create the FormData
        var formData = EasyHttpRequest.InstantiateFormData();
        EasyHttpRequest.AddField(formData, "email", email);
        EasyHttpRequest.AddField(formData, "password", password);
        var formDataCompiled = EasyHttpRequest.BuildFormData(formData);

        //Change the UI

        var signInButton = document.getElementById("sign-in-button");
        const formLoading = document.getElementById("form-loading");

        signInButton.disabled = true;
        signInButton.classList.add("content-btn-loading");
        formLoading.classList.add("form-loading-show");

        //Do the API request
        EasyHttpRequest.StartAsyncPostRequest(rootUrl + "apis/signin-api.php", formDataCompiled,
            function () {
                //Reset the UI
                var signInButton = document.getElementById("sign-in-button");
                signInButton.disabled = false;
                signInButton.classList.remove("content-btn-loading");
                formLoading.classList.remove("form-loading-show");
            },
            function (textResult, jsonResult) {
                //If error
                console.log(textResult);
                if (jsonResult.signinStatus != 0) {

                    //Show custom error message
                    switch (jsonResult.signinStatus) {
                        case 1:
                            ShowPopUpDialog("popup", "Error!", "The formulary have empty fields. Please, fill all fields of formulary!");
                            break;
                        case 2:
                            ShowPopUpDialog("popup", "Error!", "Your Password is Too Short!");
                            break;
                        case 3:
                            ShowPopUpDialog("popup", "Error!", "Please Check The Input");
                            break;
                        case 4:
                            ShowPopUpDialog("popup", "Error!", "User Not Found");
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