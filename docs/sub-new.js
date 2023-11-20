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

function showWizardCategory(category, label) {
    for(const c of document.getElementById("wizard_categories").children) {
        c.style.display = "none";
    }
    document.getElementById(category).style.display = "grid";
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
    let validationErr = "";
    const descr = document.getElementById("sub_descr").value;
    let payload = {
        description: descr,
        enabled: true,
        cond: {
            not: false,
            gc: {
                logic: 0,
                group: []
            }
        }
    }
    if (descr === "") {
        validationErr = "empty description";
    } else {
        switch (document.getElementById("advanced").style.display) {
            case "none": // wizard mode
                const mode = document.getElementById("sub_menu").innerText;
                switch (mode) {
                    case "Buyers ⌄":
                        validationErr = buyersConds(payload.cond.gc.group);
                        break;
                    case "Sales ⌄":
                        validationErr = salesConds(payload.cond.gc.group);
                        break;
                    case "Candidates ⌄":
                        validationErr = candidatesConds(payload.cond.gc.group);
                        break;
                    case "Jobs ⌄":
                        validationErr = jobsConds(payload.cond.gc.group);
                        break;
                    case "Posts ⌄":
                        validationErr = postsConds(payload.cond.gc.group);
                        break;
                    case "Dating ⌄":
                        validationErr = datingConds(payload.cond.gc.group);
                        break;
                    case "None ⌄":
                        validationErr = extraConds(payload.cond.gc.group);
                        break;
                    default:
                        console.log(`unrecognized wizard mode: ${mode}`);
                        break;
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

function buyersConds(rootGroupConds) {

    let validationErr = "";

    const cat = document.getElementById("com_buy_category").value;
    if (cat !== "") {
        rootGroupConds.push({
            not: false,
            tc: {
                exact: false,
                key: "category",
                term: cat,
            }
        })
    }

    const priceOp = parseInt(document.getElementById("com_buy_price_operator").value);
    const price = document.getElementById("com_buy_price").valueAsNumber;
    if (priceOp > 0 && priceOp < 6 && price > 0) {
        rootGroupConds.push({
            not: false,
            nc: {
                key: "pricemax",
                val: Math.floor(price * 100),
                op: priceOp,
            }
        })
    }
    const priceCurrency = document.getElementById("com_buy_pricecurrency").value;
    if (priceCurrency !== "") {
        rootGroupConds.push({
            not: false,
            tc: {
                exact: true,
                key: "currency",
                term: priceCurrency,
            }
        })
    }

    const quantity = document.getElementById("com_buy_quantity").valueAsNumber;
    if (quantity > 0) {
        rootGroupConds.push({
            not: false,
            nc: {
                key: "quantitymin",
                op: 4,
                val: quantity,
            }
        })
        rootGroupConds.push({
            not: false,
            nc: {
                key: "quantitymax",
                op: 2,
                val: quantity,
            }
        })
        const quantityUnit = document.getElementById("com_buy_quantityunit").value;
        rootGroupConds.push({
            not: false,
            tc: {
                exact: true,
                key: "quantityunit",
                term: quantityUnit,
            }
        })
    }

    validationErr = extraConds(rootGroupConds);

    return validationErr;
}

function extraConds(rootGroupConds) {

    let validationErr = "";

    for (let i = 1; i <= 4; i ++) {
        let not = false;
        const extraTerms = document.getElementById(`cond_extra${i}`);
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
