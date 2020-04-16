const express = require('express');
const User =  require('../models/users')

const router = express.Router();


router.post("/Users", async (req, res) => {
    let user =  new User(req.body);
    try{
        await user.save();
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router;