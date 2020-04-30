const Tasks = require('../models/tasks');
const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth")
const multer = require('multer')


router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    const resultsPerPage = 20;
    const page = parseInt(req.query.page) >= 1 ? req.query.page : 1;
   
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if (req.query.title) {
        match.title = { $regex: req.query.title, '$options' : 'i' }
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: resultsPerPage,
                skip: resultsPerPage*(page-1),
                sort 
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/tasks', auth, upload.single('image'),async (req, res) => {
    const buffer = req.file ? req.file.buffer : '';
    const task = new Tasks({
        ...req.body,
        owner: req.user._id,
        image : buffer
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'target_date','status','title']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id/image', async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id)
        console.log(task)
        if (!task || !task.image) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(task.image)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;