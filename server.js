const express = require("express")

const app = express()
.disable("x-powered-by")
.use(express.static(__dirname+"/dist", {
    setHeaders(res){
        res.status(200)
    }
}))

app.listen(80)
console.log(`Listening on http://127.0.0.1:80`)