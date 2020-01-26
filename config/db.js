const mongoose = require('mongoose') 
mongoose.connect(`mongodb://localhost/users`,
{ useNewUrlParser: true, useUnifiedTopology: true,
useFindAndModify: false, useCreateIndex: true})

const db = mongoose.connection // initiate db connection

// error handling
db.on('error', (err => console.log(err))) //handling error
db.once('open', (() => console.info('Mongoose connected', "//", new Date())))

module.exports = db