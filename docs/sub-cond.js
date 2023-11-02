// Initialize the editor
var editor = new JSONEditor(document.getElementById("sub_cond_editor"), subCondSchema);

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change', function () {
    // Get an array of errors from the validator
    var errors = editor.validate();

    var indicator = document.getElementById('valid_indicator');

    // Not valid
    if (errors.length) {
        indicator.className = 'label label-danger'
        indicator.textContent = "not valid";
    }
    // Valid
    else {
        indicator.className = 'label label-success'
        indicator.textContent = "valid";
    }
});

window.Telegram.WebApp.expand();

function generateCond() {
    let payload = editor.getValue(0);
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}

function loadCond() {
    const urlParams = new URLSearchParams(window.location.search);
    const condEncB64Url = urlParams.get("cond");
    const condMap = JSON.parse(base64UrlDecode(condEncB64Url));
    editor.setValue(condMap);
    console.log(editor.getValue(0));
}

function base64UrlDecode(base64Url) {
    // Replace URL-safe characters with Base64 standard characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad the string with '=' to make its length a multiple of 4
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    // Decode the Base64 string
    return decodeURIComponent(escape(atob(paddedBase64)));
}
