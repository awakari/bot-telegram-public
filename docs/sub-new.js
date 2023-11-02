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

function generateSub() {
    let payload = {
        description: document.getElementById("sub_descr").value,
        enabled: true,
        cond: editor.getValue(0),
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
