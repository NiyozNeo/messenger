const fs = require("fs")
const util = require("util")

module.exports = {
    read: async (dir) => {
        const read = util.promisify(fs.readFile)
        const data = await read(dir, "utf8")
        return data.length ? JSON.parse(data) : data
    },
    write: async (dir, data) => {
        const write = util.promisify(fs.writeFile)
        return await write(dir, JSON.stringify(data, null, 2))
    }
}