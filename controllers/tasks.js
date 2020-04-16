const Taks = require('../models/tasks');
const express = require('express');
const router = express.Router();


router.get('/tasks',(req,res)=>{
    Taks.find({},(error,result)=>{
        if(error) throw new error;
        console.log(result);
        res.send(result);
    })
});

router.post('/tasks',async (req,res)=>{
    const task =  new Taks(req.body);
    try{
        await task.save()
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router;