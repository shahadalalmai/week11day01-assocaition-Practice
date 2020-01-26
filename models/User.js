const mongoose = require('mongoose') 
const Schema = mongoose.Schema


const TweetSchema = new Schema ({
    tweetText: {
        type: String,
    }
}, {
    timestamps: true
})

const UserSchema = new Schema ({
    name: {
        type: String,
        default: "Invalid User" // this case when a user enters something that does not match my schema requirements
    },
    tweets: [TweetSchema] // a one to many relationship
})

// we create models
const TweetModel = mongoose.model('Tweet', TweetSchema)
const UserModel = mongoose.model('User', UserSchema)

module.exports = {TweetModel, UserModel}