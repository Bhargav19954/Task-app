const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User',{
    first_name:{
        type:String,
        required : true,
    },
    last_name:{
        type:String,
        required : true,
    },
    email:{
        type:String,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password:{
       type : String,
       required: true,
       minLength : 8 
    },
    age:{
        type : Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = User;