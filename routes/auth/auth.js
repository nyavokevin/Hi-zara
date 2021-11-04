const { sequelize, User } = require('../../models');
const express = require("express");
const bcrypt = require("bcrypt")
var bodyParser = require('body-parser').json();
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
require('dotenv').config()


const router = express.Router()
// Register 
router.post('/register', bodyParser, async (req, res) => {
    const { username, password } = req.body

    try {

        const userTemp = await User.create({ username, password })
        //create token
        const token = jwt.sign(
            { user_uuid: userTemp.uuid }, process.env.TOKEN_KEY, { expiresIn: "15m" }
        )
        res.cookie('token', token, {
            maxAge: 900,
            httpOnly: true,
            secure: true
        })
        return res.json(userTemp)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

module.exports = router