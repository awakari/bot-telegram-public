const pricePerSub = 0.1;

window.Telegram.WebApp.expand();

function loadForm() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const paramSubId = params.get("subId");
    document.getElementById("sub_id").innerText = paramSubId;
    document.getElementById("price_daily").innerText = `${pricePerSub}`;
    refreshPrice();
}

function refreshPrice(evtSrcId) {

    let evtSrc = document.getElementById(evtSrcId)
    switch (evtSrcId) {
        case "add_days":
            document.getElementById("add_days_range").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "add_days_range":
            document.getElementById("add_days").valueAsNumber = evtSrc.valueAsNumber;
            break
    }
    let addDays = document.getElementById("add_days").valueAsNumber;
    document.getElementById("price_total").innerText = `${(addDays * pricePerSub).toFixed(2)}`;
}

function submitMsg() {
    let addDays = document.getElementById("add_days").valueAsNumber;
    const payload = {
        "subExtend": {
            "timeDays": addDays,
        },
        "price": {
            "total": parseFloat(document.getElementById("price_total").innerText),
            "unit": "EUR",
        }
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
