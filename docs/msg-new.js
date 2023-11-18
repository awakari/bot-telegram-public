templateMsgAttr = (name, type, value) => `<span id="msg_attr_${name}" class="grid grid-cols-6 w-full text-sm font-mono h-[24x] min-h-[24px] items-center">
                        <input type="text" id="msg_attr_${name}_" value="${name}" disabled="disabled" class="col-span-3 msg-attr-name truncate border focus:shadow-md outline-none"/>
                        <p id="msg_attr_${type}" class="col-span-2 ml-1 truncate">${type}</p>
                        <button type=\"button\" title=\"Add Attribute\" onclick=\"deleteMessageAttribute('${name}');\" class=\"attr row-span-2 m-2 text-3xl font-mono focus:outline-none flex items-center justify-center\">⨯</button>
                        <input type="text" id="msg_attr_${value}" value="${value}" disabled="disabled" class="col-span-5 w-full font-mono truncate border focus:shadow-md outline-none"/>
                    </span>`

templateMsgAttrRequired = (name, type, value) => ` <span id="msg_attr_${name}" class="grid grid-cols-6 w-full text-sm font-mono items-center space-y-1">
                        <input type="text" id="msg_attr_${name}_" value="${name}" disabled="disabled" class="col-span-3 msg-attr-name truncate border focus:shadow-md outline-none"/>
                        <p id="msg_attr_${type}" class="col-span-2 ml-1 truncate">${type}</p>
                        <input type="text" id="msg_attr_${value}" value="${value}" disabled="disabled" class="col-span-5 font-mono truncate border focus:shadow-md outline-none"/>
                    </span>`

function loadForm() {
    document.getElementById("msg_attrs").value = "{}";
    document.getElementById("msg_attrs_form").innerHTML = "";
    document.getElementById("msg_id").value = uuidv4();
    putMessageAttribute("time", "timestamp", new Date().toISOString(), true);
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
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function isBase64Encoded(str) {
    const base64Regex = /^[A-Za-z0-9+/=]*$/;
    return base64Regex.test(str) && str.length % 4 === 0;
}

function isValidTsRfc3339(timestamp) {
    const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
    return regex.test(timestamp);
}

function isValidUri(uri) {
    try {
        new URL(uri);
        return true;
    } catch (error) {
        return false;
    }
}

function isValidUriReference(uri) {
    const regex = /^(?:(?:https?|ftp):\/\/|mailto:|\/|\.|..\/|\/(?:[^\/]+\/)*)(?:[^\s:\/?#]+:)?(?:[^\s\/?#]*\/)?(?:[^\s?#]*\?[^#]*|)/i;
    return regex.test(uri);
}

function addMessageAttribute() {
    let validationPassed = true;
    const name = document.getElementById("msg_attr_name").value.toLowerCase();
    if (name === "") {
        alert("empty attribute name")
        validationPassed = false;
    }
    let type = document.getElementById("msg_attr_type").value;
    const valStr = document.getElementById("msg_attr_value").value;
    let value;
    if (validationPassed) {
        switch (type) {
            case "boolean":
                switch (valStr) {
                    case "true":
                        value = true;
                        break;
                    case "false":
                        value = false;
                        break;
                    default:
                        validationPassed = false;
                        alert(`invalid boolean value: "${valStr}"`);
                }
                break
            case "bytes":
                if (isBase64Encoded(valStr)) {
                    value = valStr;
                } else {
                    validationPassed = false;
                    alert(`invalid bytes (base-64 encoded) value: "${valStr}"`);
                }
                break
            case "integer":
                value = parseInt(valStr, 10);
                if (isNaN(value) || value < -2147483648 || value > 2147483647) {
                    validationPassed = false;
                    alert(`invalid integer (32-bit, signed) value: "${valStr}"`);
                }
                break
            case "timestamp":
                if (isValidTsRfc3339(valStr)) {
                    value = valStr;
                } else {
                    validationPassed = false;
                    alert(`invalid timestamp (RFC3339) value: "${valStr}"`);
                }
                break
            case "uri":
                if (isValidUri(valStr)) {
                    value = valStr;
                } else {
                    validationPassed = false;
                    alert(`invalid uri (absolute) value: "${valStr}"`);
                }
                break
            case "uri_ref":
                if (isValidUriReference(valStr)) {
                    value = valStr;
                } else {
                    validationPassed = false;
                    alert(`invalid uri-ref value: "${valStr}"`);
                }
                break
            default: // string
                type = "string";
                value = valStr;
        }
    }
    if (validationPassed) {
        putMessageAttribute(name, type, value, false);
        // reset
        document.getElementById("msg_attr_name").value = "";
        document.getElementById("msg_attr_type").value = "";
        document.getElementById("msg_attr_value").value = "";
    }
}

function putMessageAttribute(name, type, value, required) {
    let msgAttrs = JSON.parse(document.getElementById("msg_attrs").value);
    const replace = msgAttrs.hasOwnProperty(name);
    msgAttrs[name] = {};
    msgAttrs[name][`ce_${type}`] = value;
    document.getElementById("msg_attrs").value = JSON.stringify(msgAttrs, null, 2);
    if (replace) {
        document.getElementById(`msg_attr_${name}`).remove();
    }
    if (required) {
        document.getElementById("msg_attrs_form").innerHTML += templateMsgAttrRequired(name, type, value);
    } else {
        document.getElementById("msg_attrs_form").innerHTML += templateMsgAttr(name, type, value);
    }
}

function deleteMessageAttribute(name) {
    let msgAttrs = JSON.parse(document.getElementById("msg_attrs").value);
    delete msgAttrs[name];
    document.getElementById("msg_attrs").value = JSON.stringify(msgAttrs, null, 2);
    document.getElementById(`msg_attr_${name}`).remove();
}

function showAdvanced() {
    document.getElementById("advanced").style.display = "block";
    document.getElementById("header_advanced").style.display = "inline";
    document.getElementById("wizard").style.display = "none";
    document.getElementById("header_wizard").style.display = "none";
}

function showWizard() {
    document.getElementById("advanced").style.display = "none";
    document.getElementById("header_advanced").style.display = "none";
    document.getElementById("wizard").style.display = "block";
    document.getElementById("header_wizard").style.display = "inline";
}

function showWizardCategory(category, label) {
    for(const c of document.getElementById("wizard").children) {
        c.style.display = "none";
    }
    document.getElementById(category).style.display = "block";
    document.getElementById("pub_menu").innerText = `${label} ⌄`;
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropdown() {
    document.getElementById("awkpubtype").classList.toggle("show");
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
window.Telegram.WebApp.MainButton.setText("▷ PUBLISH")
window.Telegram.WebApp.MainButton.show();
window.Telegram.WebApp.MainButton.onClick(() => {
    let validationOk = true;
    const payload = {
        id: document.getElementById("msg_id").value,
        specVersion: "1.0",
    }
    switch (document.getElementById("advanced").style.display) {
    case "none": // wizard mode
        const mode = document.getElementById("pub_menu").innerText;
        switch (mode) {
            case "Advertise ⌄":
                validationOk = advertisePayload(payload);
                break;
            case "Buy ⌄":
                validationOk = buyPayload(payload);
                break;
            case "Sell ⌄":
                validationOk = sellPayload(payload);
                break;
            case "CV ⌄":
                validationOk = cvPayload(payload);
                break;
            case "Job ⌄":
                validationOk = jobPayload(payload);
                break;
            case "Post ⌄":
                validationOk = postPayload(payload);
                break;
            case "Dating ⌄":
                validationOk = datingPayload(payload);
                break;
            default:
                console.log(`unrecognized wizard mode: ${mode}`);
                break;
        }
        break
    default: // advanced mode
        payload.attributes = JSON.parse(document.getElementById("msg_attrs").value);
        payload.text_data = document.getElementById("msg_txt_data").value;
        break;
    }
    if (validationOk) {
        window.Telegram.WebApp.sendData(JSON.stringify(payload));
        window.Telegram.WebApp.close();
    } else {
        window.alert("Some mandatory attributes are not set. Please check and retry.");
    }
});

function advertisePayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.ad";
    // mandatory
    const category = document.getElementById("com_ad_category").value;
    const title = document.getElementById("com_ad_title").value;
    const data = document.getElementById("com_ad_data").value;
    const link = document.getElementById("com_ad_source").value;
    const validationOk = category !== "" && title !== "" && data !== "" && link !== "";
    payload.attributes = {
        "categories": {
            "ce_string": category,
        },
        "title": {
            "ce_string": title,
        },
        "link": {
            "ce_uri": link,
        }
    };
    payload.text_data = data;
    // optional
    const linkImg = document.getElementById("com_ad_imageurl").value;
    if (linkImg !== "") {
        payload.attributes["imageurl"] = {
            "ce_uri": linkImg,
        }
    }
    const contact = document.getElementById("com_ad_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    const tags = document.getElementById("com_ad_categories").value;
    if (tags !== "") {
        payload.attributes["tags"] = {
            "ce_string": tags,
        }
    }
    return validationOk;
}

function buyPayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.buy";
    // mandatory
    const category = document.getElementById("com_buy_category").value;
    const data = document.getElementById("com_buy_data").value;
    const validationOk = category !== "" && data !== "";
    payload.text_data = data;
    // optional
    payload.attributes["currency"] = document.getElementById("com_buy_pricecurrency").value;
    const priceMin = document.getElementById("com_buy_pricemin");
    if (priceMin.value !== "") {
        payload.attributes["pricemin"] = {
            "ce_integer": Math.floor(100 * priceMin.valueAsNumber),
        }
    }
    const priceMax = document.getElementById("com_buy_pricemax");
    if (priceMax.value !== "") {
        payload.attributes["pricemax"] = {
            "ce_integer": Math.floor(100 * priceMin.valueAsNumber),
        }
    }
    payload.attributes["quantityunit"] = document.getElementById("com_buy_quantityunit").value;
    const quantityMin = document.getElementById("com_buy_quantitymin");
    if (quantityMin.value !== "") {
        payload.attributes["quantitymin"] = {
            "ce_integer": Math.floor(quantityMin.valueAsNumber),
        }
    }
    const quantityMax = document.getElementById("com_buy_quantitymax");
    if (quantityMax.value !== "") {
        payload.attributes["quantitymax"] = {
            "ce_integer": Math.floor(quantityMax.valueAsNumber),
        }
    }
    const contact = document.getElementById("com_ad_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    const tags = document.getElementById("com_ad_categories").value;
    if (tags !== "") {
        payload.attributes["tags"] = {
            "ce_string": tags,
        }
    }
    return validationOk;
}

function sellPayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.sell";
    // mandatory
    const category = document.getElementById("com_sell_category").value;
    const data = document.getElementById("com_sell_data").value;
    const validationOk = category !== "" && data !== "";
    payload.text_data = data;
    // optional
    payload.attributes["currency"] = document.getElementById("com_sell_pricecurrency").value;
    const priceMin = document.getElementById("com_sell_pricemin");
    if (priceMin.value !== "") {
        payload.attributes["pricemin"] = {
            "ce_integer": Math.floor(100 * priceMin.valueAsNumber),
        }
    }
    const priceMax = document.getElementById("com_sell_pricemax");
    if (priceMax.value !== "") {
        payload.attributes["pricemax"] = {
            "ce_integer": Math.floor(100 * priceMin.valueAsNumber),
        }
    }
    payload.attributes["quantityunit"] = document.getElementById("com_sell_quantityunit").value;
    const quantityMin = document.getElementById("com_sell_quantitymin");
    if (quantityMin.value !== "") {
        payload.attributes["quantitymin"] = {
            "ce_integer": Math.floor(quantityMin.valueAsNumber),
        }
    }
    const quantityMax = document.getElementById("com_sell_quantitymax");
    if (quantityMax.value !== "") {
        payload.attributes["quantitymax"] = {
            "ce_integer": Math.floor(quantityMax.valueAsNumber),
        }
    }
    const contact = document.getElementById("com_ad_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    const tags = document.getElementById("com_ad_categories").value;
    if (tags !== "") {
        payload.attributes["tags"] = {
            "ce_string": tags,
        }
    }
    return validationOk;
}

function cvPayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.cv";
    // mandatory
    const author = document.getElementById("emp_cv_author").value;
    const title = document.getElementById("emp_cv_title").value;
    const summary = document.getElementById("emp_cv_summary").value;
    const skills = document.getElementById("emp_cv_skills").value;
    const validationOk = author !== "" && title !== "" && summary !== "" && skills !== "";
    payload.attributes = {
        "author": {
            "ce_string": author,
        },
        "title": {
            "ce_string": title,
        },
        "summary": {
            "ce_string": summary,
        },
        "skills": {
            "ce_string": skills,
        }
    };
    // optional
    payload.attributes["currency"] = document.getElementById("emp_cv_salarycurrency").value;
    const priceMin = document.getElementById("emp_cv_salarymin");
    if (priceMin.value !== "") {
        payload.attributes["pricemin"] = {
            "ce_integer": Math.floor(priceMin.valueAsNumber),
        }
    }
    payload.attributes["salaryperiod"] = document.getElementById("emp_cv_salaryperiod");
    const additional = document.getElementById("emp_cv_additional").value;
    if (additional !== "") {
        payload.attributes["additional"] = {
            "ce_string": additional,
        }
    }
    const contact = document.getElementById("emp_cv_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    const education = document.getElementById("emp_cv_education").value;
    if (education !== "") {
        payload.attributes["education"] = {
            "ce_string": education,
        }
    }
    const experience = document.getElementById("emp_cv_experience").value;
    if (experience !== "") {
        payload.attributes["experience"] = {
            "ce_string": experience,
        }
    }
    return validationOk;
}

function jobPayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.job";
    // mandatory
    const company = document.getElementById("emp_job_company").value;
    const title = document.getElementById("emp_job_title").value;
    const summary = document.getElementById("emp_job_summary").value;
    const skills = document.getElementById("emp_job_skills").value;
    const validationOk = company !== "" && title !== "" && summary !== "" && skills !== "";
    payload.attributes = {
        "company": {
            "ce_string": company,
        },
        "title": {
            "ce_string": title,
        },
        "summary": {
            "ce_string": summary,
        },
        "skills": {
            "ce_string": skills,
        }
    };
    // optional
    payload.attributes["currency"] = document.getElementById("emp_job_salarycurrency").value;
    const priceMin = document.getElementById("emp_job_salarymin");
    if (priceMin.value !== "") {
        payload.attributes["pricemin"] = {
            "ce_integer": Math.floor(priceMin.valueAsNumber),
        }
    }
    const priceMax = document.getElementById("emp_job_salarymax");
    if (priceMax.value !== "") {
        payload.attributes["pricemax"] = {
            "ce_integer": Math.floor(priceMax.valueAsNumber),
        }
    }
    payload.attributes["salaryperiod"] = document.getElementById("emp_job_salaryperiod");
    const additional = document.getElementById("emp_job_additional").value;
    if (additional !== "") {
        payload.attributes["additional"] = {
            "ce_string": additional,
        }
    }
    const contact = document.getElementById("emp_job_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    const link = document.getElementById("emp_job_source").value;
    if (link !== "") {
        payload.attributes["link"] = {
            "ce_uri": link,
        }
    }
    return validationOk;
}

function postPayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.post";
    // mandatory
    const title = document.getElementById("media_post_title").value;
    const body = document.getElementById("media_post_data").value;
    const validationOk = title !== "" && body !== "";
    payload.attributes = {
        "title": {
            "ce_string": title,
        },
    };
    payload.text_data = body;
    // optional
    const author = document.getElementById("media_post_author").value;
    if (author !== "") {
        payload.attributes["author"] = {
            "ce_string": author,
        }
    }
    const contact = document.getElementById("media_post_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    const link = document.getElementById("media_post_source").value;
    if (link !== "") {
        payload.attributes["link"] = {
            "ce_uri": link,
        }
    }
    const linkImg = document.getElementById("media_post_imageurl").value;
    if (linkImg !== "") {
        payload.attributes["imageurl"] = {
            "ce_uri": linkImg,
        }
    }
    const tags = document.getElementById("media_post_categories").value;
    if (tags !== "") {
        payload.attributes["tags"] = {
            "ce_string": tags,
        }
    }
    return validationOk;
}

function datingPayload(payload) {
    payload.type = "com.github.awakari.bot-telegram.dating";
    // mandatory
    const summary = document.getElementById("people_date_summary").value;
    const interests = document.getElementById("people_date_interests").value;
    const pref = document.getElementById("people_date_summary").valueOf();
    const validationOk = summary !== "" && interests !== "" && pref !== "";
    payload.attributes = {
        "summary": {
            "ce_string": summary,
        },
        "interests": {
            "ce_string": interests,
        },
        "pref": {
            "ce_string": pref,
        }
    }
    // optional
    const gender = document.getElementById("people_date_gender").value;
    if (gender !== "") {
        payload.attributes["gender"] = {
            "ce_string": gender,
        }
    }
    const genderPref = document.getElementById("people_date_prefgender").value;
    if (genderPref !== "") {
        payload.attributes["prefgender"] = {
            "ce_string": genderPref,
        }
    }
    const linkImg = document.getElementById("people_date_imageurl").value;
    if (linkImg !== "") {
        payload.attributes["imageurl"] = {
            "ce_uri": linkImg,
        }
    }
    const additional = document.getElementById("people_date_additional").value;
    if (additional !== "") {
        payload.attributes["additional"] = {
            "ce_string": additional,
        }
    }
    const contact = document.getElementById("people_date_contact").value;
    if (contact !== "") {
        payload.attributes["contact"] = {
            "ce_string": contact,
        }
    }
    return validationOk;
}
