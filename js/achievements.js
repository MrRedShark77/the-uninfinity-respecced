const ACHS = {
    unl(id) {
        if (!player.achs.includes(id)) {
            player.achs.push(id)
            $.notify(this[id].title(), 'success')
        }
    },
    getText(id) { return this[id].title()+'\n\n'+this[id].desc() },

    reward() {
        let length = E(player.achs.length)

        let eff = {}
        eff.lengths = length.add(1)

        return eff
    },

    cols: 10,
    rows: 2,

    /*
    11: {
        title() { return 'Placeholder' },
        desc() { return 'Placeholder.' },
        unl() { return false },
    },
    */

    11: {
        title() { return 'First Generator' },
        desc() { return 'Buy Generator ℓ_P-1.' },
        unl() { return player.length_generators[1].boughts.gte(1) },
    },
    12: {
        title() { return 'Square Ten' },
        desc() { return 'Buy Generator ℓ_P-2.' },
        unl() { return player.length_generators[2].boughts.gte(1) },
    },
    13: {
        title() { return 'XXX Turkey!' },
        desc() { return 'Buy Generator ℓ_P-3.' },
        unl() { return player.length_generators[3].boughts.gte(1) },
    },
    14: {
        title() { return 'Four - Four letters in word' },
        desc() { return 'Buy Generator ℓ_P-4.' },
        unl() { return player.length_generators[4].boughts.gte(1) },
    },
    15: {
        title() { return 'Пятерочка' },
        desc() { return 'Buy Generator ℓ_P-5.' },
        unl() { return player.length_generators[5].boughts.gte(1) },
    },
    16: {
        title() { return 'Ni..' },
        desc() { return 'Buy Generator ℓ_P-6.' },
        unl() { return player.length_generators[6].boughts.gte(1) },
    },
    17: {
        title() { return '1/3 Lucky' },
        desc() { return 'Buy Generator ℓ_P-7.' },
        unl() { return player.length_generators[7].boughts.gte(1) },
    },
    18: {
        title() { return 'You can tell a Magic 8-Ball?' },
        desc() { return 'Buy Generator ℓ_P-8.' },
        unl() { return player.length_generators[8].boughts.gte(1) },
    },
    19: {
        title() { return '..ce' },
        desc() { return 'Buy Generator ℓ_P-9.' },
        unl() { return player.length_generators[9].boughts.gte(1) },
    },
    20: {
        title() { return 'This generator never exist' },
        desc() { return 'Buy Generator ℓ_P-10.' },
        unl() { return player.length_generators[10].boughts.gte(1) },
    },
    21: {
        title() { return 'Can boost last generator?' },
        desc() { return 'Sacrifice ℓ_P. Reward: Multiplier Powers are 3% stronger.' },
        unl() { return player.sacrifices.gte(1) },
    },
    22: {
        title() { return 'MultiMultiplier' },
        desc() { return 'Get Metaplier Powers.' },
        unl() { return player.metas.gte(1) },
    },
    23: {
        title() { return 'MMM Turkey!' },
        desc() { return 'Get 3 Metaplier Powers.' },
        unl() { return player.metas.gte(3) },
    },
    30: {
        title() { return 'Self-Break Infinity' },
        desc() { return 'Get '+format(E(2).pow(1024))+' ℓ_P. Reward: Generators ℓ_P are 10% stronger.' },
        unl() { return player.lengths.gte(E(2).pow(1024)) },
    },
}