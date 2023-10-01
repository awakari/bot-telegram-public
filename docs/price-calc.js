const pricePerMsg = 1.0;
const pricePerSub = 1.0;

window.Telegram.WebApp.expand();

function loadForm() {
    let until = new Date();
    until.setHours(until.getHours() + 24); // min is 1 day
    document.getElementById("date_until").min = until.toISOString().split("T")[0];
    until.setHours(until.getHours() + 24 * 29); // default is 30 days
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
        case "count_limit_msgs":
            document.getElementById("count_limit_msgs_range").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "count_limit_msgs_range":
            document.getElementById("count_limit_msgs").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "count_limit_subs":
            document.getElementById("count_limit_subs_range").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "count_limit_subs_range":
            document.getElementById("count_limit_subs").valueAsNumber = evtSrc.valueAsNumber;
            break
    }

    let countLimitMsgs = document.getElementById("count_limit_msgs").valueAsNumber;
    let countLimitSubs = document.getElementById("count_limit_subs").valueAsNumber;
    document.getElementById("price_total").innerText = `${daysTotal * (pricePerMsg*(countLimitMsgs - 1) + pricePerSub*(countLimitSubs - 1))}`;
}

function submitMsg() {
    const timeDays = document.getElementById("days_total").valueAsNumber;
    const limitMsgRate = document.getElementById("count_limit_msgs").valueAsNumber;
    const limitSubCount = document.getElementById("count_limit_subs").valueAsNumber;
    const payload = {
        "limit": {
            "timeDays": timeDays,
            "msgRate": limitMsgRate,
            "subCount": limitSubCount,
        },
        "price": {
            "msgRate": pricePerMsg * timeDays * (limitMsgRate - 1),
            "subCount": pricePerSub * timeDays * (limitSubCount - 1),
            "total": parseFloat(document.getElementById("price_total").innerText),
            "unit": "EUR",
        }
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
