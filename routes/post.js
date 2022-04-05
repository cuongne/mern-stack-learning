const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

// @route POST api/post
// @desc Create post 
// @ access Private
router.post('/', async (req, res) => {
    const { title, description, url, status } = req.body

    //Simple validation
    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' })
    }
    try {
        const newPost = new Post({ title, description, url: (url.startsWith('https://')) ? url : `https://${url}`, status: status || 'TO LEARN', user: '6245bcd563aff9aa4c20a815' })
        
        await newPost.save()

        res.json({success:true, message:'Happy learning!', post:newPost})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router