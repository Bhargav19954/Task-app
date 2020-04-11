const exprees = require("express");
require('./models/db')
const app = exprees();

app.use((req,res,next)=>{
    console.log("pass ");
    next();
    
});

app.get('/',(req,res)=>{
    res.send("Working")
})

app.listen(3000,()=>{
console.log("server is running")
})