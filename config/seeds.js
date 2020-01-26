let db = require('./db')
let {UserModel, TweetModel} = require("../models/User")
// First we clear the database of existing Users and Tweets.
UserModel.remove({})
  .then(() => console.log('All Users deleted!'))
  .catch(error => console.log(error))
TweetModel.remove({})
  .then(() => console.log('All Tweets deleted!'))
  .catch(error => console.log(error))
// Now, we will generate instances of a Users and of their Tweets.
const tweet1 = new TweetModel({tweetText: "Fun with Express"})
const tweet2 = new TweetModel({tweetText: "Backend solved world hunger"})
const tweet3 = new TweetModel({tweetText: "Full stack devs in here"})
const tweet4 = new TweetModel({tweetText: "We love APIs"})
const tweets = [tweet1, tweet2, tweet3, tweet4]
const ahmed = new UserModel({name: "Ahmed" , tweets: tweets})
const maha = new UserModel({name: "Maha", tweets: tweets})
const sami = new UserModel({name: "Sami", tweets: tweets})
const salman = new UserModel({name: "Salman", tweets: tweets})
const users = [ahmed, maha, sami, salman];
// Inserting into my DB
UserModel.insertMany(users)
  .then(() => console.info(`Added ${users.length} users to database.`, "//" ,new Date()))
  .catch((error) => console.log(error))
  .then(()=>db.close())