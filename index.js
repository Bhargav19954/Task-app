const express = require("express");
require('./models/db')
const app = express();
const taskRouter = require('./controllers/tasks');
const userRouter = require('./controllers/users');

app.use((req, res, next) => {
    next();
});


app.use(express.json())

app.get('/', (req, res) => {
    res.send("Working")
});

app.use(taskRouter);
app.use(userRouter);



app.listen(process.env.PORT, () => {
    console.log("server is running")
})

module.exports = app;