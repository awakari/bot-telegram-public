const pricePerMsgDaily = 0.04;
const pricePerUpdDaily = 0.01;
const periodDays = 30;

window.Telegram.WebApp.expand();

function loadForm() {
    document.getElementById("period_days").innerText = `${periodDays}`;
    let until = new Date();
    until.setHours(until.getHours() + 24 * periodDays); // default is 30 days
    document.getElementById("date_until").innerText = until.toDateString();
    refreshPrice();
    document.getElementById("src_type").onchange = showSrcDetails;
    showSrcDetails();
    document.getElementById("feed_upd_freq").onchange = refreshPrice;
}

function showSrcDetails() {
    let opt = document.getElementById("src_type").value
    switch (opt) {
        case "tgch":
            document.getElementById("tgch").style.display = "grid";
            document.getElementById("feed").style.display = "none";
            break
        case "feed":
            document.getElementById("tgch").style.display = "none";
            document.getElementById("feed").style.display = "grid";
            break
    }
    refreshPrice("");
}

function refreshPrice(evtSrcId) {

    let evtSrc = document.getElementById(evtSrcId)
    switch (evtSrcId) {
        case "count_limit_msgs_daily":
            document.getElementById("count_limit_msgs_daily_range").valueAsNumber = evtSrc.valueAsNumber;
            break
        case "count_limit_msgs_daily_range":
            document.getElementById("count_limit_msgs_daily").valueAsNumber = evtSrc.valueAsNumber;
            break
    }

    let countLimitMsgsDaily = document.getElementById("count_limit_msgs_daily").valueAsNumber;
    let srcType = document.getElementById("src_type").value;
    let updatesDaily = 0;
    if (srcType === "feed") {
        updatesDaily = parseInt(document.getElementById("feed_upd_freq").value);
    }
    const pricePerDay = pricePerMsgDaily*countLimitMsgsDaily + pricePerUpdDaily*updatesDaily;
    document.getElementById("price_daily").innerText = `${pricePerDay.toFixed(2)}`;
    document.getElementById("price_total").innerText = `${(periodDays*pricePerDay).toFixed(2)}`;
}

function submitMsg() {
    const limitMsgsDailyCount = document.getElementById("count_limit_msgs_daily").valueAsNumber;
    const srcType = document.getElementById("src_type").value;
    let srcAddr;
    switch (srcType) {
        case "tgch":
            srcAddr = document.getElementById("chan_name").value;
            break
        case "feed":
            srcAddr = document.getElementById("feed_url").value;
            break
    }
    const payload = {
        "limit": {
            "time": periodDays,
            "count": limitMsgsDailyCount,
            "freq": parseInt(document.getElementById("feed_upd_freq").value),
        },
        "price": {
            "total": parseFloat(document.getElementById("price_total").innerText),
            "unit": "EUR",
        },
        "src": {
            "addr": srcAddr,
            "type": srcType,
        }
    }
    window.Telegram.WebApp.sendData(JSON.stringify(payload));
}
