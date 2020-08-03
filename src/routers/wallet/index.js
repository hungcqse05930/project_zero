// library
const express = require('express')

// middlewares
const auth = require('../../middlewares/auth')

const createWalletRouter = ({ Wallet, User }) => {
    const router = express.Router()
    
    //get wallet_amount by user_id
    router.get('/wallet/:id', async (req, res) => {
        // find by primary key = find by id
        const wallets = await Wallet.findAll(
            { attributes: ['amount'] },
            { where: { user_id : req.params.user_id } },
            {
                include: [
                    {
                        model: User,
                        required: false,
                    }]
            }
        ).then(wallets => {
            if (wallets) {
                res.send(wallets)
            } else {
                res.sendStatus(404)
            }
        });
    })

    return router
}

module.exports = {
    createWalletRouter,
}