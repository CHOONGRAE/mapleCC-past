const data = {}

require('./categories/group.json').forEach(g => {
    data[g] = {}
    require(`./categories/${g}.json`).forEach(c => {
        data[g][c] = {}
        data[g][c].img = require(`./classImg/${c}.png`).default
        data[g][c].skill = {}
        var skillList = require(`./skillList/${g}/${c}.json`)
        skillList.list.forEach(s => {
            data[g][c].skill[s] = {}
            data[g][c].skill[s].nick = skillList.nick[s]
            data[g][c].skill[s].img = require(`./skillImg/${g}/${c}/${s}.png`).default
        })
    })
})

console.log(data)

export default data