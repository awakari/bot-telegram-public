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
    mainButton.setText("⊘ CREATE");
    mainButton.disable();
}

function enableMainButton() {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.setText("✓ CREATE");
    mainButton.enable();
}

window.Telegram.WebApp.expand();
window.Telegram.WebApp.MainButton.show();
window.Telegram.WebApp.MainButton.onClick(() => {
    let payload = {
        description: document.getElementById("sub_descr").value,
        enabled: true,
        cond: editor.getValue(0),
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
    window.Telegram.WebApp.close();
});
