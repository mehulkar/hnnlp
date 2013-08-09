var express = require("express")
var app = express()

var hn_analyzer = require('./index.js')

app.use(express.logger())

app.get('/', function(request, response) {
  hn_analyzer.render(function(html){
    response.send(html)
  })
})

var port = process.env.PORT || 5000
app.listen(port, function() {
  console.log("Listening on " + port)
})