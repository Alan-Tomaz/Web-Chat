/*
 * Easy HTTP Request Library
 */

//Library Preferences
var initialDelay = 1000;

class EasyHttpRequest {
    //========================================= MAIN =========================================//

    /*
     * StartAsyncGetRequest();        Do a Async HTTP Request that uses GET method.
     * 
     * phpApiPath (string):           The path to PHP API file.
     * formData (string):             The URI form data to send to API by GET method. You can use
     *                                the methods "InstantiateFormData()", "AddField()"
     *                                and "BuildFormData()" to build a URI of form fields easily to
     *                                this parameter.
     * doneCallback (function):       The callback that will run if the request is finished.
     * successCallback (function):    The callback that will run if the request is successfully.
     *                                    - The function passed to this parameter must have the
     *                                      parameters "textResult", "jsonResult".
     * errorCallback (function):      The callback that will run if the request is failed.
     */
    static StartAsyncGetRequest(phpApiPath, formData, doneCallback, successCallback, errorCallback) {
        //If form data is empty of null, set a empty string to variable
        if (!formData)
            formData = "";

        //Set up the initial delay
        window.setTimeout(function () {
            //...

            //Instantiate the xml http request
            var httpRequest = new XMLHttpRequest();

            //Create the event
            httpRequest.onreadystatechange = function () {
                //If error
                if (httpRequest.readyState == 4 && httpRequest.status != 200) {
                    //Show the status code of error and send callback
                    console.log("Error on Do HTTP Request: " + httpRequest.status);
                    errorCallback();
                }
                //If success
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    //Try to get a JSON, if fails, send a null string to callback
                    try {
                        successCallback(httpRequest.responseText, JSON.parse(httpRequest.responseText));
                    } catch (e) {
                        successCallback(httpRequest.responseText, null);
                    }
                }
                //If done
                if (httpRequest.readyState == 4)
                    doneCallback();
            };

            //Open the request
            httpRequest.open("GET", phpApiPath + "?" + formData, true);
            httpRequest.send();

            //...
        }, initialDelay);
    }

    /*
     * StartAsyncPostRequest();       Do a Async HTTP Request that uses POST method.
     * 
     * phpApiPath (string):           The path to PHP API file.
     * formData (string):             The URI form data to send to API by POST method. You can use
     *                                the methods "InstantiateFormData()", "AddField()"
     *                                and "BuildFormData()" to build a URI of form fields easily to
     *                                this parameter.
     * doneCallback (function):       The callback that will run if the request is finished.
     * successCallback (function):    The callback that will run if the request is successfully.
     *                                    - The function passed to this parameter must have the
     *                                      parameters "textResult", "jsonResult".
     * errorCallback (function):      The callback that will run if the request is failed.
     */
    static StartAsyncPostRequest(phpApiPath, formData, doneCallback, successCallback, errorCallback) {
        //If form data is empty of null, set a empty string to variable
        if (!formData)
            formData = "";

        //Set up the initial delay
        window.setTimeout(function () {
            //...

            //Instantiate the xml http request
            var httpRequest = new XMLHttpRequest();

            //Create the event
            httpRequest.onreadystatechange = function () {
                //If error
                if (httpRequest.readyState == 4 && httpRequest.status != 200) {
                    //Show the status code of error and send callback
                    console.log("Error on Do HTTP Request: " + httpRequest.status);
                    errorCallback();
                }
                //If success
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    //Try to get a JSON, if fails, send a null string to callback
                    try {
                        successCallback(httpRequest.responseText, JSON.parse(httpRequest.responseText));
                    } catch (e) {
                        successCallback(httpRequest.responseText, null);
                    }
                }
                //If done
                if (httpRequest.readyState == 4)
                    doneCallback();
            };

            //Open the request
            httpRequest.open("POST", phpApiPath, true);
            httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            httpRequest.send(formData);

            //...
        }, initialDelay);
    }

    //========================================= TOOLS =========================================//

    /*
     * These methods are from a object of this library, called "FormData". This object stores
     * a data of form, instead of use URI formatation to send POST/GET form data.
     */


    /*
     * InstantiateFormData();          Create a FormData object to store the data of form.
     *
     * return (array):                 Returns the FormData object.
     */
    static InstantiateFormData() {
        //Create a array to store form data
        return [];
    }

    /*
     * AddField();                     Add a POST/GET field to the FormData object.
     * 
     * formDataObject(FormData):       The object returned by the "InstantiateFormData();" method.
     * name (string):                  The name of the POST/GET field.
     * value (string):                 The value of the POST/GET field.
     */
    static AddField(formDataObject, name, value) {
        //Prepare the field object
        var field = "{\"name\":\"" + name + "\", \"value\":\"" + value + "\"}";
        //Add the field object to form data array
        formDataObject.push(field);
    }

    /*
     * BuildFormData();                 Get the compiled FormData to URI format.
     * 
     * formDataObject(FormData):        The object returned by the "InstantiateFormData();" method.
     * 
     * return (string):                 Returns the compiled to URI form data.
     */
    static BuildFormData(formDataObject) {
        //Prepare the string of URI formdata
        var uriFormData = "";

        //Build the URI formdata
        for (var i = 0; i < formDataObject.length; i++) {
            var fieldOfFormData = JSON.parse(formDataObject[i]);
            if (i >= 1)
                uriFormData += "&";
            uriFormData += fieldOfFormData.name + "=" + fieldOfFormData.value;
        }

        //Return the URI compiled formdata
        return uriFormData;
    }
}