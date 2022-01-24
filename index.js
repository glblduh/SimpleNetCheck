const express = require("express")
const app = express()
const http = require("http")
const ping = require("ping")
const dns = require("dns")
const { Server } = require("socket.io")
const server = http.createServer(app)
const io = new Server(server)

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + "/index.html")
})

app.get("/vuejs", (req, res) => {
    res.status(200).sendFile(__dirname + "/vue.js")
})

io.on("connection", socket => {
    socket.on("pingtest", addr => {
        ping.promise.probe(addr).then((res) => {
            socket.emit("pingdata", res.alive, res.avg)
        })
    })
    socket.on("dnscheck", host => {
        dns.promises.resolve(host, "A").then(ip => {
            socket.emit("dnsdata", true, ip[0])
        }).catch(err => {
            socket.emit("dnsdata", false, err.code)
        })
    })
})

server.listen(1010)