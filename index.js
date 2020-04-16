const express = require("express");
require('./models/db')
const app = express();
const taskRouter = require('./controllers/tasks');
const userRouter = require('./controllers/users');

app.use((req, res, next) => {
    console.log("pass "+JSON.stringify(req.body));
    next();
});

//app.use(cors());

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Working")
});

app.use(taskRouter);
app.use(userRouter);

process.nextTick(()=>{
    console.log("next tick")
})

app.listen(3000, () => {
    console.log("server is running")
})