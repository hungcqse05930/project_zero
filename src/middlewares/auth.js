const jwt = require('jsonwebtoken')

// every middleware needs 3 params
module.exports = (req, res, next) => {
    try {
        // get the second element of the headers authorization which contains the token
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')

        // analyse the token
        const { userId } = decodedToken

        if (userId) {
            next()
        } else {
            throw new Error('token must contains userId')
        }

        // if it is the right user id
        // if (req.body.userId && req.body.userId !== userId) {
        //     throw 'Invalid user ID'
        // } else {
        //     next()
        // }
    } catch (e) {
        // console.error(e)
        res.status(401).json({
            error: new Error('Invalid password. 😑')
        })
    }
}