var diff = 0;
var date = Date.now();
var player

const TABS = {
    chTabs(i, x) {
        player.tabs[i] = x
        for (let j = i+1; j < player.tabs.length; j++) player.tabs[j] = 0
    },
    1: [
        {id: 'Generators', unl() { return true }, style: ''},
        {id: 'Sacrifice', unl() { return true }, style: ''},
        {id: 'Achievements', unl() { return true }, style: ''},
        {id: 'Options', unl() { return true }, style: ''},
        {id: 'Automation', unl() { return player.unlocks.includes('automation') }, style: ''},
    ],
}

const FUNCTIONS = {
    lengths: {
        scaled_gen_cost: [E(2), E(3), E(5), E(8), E(12), E(18), E(25), E(36), E(49), E(71)],
        getGain(x) {
            let gain = player.length_generators[x].amount.mul(this.getMultipliers(x))
            return gain
        },
        getMultipliers(x) {
            let mult = E(1.5)
            if (player.upgs.sac.includes(11)) mult = E(1.8)
            if (player.achs.includes(30)) mult = mult.mul(1.1)
            if (player.achs.includes(24) && x == 1) mult = mult.mul(1.1)
            if (player.achs.includes(26) && x == 1) mult = mult.mul(1.1)

            let lvl = player.length_generators[x].boughts
            if (lvl.gte(100)) lvl = lvl.sub(100).pow(0.9).add(100)

            let eff = mult.pow(lvl)
            eff = eff.mul(this.getMultEff().cur)
            eff = eff.mul(ACHS.reward().lengths)
            if (player.upgs.sac.includes(12) && x == 10) eff = eff.mul(UPGS.sac[12].effect())
            if (player.sacrifices.gt(0)) eff = eff.mul(FUNCTIONS.sacrifice.effect())
            return eff
        },
        getGenCost(x, y=player.length_generators[x].boughts) {
            let scaled = this.scaled_gen_cost[x-1]
            return E(10).pow(scaled).pow(y.add(1)).div(10)
        },
        bulkGen(x) {
            let scaled = this.scaled_gen_cost[x-1]
            return player.lengths.mul(10).add(1).log10().div(scaled).sub(1).floor()
        },
        buyMaxGen(x) {
            let bulk = this.bulkGen(x)
            let cost = this.getGenCost(x, bulk)
            if (this.canBuy(x) && bulk.add(1).gte(player.length_generators[x].boughts)) {
                player.lengths = player.lengths.sub(cost)
                player.length_generators[x].amount = player.length_generators[x].amount.add(bulk.add(1).sub(player.length_generators[x].boughts))
                player.length_generators[x].boughts = bulk.add(1)
            }
        },
        canBuy(x) { return player.lengths.gte(this.getGenCost(x)) },
        buyGen(x) {
            if (this.canBuy(x)) {
                player.lengths = player.lengths.sub(this.getGenCost(x))
                player.length_generators[x].amount = player.length_generators[x].amount.add(1)
                player.length_generators[x].boughts = player.length_generators[x].boughts.add(1)
            }
        },
        getMultEff() {
            let eff = {}
            eff.mult = E(1.125)
            if (player.achs.includes(21)) eff.mult = eff.mult.mul(1.03)
            eff.mult = eff.mult.pow(this.metas.effect())

            let lvl = player.mults
            if (lvl.gte(100)) lvl = lvl.sub(100).pow(0.9).add(100)
            eff.cur = eff.mult.pow(lvl)

            return eff
        },
        getMultCost(x=player.mults) {
            return E(10).pow(x.add(3))
        },
        bulkMult() {
            return player.lengths.add(1).log10().sub(3).floor()
        },
        buyMaxMult() {
            let bulk = this.bulkMult()
            let cost = this.getMultCost(bulk)
            if (this.canBuyMul() && bulk.add(1).gte(player.mults)) {
                player.lengths = player.lengths.sub(cost)
                player.mults = bulk.add(1)
            }
        },
        canBuyMul() { return player.lengths.gte(this.getMultCost()) },
        buyMult() {
            if (this.canBuyMul()) {
                player.lengths = player.lengths.sub(this.getMultCost())
                player.mults = player.mults.add(1)
            }
        },
        buyAll() {
            this.buyMaxMult()
            for (let x = 1; x <= 10; x++) this.buyMaxGen(x)
        },
        metas: {
            req() { return player.metas.mul(2).add(4) },
            canReset() { return player.length_generators[10].boughts.gte(this.req()) },
            reset() {
                if (this.canReset()) {
                    player.metas = player.metas.add(1)
                    this.doReset()
                }
            },
            doReset(msg) {
                player.lengths = E(10)
                for (let x = 1; x <= 10; x++) player.length_generators[x] = {
                    amount: E(0),
                    boughts: E(0),
                }
                player.mults = E(0)
            },
            effect() {
                let lvl = player.metas
                if (lvl.gte(10)) lvl = lvl.sub(10).pow(0.9).add(10)
                if (player.achs.includes(28)) lvl = lvl.mul(1.05)
                let eff = lvl.add(1).pow(1/4)
                if (eff.gte(2)) eff = eff.sub(1).pow(2/3).add(1)
                if (player.upgs.sac.includes(22)) eff = eff.pow(FUNCTIONS.lengths.megas.effect())
                return eff
            },
        },
        megas: {
            req() { return player.megas.add(5).pow(2).sub(5) },
            canReset() { return player.metas.gte(this.req()) },
            reset() {
                if (this.canReset()) {
                    player.megas = player.megas.add(1)
                    this.doReset()
                }
            },
            doReset(msg) {
                player.lengths = E(10)
                for (let x = 1; x <= 10; x++) player.length_generators[x] = {
                    amount: E(0),
                    boughts: E(0),
                }
                player.mults = E(0)
                player.metas = E(0)
            },
            effect() {
                let lvl = player.megas
                if (lvl.gte(10)) lvl = lvl.sub(10).pow(0.9).add(10)
                let eff = lvl.add(1).pow(1/9)
                return eff
            },
        },
    },
    sacrifice: {
        points() {
            let gain = player.lengths.add(1).log10().sub(19).max(0)
            if (player.upgs.sac.includes(13)) gain = gain.mul(UPGS.sac[13].effect())
            if (player.upgs.sac.includes(21)) gain = gain.mul(ACHS.reward().lengths)
            return gain.floor()
        },
        canReset() { return this.points().gte(1) },
        reset() {
            if (this.canReset()) {
                player.sacrifices = player.sacrifices.add(this.points())
                this.doReset()
            }
        },
        doReset(msg) {
            player.lengths = E(10)
            for (let x = 1; x <= 10; x++) player.length_generators[x] = {
                amount: E(0),
                boughts: E(0),
            }
            player.mults = E(0)
            player.metas = E(0)
            player.megas = E(0)
        },
        effect() {
            let eff = player.sacrifices.add(1)
            if (player.upgs.sac.includes(14)) eff = eff.pow(UPGS.sac[14].effect())
            return eff
        },
    },
    unlocks: {
        features: {
            'automation': {
                title() { return 'Automation' },
                can() { return player.lengths.gte('e1000') },
            },
        },
        get(id) {
            if (this.features[id].can() && !player.unlocks.includes(id)) {
                player.unlocks.push(id)
                $.notify('You unlocked '+this.features[id].title()+'!', 'success')
            }
        },
    },
}

const UPGS = {
    buy(name, id) {
        let cost = UPGS[name][id].cost()
        let can = false
        if (UPGS[name].parent != undefined) can = player[UPGS[name].parent][UPGS[name].res].gte(cost) && (UPGS[name].type == 'normal'?!player.upgs[name].includes(id):true)
        else can = player[UPGS[name].res].gte(cost) && (UPGS[name].type == 'normal'?!player.upgs[name].includes(id):true)
        if (can) {
            if (UPGS[name].parent != undefined) { player[UPGS[name].parent][UPGS[name].res] = player[UPGS[name].parent][UPGS[name].res].sub(cost) }
            else player[UPGS[name].res] = player[UPGS[name].res].sub(cost)
            switch(UPGS[name].type) {
                case 'normal':
                    player.upgs[name].push(id)
                    break
                case 'buyables':
                    if (player.upgs[name][id] == undefined) player.upgs[name][id] = E(0)
                    player.upgs[name][id] = player.upgs[name][id].add(1)
                    break
            }
        }
    },
    bulk(name, id) {
        let bulk = UPGS[name][id].bulk()
        let cst = UPGS[name][id].cost(bulk)
        let can = false
        if (UPGS[name].parent != undefined) can = player[UPGS[name].parent][UPGS[name].res].gte(cst)
        else can = player[UPGS[name].res].gte(cst)
        if (can && bulk.add(1).gt(FUNCS.hasUpgrade(name, id))) {

            if (UPGS[name].parent != undefined) { player[UPGS[name].parent][UPGS[name].res] = player[UPGS[name].parent][UPGS[name].res].sub(cst) }
            else player[UPGS[name].res] = player[UPGS[name].res].sub(cst)
            if (player.upgs[name][id] == undefined) player.upgs[name][id] = E(0)
            player.upgs[name][id] = bulk.add(1)
        }
    },
    buyMax(name, bulk=true) {
        for (let x = 1; x <= UPGS[name].cols; x++) if (UPGS[name][x].unl()) {
            if (bulk && UPGS[name][x].bulk != undefined) {
                UPGS.bulk(name, x)
                continue
            }
            UPGS.buy(name, x)
        }  
    },

    /*
    11: {
        unl() { return true },
        desc() { return 'Placeholder.' },
        cost() { return E(1/0) },
        can() { return player.sacrifices.gte(this.cost()) },
        effect() {
            let eff = E(1)
            return eff
        },
        effDesc(x=this.effect()) { return format(x)+'x' },
    },
    */

    sac: {
        name: 'sac',
        type: 'normal',
        res: 'sacrifices',

        cols: 4,
        rows: 2,

        11: {
            unl() { return true },
            desc() { return 'Increase multiplier per boughts ℓ_P generators. [x1.5 → x1.8]' },
            cost() { return E(500) },
            can() { return player.sacrifices.gte(this.cost()) },
        },
        12: {
            unl() { return true },
            desc() { return 'Sacrifices boost generator ℓ_P-10.' },
            cost() { return E(1500) },
            can() { return player.sacrifices.gte(this.cost()) },
            effect() {
                let eff = player.sacrifices.add(1).pow(player.sacrifices.add(1).log10())
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 0)+'x' },
        },
        13: {
            unl() { return true },
            desc() { return 'Generator ℓ_P-10 boost Sacrifices gain.' },
            cost() { return E(3000) },
            can() { return player.sacrifices.gte(this.cost()) },
            effect() {
                let eff = player.length_generators[10].boughts.add(1)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 0)+'x' },
        },
        14: {
            unl() { return true },
            desc() { return 'Raise Sacrifice effect based on unspent ℓ_P.' },
            cost() { return E(50000) },
            can() { return player.sacrifices.gte(this.cost()) },
            effect() {
                let eff = player.lengths.add(1).log10().add(1).log10().max(1)
                return eff
            },
            effDesc(x=this.effect()) { return '^'+format(x) },
        },

        21: {
            unl() { return true },
            desc() { return 'Achievement multiplier can affect Sacrifices gain.' },
            cost() { return E(500000) },
            can() { return player.sacrifices.gte(this.cost()) },
        },
        22: {
            unl() { return true },
            desc() { return 'Unlock Megaplier.' },
            cost() { return E(5e7) },
            can() { return player.sacrifices.gte(this.cost()) },
        },
    },
}

function loop() {
    diff = Date.now()-date;
    calc(diff);
    date = Date.now();
}

function format(ex, acc=3) {
    ex = E(ex)
    if (ex.isInfinite()) return 'Infinity'
    let e = ex.log10().floor()
    if (e.lt(9)) {
        if (e.lt(3)) {
            return ex.toFixed(acc)
        }
        return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } else {
        if (ex.gte("eeee9")) {
            let slog = ex.slog()
            return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(3)) + "F" + format(slog.floor(), 0)
        }
        let m = ex.div(E(10).pow(e))
        return (e.log10().gte(9)?'':m.toFixed(3))+'e'+format(e,0)
    }
}

setInterval(loop, 50)