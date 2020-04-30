const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const user_schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    age: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

user_schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

user_schema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user['_id'].toString() }, process.env.JWT_TOKEN)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

user_schema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

user_schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
}

user_schema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user['password'] = await bcrypt.hash(user['password'], 8);
    }
    next();
})

const User = mongoose.model('User', user_schema);

module.exports = User;