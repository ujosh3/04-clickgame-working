const widgetContainer = document.getElementById("widget-container");
function buy(store) {
    let bank = parseInt(score.innerHTML);
    let cost = parseInt(store.getAttribute("cost"));
    let canbuy = store.getAttribute('canbuy');
    console.log(`bank: [${bank}] cost: [${cost}]`);

    if (bank < cost) {
        alert("Insufficient funds");
        return;
    }

    changeScore(-1 * cost);

    // If Super-Gompei already exists
    var superGompei = document.getElementById("super-gompei");
    if (store.getAttribute("name") === "Super Mine" && superGompei !== null) {
        superGompei.setAttribute("reap", (parseInt(superGompei.getAttribute("reap")) + 100));
        return;
    }

    var widget = document.createElement("div");
    if (store.getAttribute("name") == "Super-Gompei")
        widget.id = "super-gompei";
    widget.classList.add("widget");
    fillWidget(store, widget);
    const audio3 = new Audio('build.mp3');
    audio3.play();
    widget.onclick = () => {
        harvest(widget);
    }
    widgetContainer.appendChild(widget);
    if (widget.getAttribute("auto") == 'true') harvest(widget);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    if (widget.getAttribute("name") == "Barbarian") {
        const audio2 = new Audio('battle.mp3');
        audio2.play();
    }
    if (widget.getAttribute("name") == "Archer") {
        const archer = new Audio('archer.mp3');
        archer.play();
    }
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    if (widget.getAttribute("auto") != 'true') {
        changeScore(widget.getAttribute("reap"));
        showPoint(widget);
    }

    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, collect points
        if (widget.getAttribute("auto") == 'true') {
            changeScore(widget.getAttribute("reap"));
            showPoint(widget);
            harvest(widget);
            // Play sound?
            const audio = new Audio('collect.mp3');
            audio.play();
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function changeScore(amount) {
    score.innerHTML = parseInt(score.innerHTML) + parseInt(amount);

    // Update the stores to block buying expensive boxes
    for (let store of stores) {
        let bank = parseInt(score.innerHTML);
        let cost = parseInt(store.getAttribute("cost"));

        if (bank < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}

function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.style.left = "50%";
    number.style.top = "50%";
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}