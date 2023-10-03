const pricePerSub = 0.1;
const usageSubjSub = 1;
const periodDays = 30;

window.Telegram.WebApp.expand();

function loadForm() {
    document.getElementById("period_days").innerText = `${periodDays}`;
    let until = new Date();
    until.setHours(until.getHours() + 24 * periodDays); // default is 30 days
    document.getElementById("date_until").innerText = until.toDateString();
    refreshPrice();
}

function refreshPrice(evtSrcId) {

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
    document.getElementById("price_total").innerText = `${(periodDays * pricePerSub*(countLimitSubs - 1)).toFixed(2)}`;
}

function submitMsg() {
    const limitSubCount = document.getElementById("count_limit_subs").valueAsNumber;
    const payload = {
        "limit": {
            "timeDays": periodDays,
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
