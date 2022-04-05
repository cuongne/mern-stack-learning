
require('dotenv').config()
const express = require('express')

const app = express()

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learning.a2ncd.mongodb.net/mern-learning?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Mongoose Connect')
    }
    catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}
connectDB()
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
const PORT = 5000

app.listen(PORT, () => console.log('listening on port ' + PORT))