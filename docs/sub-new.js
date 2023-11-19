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

document.getElementById("toggle_mode").onchange = function (evt) {
    switch (evt.target.checked) {
        case true:
            showAdvanced();
            break;
        default:
            showWizard();
            break;
    }
}

function showAdvanced() {
    document.getElementById("advanced").style.display = "block";
    document.getElementById("wizard").style.display = "none";
}

function showWizard() {
    document.getElementById("advanced").style.display = "none";
    document.getElementById("wizard").style.display = "block";
}

function showWizardCategory(category, label) {
    for(const c of document.getElementById("wizard_categories").children) {
        c.style.display = "none";
    }
    document.getElementById(category).style.display = "block";
    document.getElementById("sub_menu").innerText = `${label} ⌄`;
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropdown() {
    document.getElementById("awksubtype").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
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
