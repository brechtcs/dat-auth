var Dat = require('dat-node')
var express = require('express')
var parser = require('body-parser')
var static = require('serve-static')

var app = express()
app.use(parser.urlencoded())
app.use(datAuth)
app.use(static('public'))
app.listen(5000)

function datAuth (req, res, next) {
  if (req.url === '/auth/dat') {
    var profileKey = req.body.profileKey
    var tokenId = req.body.tokenId

    Dat(`/tmp/dat-auth-${profileKey}`, {
      key: profileKey,
      sparse: true
    }, function (err, dat) {
      if (err) {
        res.writeHead(403)
        res.end(err.message)
        return
      }
      dat.joinNetwork()
      dat.archive.readFile(`/${tokenId}`, function (err, ttl) {
        if (err) {
          res.writeHead(403)
          res.end(err.message)
          return
        }
        var now = Date.now()
        var expiry = parseInt(tokenId, 32) + parseInt(ttl)

        if (now < expiry) {
          res.writeHead(200)
          res.end('hooray!')
        } else {
          res.writeHead(403)
          res.end('nope.')
        }
      })
    })
  } else {
    next()
  }
}
