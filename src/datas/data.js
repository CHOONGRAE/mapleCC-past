const data = {}

require('./categories/group.json').forEach(g => {
    data[g] = {}
    require(`./categories/${g}.json`).forEach(c => {
        data[g][c] = require(`./skillList/${g}/${c}.json`)
    })
})

export default data