const pricePerSub = 0.15;
const usageSubjSub = 1;

window.Telegram.WebApp.expand();

function loadForm() {
    let until = new Date();
    until.setHours(until.getHours() + 168); // min is 7 days
    document.getElementById("date_until").min = until.toISOString().split("T")[0];
    until.setHours(until.getHours() + 24 * 23); // default is 30 days
    document.getElementById("date_until").valueAsDate = until;
    refreshPrice();
}

function refreshPrice(evtSrcId) {

    let now = new Date();
    let until = document.getElementById("date_until").valueAsDate;
    let daysTotal = Math.ceil((until - now) / (1000*60*60*24));
    document.getElementById("days_total").valueAsNumber = daysTotal;

    let evtSrc = document.getElementById(evtSrcId)
    switch (evtSrcId) {
        case "count_limit_subs":
            document.getElementById("count_limit_subs_range").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "count_limit_subs_range":
            document.getElementById("count_limit_subs").valueAsNumber = evtSrc.valueAsNumber;
            break
    }

    let countLimitSubs = document.getElementById("count_limit_subs").valueAsNumber;
    document.getElementById("price_daily").innerText = `${(pricePerSub*(countLimitSubs - 1)).toFixed(2)}`;
    document.getElementById("price_total").innerText = `${(daysTotal * pricePerSub*(countLimitSubs - 1)).toFixed(2)}`;
}

function submitMsg() {
    const timeDays = document.getElementById("days_total").valueAsNumber;
    const limitSubCount = document.getElementById("count_limit_subs").valueAsNumber;
    const payload = {
        "limit": {
            "timeDays": timeDays,
            "count": limitSubCount,
            "subject": usageSubjSub,
        },
        "price": {
            "total": parseFloat(document.getElementById("price_total").innerText),
            "unit": "EUR",
        }
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
