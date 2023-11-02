// Initialize the editor
var editor = new JSONEditor(document.getElementById("sub_cond_editor"), subCondSchema);

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change', function () {
    // Get an array of errors from the validator
    var errors = editor.validate();

    // Not valid
    if (errors.length) {
        document.getElementById("btn_submit").style.display = "none";
        document.getElementById("invalid_indicator").style.display = "block";
    }
    // Valid
    else {
        document.getElementById("btn_submit").style.display = "block";
        document.getElementById("invalid_indicator").style.display = "none";
    }
});

window.Telegram.WebApp.expand();

function generateSub() {
    let payload = {
        description: document.getElementById("sub_descr").value,
        enabled: true,
        cond: editor.getValue(0),
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
