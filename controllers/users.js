const express = require('express');
const User = require('../models/users')
const router = express.Router();
const auth = require('../middleware/auth')


router.post("/Users", async (req, res) => {
    let user = new User(req.body);
    try {
        await user.save();
        res.status(200).send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

router.post("/Users/login", async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password);
        let token = await user.generateAuthToken();
        res.status(200).send({ user,token })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
})

router.post("/Users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.status(200).send()
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get("/users/me", auth, async (req, res) => {
   res.send(req.user);
})

module.exports = router;