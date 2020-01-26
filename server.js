const express = require('express') // getting framework express
const app = express() // invoking the express application
const db = require('./config/db') // initiating db connection
const logger = require('morgan') // logger for debugging
const bodyParser = require('body-parser') // JSON <-> JS objects
const UserControllerRouter = require('./controllers/user_controller') // controller


app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use(logger('dev'))

app.use('/', UserControllerRouter) // loading the controller router

app.listen(3000)