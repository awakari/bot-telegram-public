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
    enableMainButton();
}

window.Telegram.WebApp.expand();
window.Telegram.WebApp.MainButton.show();
window.Telegram.WebApp.MainButton.onClick(() => {
    let validationErr = "";
    let payload = {
        description: document.getElementById("sub_descr").value,
        enabled: true,
        cond: {
            not: false,
            gc: {
                logic: 0,
                group: []
            }
        }
    }
    if (payload.description === "") {
        validationErr = "empty description";
    } else {
        switch (document.getElementById("advanced").style.display) {
            case "none": // wizard mode
                validationErr = getFormConditions(payload.cond.gc.group);
                if (validationErr === "") {
                    switch (payload.cond.gc.group.length) {
                        case 0:
                            validationErr = "no conditions defined"
                            break
                        case 1:
                            payload.cond = payload.cond.gc.group[0]
                            break
                    }
                }
                break
            default: // advanced mode
                payload.cond = editor.getValue(0);
        }
    }
    if (validationErr === "") {
        window.Telegram.WebApp.sendData(JSON.stringify(payload));
        window.Telegram.WebApp.close();
    } else {
        window.alert(`Validation error: ${validationErr}`);
    }
});

function getFormConditions(rootGroupConds) {

    let validationErr = "";

    for (let i = 1; i <= 4; i ++) {
        let not = false;
        const extraTerms = document.getElementById(`cond_extra${i}`).value;
        if (extraTerms.length > 2) {
            if (i > 1) {
                not = document.getElementById(`cond_extra${i}_not`).checked;
            }
            rootGroupConds.push({
                not: not,
                tc: {
                    exact: false,
                    key: "",
                    term: extraTerms,
                }
            })
        }
    }

    return validationErr;
}
