import http from "http"

const server = http.createServer ((req, res) => {
       res.sendDate("api")
})

server.listen(8080, () => {
    console.log("servidor escuchando en el puerto 8080")
})