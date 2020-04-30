const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const valid = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ _id: valid._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(400).send({ message: 'Please Authenicate' })
    }
}

module.exports = auth;