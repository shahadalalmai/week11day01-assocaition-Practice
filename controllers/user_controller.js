const router = require('express').Router() // declaring my router
const {UserModel, TweetModel} = require('../models/User')

router.get('/', (req, res) => {
    res.send({url: req.originalUrl})
})

router.get('/users', (req, res) => {
    UserModel.find({})
    .then( (returnedUsers) => {
        res.send({
            users: returnedUsers
        })
    })
    .catch( err => console.log(err) )
}) //end get users
// JavaScript is a non blocking codes, meaning it has to follow a top to bottom excution
// it will never excute a method below unless it finished mthods above
// we use promise to introduce bockage in JS, this way we are doing asynchronocity

router.get('/users/:userid', (req, res) => {
    const userid = req.params.userid
    UserModel.findById(userid)
    .then( (returnedUser) => {
        res.send({
            user: returnedUser
        })
    })
    .catch( err => console.log(err) )
}) // end show one user


router.post('/users/new', (req, res) => {
    let newUser = req.body
    let createUSer = new UserModel({
        "name": newUser.name , "tweets": newUser.tweets // they keys are also string, so it's ok to put it in double coutation
        // this one to many relationship. when we create a user, it will use the new command to also create tweets using the tweets schema
    })
    createUSer.save()
    .then( (savedUser) => {
        res.redirect(`/users/${savedUser._id}`)
    } )
}) // new
// "__v": 0 . This is to tell us the versions of when it's updated or edited


router.patch('/users/:userid', (req, res) => { // is it patch or put ? it doesnt matter, both are the same
    let userId = req.params.userid
    let updatedUser = req.body
    UserModel.findByIdAndUpdate(userId, updatedUser)
    .then( (updatedUser) => {
        res.redirect(`/users/${userId}`)
    })
}) // update

router.delete('/users/:userid', (req, res) => {
    let userID = req.params.userid
    UserModel.findByIdAndDelete(userID)
    .then( () => {
        res.redirect('/users')
    } )
}) // dalete


//showing all tweets for single user
router.get('/users/:userid/tweets', (req, res) => {
    const userid = req.params.userid
    UserModel.findById(userid)
    .then( (returnedUser) => {
        res.send({
            userTweets: returnedUser.tweets
        })
    })
    .catch( err => console.log(err) )
}) // end

// showing specific tweet for a specific user
router.get('/users/:userid/tweets/:tweetid', (req, res) => {
    const userid = req.params.userid
    const tweetid = req.params.tweetid
    UserModel.findById(userid)
    .then( (returnedUser) => {
        const currentTweet = returnedUser.tweets.find( tweet => tweet._id == tweetid)
        res.send({
            tweet: currentTweet // returning it as an object
        })
    })
    .catch( err => console.log(err) )
}) // end


// add a new tweet to a specific user
router.post('/users/:userid', (req, res) => {
    const userid = req.params.userid
    const newTweet = req.body
    const createTweet = new TweetModel({"tweetText": newTweet.tweetText}) // we created a new tweet. Now I will push it to a specific user, then I save the updated user
    // this is how we deal with embeded documents. I have to deal with their parents
    UserModel.findById(userid)
    .then( (user) => {
        user.tweets.push(createTweet) // now I updated the user object
        return user // in here we returned the updated user bcuz we want to pass it to the next then block statement. If we didn't return it, I will not make sure that it will finish excuting before anything else
    })
    .then( user => user.save() ) // I saved the udpated user
    .then( (savedUserWithNewTweet) => {
        res.redirect(`/users/${savedUserWithNewTweet._id}`) // to see the updates on this particular user, I can point at it by savedUserWithNewTweet._id or userid
    } )
    .catch( err => console.log(err) )
}) // post request is unieuqe, we dont have to /users/:userid/tweets

// this is the body i used in postman
// {
                  
//     "tweetText": "Sunday is so much fun mashallah"
// }



// update a specific tweet for a specific user
router.put('/users/:userid/tweets/:tweetid', (req, res) => {
    const userid = req.params.userid
    const tweetid = req.params.tweetid
    const updatedTweet = req.body
    UserModel.findById(userid)
    .then( (user) => {
        let index = user.tweets.findIndex( tweet => tweet._id == tweetid) // dealing wit array of tweets to find a tweet object that has the index where the id is the same as the tweet the user want to update
        user.tweets[index].tweetText = updatedTweet.tweetText // in here we are changing the text to update the tweet
        return user
    })
    .then( user => user.save()) // i save the updated user which has an updated tweet
    .then ( user => res.redirect(`/users/${userid}/tweets/${tweetid}`))
    .catch( err => console.log(err) )
})



// delete a specific tweet for a specific user
router.delete('/users/:userid/tweets/:tweetid', (req, res) => {
    const userid = req.params.userid
    const tweetid = req.params.tweetid
    const updatedTweet = req.body
    UserModel.findById(userid)
    .then( (user) => {
        let index = user.tweets.findIndex( tweet => tweet._id == tweetid) // the index of the tweet object i want to delete
        if (index > -1){ // bcuz we want to make sure the array has at least one object
            user.tweets.splice(index, 1) // start from the index and delete only one object
        }
        return user
    })
    .then( user => user.save())
    .then( () => res.redirect(`/users/${userid}/tweets`))
    .catch( err => console.log(err) )
})



module.exports = router