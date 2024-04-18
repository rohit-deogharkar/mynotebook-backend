require('dotenv').config()
const mongoose = require('mongoose')

const mongoUri = process.env.MONGO_URI

const connectToMongo = () =>{
    mongoose.connect(mongoUri)
    .then(()=>{
        console.log("Connect to mongodb successfully")
    })
}

module.exports = connectToMongo 