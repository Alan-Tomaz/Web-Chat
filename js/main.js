/* ==================== GET THE AVATAR NAME FILE AND PUT ON THE INPUT =================== */

let avatarInput = document.getElementById('avatar'),
    fileName = document.getElementById('file-name');

if (avatarInput) {
    avatarInput.addEventListener('change', function () {
        fileName.value = this.files[0].name;
    });
}