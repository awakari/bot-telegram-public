// Initialize the editor
var editor = new JSONEditor(document.getElementById("sub_cond_editor"), subCondSchema);

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change', function () {
    // Get an array of errors from the validator
    var errors = editor.validate();
    // Not valid
    if (errors.length) {
        disableMainButton();
    }
    // Valid
    else {
        enableMainButton();
    }
});

function disableMainButton() {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.setText("⊘ Save Changes");
    mainButton.disable();
}

function enableMainButton() {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.setText("✓ Save Changes");
    mainButton.enable();
}

window.Telegram.WebApp.expand();
window.Telegram.WebApp.MainButton.show();
window.Telegram.WebApp.MainButton.onClick(() => {
    let payload = editor.getValue(0);
    console.log(JSON.stringify(payload));
    window.Telegram.WebApp.close();
});

function loadCond() {
    const urlParams = new URLSearchParams(window.location.search);
    const condEncB64Url = urlParams.get("cond");
    const condMap = JSON.parse(base64UrlDecode(condEncB64Url));
    editor.setValue(condMap);
    disableMainButton(); // no change yet
}

function base64UrlDecode(base64Url) {
    // Replace URL-safe characters with Base64 standard characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad the string with '=' to make its length a multiple of 4
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    // Decode the Base64 string
    return decodeURIComponent(escape(atob(paddedBase64)));
}
