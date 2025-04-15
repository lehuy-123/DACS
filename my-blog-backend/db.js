const mongoose = require("mongoose")

var mongoURL = "mongodb+srv://huy20040801:huy20040801@cluster0.wqh4zt6.mongodb.net/my-blogs"

mongoose.connect(mongoURL, {useUnifiedTopology: true, useNewUrlParser: true})

var connection = mongoose.connection

connection.on('error', () => { 
   console.log('MongoDB Connection Failed!')
})
connection.on('connected', () => { 
   console.log('MongoDB Connection Successful!')
})


module.exports = mongoose