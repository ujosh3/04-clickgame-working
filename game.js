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
    
    store.setAttribute("cost", cost*1.4);
    store.children[3].innerHTML = `${(cost*1.4).toFixed(0)} Gold`
    changeScore(-1 * cost);

    // If Super-Gompei already exists
    var superGompei = document.getElementById("super-mine");
    if (store.getAttribute("name") === "Super Mine" && superGompei !== null) {
        superGompei.setAttribute("reap", (parseInt(superGompei.getAttribute("reap")) + 3000));
        return;
    }
    var barb = document.getElementById("barb");
    if (store.getAttribute("name") === "Barbarian" && barb !== null) {
        barb.setAttribute("reap", (parseInt(barb.getAttribute("reap")) + 50));
        return;
    }
    var archer = document.getElementById("archer");
    if (store.getAttribute("name") === "Archer" && archer !== null) {
        archer.setAttribute("reap", (parseInt(archer.getAttribute("reap")) + 50));
        return;
    }
    var mine = document.getElementById("mine");
    if (store.getAttribute("name") === "Gold Mine" && mine !== null) {
        mine.setAttribute("reap", (parseInt(mine.getAttribute("reap")) + 125));
        return;
    }

    var widget = document.createElement("div");
    if (store.getAttribute("name") == "Super Mine")
        widget.id = "super-mine";
    if (store.getAttribute("name") == "Barbarian")
        widget.id = "barb";
    if (store.getAttribute("name") == "Archer")
        widget.id = "archer";
    if (store.getAttribute("name") == "Gold Mine")
        widget.id = "mine";
    widget.classList.add("widget");
    fillWidget(store, widget);
    const build = new Audio('build.mp3');
    build.play();
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
        const barb = new Audio('battle.mp3');
        barb.play();
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