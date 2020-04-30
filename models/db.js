const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true }).then(
    console.log("Database conneced...")
).catch();