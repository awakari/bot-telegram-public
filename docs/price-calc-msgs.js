const pricePerMsg = 0.1;
const usageSubjMsg = 2;
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
        case "count_limit_msgs":
            document.getElementById("count_limit_msgs_range").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "count_limit_msgs_range":
            document.getElementById("count_limit_msgs").valueAsNumber = evtSrc.valueAsNumber;
            break
    }

    let countLimitMsgs = document.getElementById("count_limit_msgs").valueAsNumber;
    document.getElementById("price_daily").innerText = `${(pricePerMsg*(countLimitMsgs - 1)).toFixed(2)}`;
    document.getElementById("price_total").innerText = `${(periodDays * pricePerMsg*(countLimitMsgs - 1)).toFixed(2)}`;
}

function submitMsg() {
    const timeDays = document.getElementById("days_total").valueAsNumber;
    const limitMsgRate = document.getElementById("count_limit_msgs").valueAsNumber;
    const payload = {
        "limit": {
            "timeDays": timeDays,
            "count": limitMsgRate,
            "subject": usageSubjMsg,
        },
        "price": {
            "total": parseFloat(document.getElementById("price_total").innerText),
            "unit": "EUR",
        }
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
