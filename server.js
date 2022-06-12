const express = require("express")
const chokidar = require("chokidar")
const { join } = require("path")
const ws = require("ws")

const watcher = chokidar.watch(join(__dirname, "dist"), {
    ignored: /^\./,
    persistent: true
})

const app = express()
.disable("x-powered-by")
.use(express.static(__dirname+"/dist", {
    setHeaders(res){
        res.status(200)
    }
}))

const server = app.listen(80)
const wss = new ws.Server({
    server: server
})
wss.on("connection", (ws) => {
    const listener = () => {
        ws.send("update")
    }
    watcher.on("all", listener)
    ws.on("close", () => {
        watcher.off("all", listener)
    })
})
console.log(`Listening on http://127.0.0.1:80`)