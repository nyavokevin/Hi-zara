const express = require('express')
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser').json();
require('dotenv').config()
const router = express.Router()

router.get('/test', bodyParser, async (req, res) => {
    const { token } = req.body
    jwt.verify(token, process.env.TOKEN_KEY, (err, verifiedJwt) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send(verifiedJwt)
        }
    })
})

module.exports = router