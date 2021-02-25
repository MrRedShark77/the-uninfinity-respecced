function E(x){return new ExpantaNum(x)};
function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function calc(dt) {
    player.lengths = player.lengths.add(FUNCTIONS.lengths.getGain(1).mul(dt/1000))
    for (let x = 2; x <= 10; x++) {
        player.length_generators[x-1].amount = player.length_generators[x-1].amount.add(FUNCTIONS.lengths.getGain(x).mul(dt/1000))
    }
    for (let r = 1; r <= ACHS.rows; r++) for (let c = 1; c <= ACHS.cols; c++) if (ACHS[r*10+c] != undefined) if (ACHS[r*10+c].unl()) ACHS.unl(r*10+c)
    for (let x = 0; x < Object.keys(FUNCTIONS.unlocks.features).length; x++) FUNCTIONS.unlocks.get(Object.keys(FUNCTIONS.unlocks.features)[x])
    if (player.unlocks.includes('automation')) {
        for (let x = 1; x <= 10; x++) if (player.automation.l_gens[x]) FUNCTIONS.lengths.buyMaxGen(x)
        if (player.automation.mult) FUNCTIONS.lengths.buyMaxMult()
        if (player.automation.meta) FUNCTIONS.lengths.metas.reset()
    }
}

function wipe() {
    player = {
        lengths: E(10),
        length_generators: {},
        mults: E(0),
        metas: E(0),
        megas: E(0),
        tabs: [0],
        upgs: {
            sac: [],
        },
        sacrifices: E(0),
        achs: [],
        unlocks: [],
        automation: {
            l_gens: {},
            mult: false,
            meta: false,
        },
    }
    for (let x = 1; x <= 10; x++) player.length_generators[x] = {
        amount: E(0),
        boughts: E(0),
    }
    for (let x = 1; x <= 10; x++) player.automation.l_gens[x] = false
}

function loadPlayer(load) {
    player.lengths = ex(load.lengths)
    for (let x = 1; x <= 10; x++) {
        player.length_generators[x].amount = ex(load.length_generators[x].amount)
        player.length_generators[x].boughts = ex(load.length_generators[x].boughts)
    }
    player.mults = ex(load.mults)
    player.metas = ex(load.metas)
    if (load.megas != undefined) player.megas = ex(load.megas)
    player.sacrifices = ex(load.sacrifices)
    player.achs = load.achs

    let p_upg = player.upgs, l_upg = load.upgs;
    if (l_upg.sac != undefined) p_upg.sac = l_upg.sac
    
    if (load.unlocks != undefined) player.unlocks = load.unlocks

    let p_auto = player.automation, l_auto = load.automation;
    if (l_auto != undefined) for (let x = 0; x < Object.keys(p_auto).length; x++) {
        let id = Object.keys(p_auto)[x]
        if (l_auto[id] != undefined) p_auto[id] = l_auto[id]
    }
}

function save(){
    if (localStorage.getItem("theUninfinityRespeccedSave") == '') wipe()
    localStorage.setItem("theUninfinityRespeccedSave",btoa(JSON.stringify(player)))
}

function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "The Uninfinity Respecced Save.txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != null) {
        load(loadgame)
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("theUninfinityRespeccedSave"))
    loadVue()
    setInterval(save,1000)
}