var Dat = require('dat-node')
var express = require('express')
var parser = require('body-parser')
var session = require('express-session')
var static = require('serve-static')
var uuid = require('uuid/v4')

var sessionOpts = {
  secret: 'somethingsomethingblablablah',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}

var app = express()
app.use(session(sessionOpts))
app.use(parser.json())
app.use(static('public'))

app.get('/auth/dat', function (req, res) {
  req.session.token = uuid()
  req.session.save(function (err) {
    if (err) {
      res.status(500)
      res.json({
        auth: false,
        err: err.message
      })
      return
    }
    res.status(200)
    res.json({
      token: req.session.token
    })
  })
})

app.post('/auth/dat', function (req, res) {
  var key = req.body.profileKey
  var token = req.session.token
  console.info('requested authentication:', key)

  Dat(`/tmp/dat-auth-${key}`, {
    key: key,
    sparse: true
  }, function (err, dat) {
    if (err) {
      console.error(err)
      res.status(500)
      res.json({
        auth: false,
        err: 'Server error'
      })
      return
    }
    dat.joinNetwork(function (err) {
      if (err || !dat.network.connected || !dat.network.connecting) {
        console.warn('failed connection:', key)
        res.status(401)
        res.json({
          auth: false,
          err: 'Failed to connect to profile'
        })
        return
      }
      dat.archive.readFile(token, function (err) {
        if (err) {
          console.warn('failed authentication:', key)
          res.status(401)
          res.json({
            auth: false,
            err: 'No valid token found in profile'
          })
          return
        }
        console.info('successful authentication:', key)
        res.status(200)
        res.json({
          auth: true
        })
      })
    })
  })
})

app.listen(5000)
