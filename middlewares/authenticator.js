const jwt = require('jsonwebtoken');
require('dotenv').config()

function authenticator(req, res, next) {
    const token = req.headers.authorization.slice(7)

    jwt.verify(token, process.env.HASH_PASS, (err, decode) => {
        if(err) {
            res.status(400).json({
                message: err.message,
            })
        }
        // console.log(decode)
        if(decode) {
            req.body.user = decode.userId
            next()
        } else {
            res.status(400).json({
                message: 'Token is invalid',
            })
        }
    })
}

module.exports = {authenticator}
