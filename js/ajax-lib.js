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

    /*
     * StartAsyncFileUpload();        Do a Async HTTP file upload.
     * 
     * phpApiPath (string):           The path to PHP API file.
     * fileInputId (string):          The ID of "input type="file"" element present on your page.
     * fileIndex (int):               The index of the file to upload, inside the "input type="file"".
     * filePostName (string):         The "name" that representes this file upload in the PHP API.
     * rawFormData (FormData):        The FormData builded with the methods"InstantiateFormData()" and
     *                                "AddField();" only. Without build with "BuildFormData();".
     * doneCallback (function):       The callback that will run if the request is finished.
     * progressCallback (function):   The callback that will run when the progress is updated. 
     *                                    - The function passed to this parameter must have the
     *                                      parameters "currentProgress", "totalProgress".
     * successCallback (function):    The callback that will run if the request is successfully.
     *                                    - The function passed to this parameter must have the
     *                                      parameters "textResult", "jsonResult".
     * errorCallback (function):      The callback that will run if the request is failed.
     */
    static StartAsyncFileUpload(phpApiPath, fileInputId, fileIndex, filePostName, rawFormData, doneCallback, progressCallback, successCallback, errorCallback) {
        //Get the file reference
        var fileInput = document.getElementById(fileInputId);
        var fileToUpload = fileInput.files[fileIndex];

        //Do a initial report to progress callback
        progressCallback(0.0, 100.0);

        //If raw form data is empty or null, set a empty array to variable
        if (!rawFormData)
            rawFormData = [];

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
                    console.log("Error on Do File Upload: " + httpRequest.status);
                    errorCallback();
                }
                //If success
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    //Do a final report to progress callback
                    progressCallback(100.0, 100.0);
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

            //Create the progress event
            httpRequest.upload.addEventListener("progress", function (evnt) {
                //Get the upload info
                var totalSize = evnt.total;
                var uploadedSize = evnt.loaded;
                //Report the progress in percentage
                progressCallback(Math.round(((uploadedSize / totalSize) * 100.0)), 100.0);
            }, false);

            //Prepare the JavaScript FormData to pack the file reference, and possible RawFormData of this library together
            var formData = new FormData();
            //Add all possible fields of Raw FormData to the JavaScript FormData
            for (var i = 0; i < rawFormData.length; i++) {
                var thisField = JSON.parse(rawFormData[i]);
                formData.append(thisField.name, thisField.value);
            }
            //Add the file reference to the JavaScript FormData to send on the request
            formData.append(filePostName, fileToUpload, fileToUpload.name);

            //Open the request
            httpRequest.open("POST", phpApiPath, true);
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