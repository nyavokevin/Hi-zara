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

        return res.send({
            token: token,
            user: userTemp
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.post('/login', bodyParser, async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({
            where: { username: username }
        })
        if (!user) return res.status(400).send("invalid username or password")

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).send("invalid username or password")

        const token = jwt.sign({ user_uuid: user.uuid }, process.env.TOKEN_KEY, { expiresIn: "15m" });
        res.send({ token: token, expiresIn: "15m", user: user });
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

module.exports = router