const express = require('express');
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
// @route POST api/auth/register
// @desc Register a user
// @access Public

router.get('/', (req, res) => res.send('USER ROUTE'))
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    // simple validation
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Invalid username or password' })

    try {
        // check if the user is already registered
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ success: false, message: 'Already registered' })
        }
        //All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()

        // return token

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: 'User created successfully', accessToken })
    }
    catch (error) {

    }
})
// @route POST api/auth/register
// @desc Register a user
// @access Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Invalid username or password' })
    try {
        const user = await User.findOne({ username })

        if (!user) return res.status(400).json({ success: false, message: 'Missing username or password' })

        const passwordValid = await argon2.verify(user.password, password)

        if (!passwordValid) return res.status(400).json({ success: false, message: 'Incorrect username or password' })

        //all good
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: 'Logged in successfully', accessToken })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
module.exports = router