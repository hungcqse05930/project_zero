const bcrypt = require('bcrypt')

exports.login = (req, res, next) => {

}

exports.signup = (req, res, next) => {
    // hash password then create a record in `user` table
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            // new user created
            const user = new User({
                phone: req.body.phone,
                password: hash
            })

            // save to the database
            user.save().then(() => {
                res.status(201).json({
                    message: 'Created! 😋'
                })
            })
        })
        .catch((error) => {
            return res.status(500).json({
                error: error
            })
        })
}
