const express = require('express')
const { sequelize, User, Post } = require('./models');
const post = require('./models/post');
const authrouter = require('./routes/auth/auth')

var bodyParser = require('body-parser').json();
const app = express()
app.use(express.json())


app.use("/api/auth", authrouter)
app.post('/users', bodyParser, async (req, res) => {
    const { username, password } = req.body
    try {
        const userTemp = await User.create({ username, password })
        return res.json(userTemp)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ include: 'posts' })
        return res.json(users)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


app.get('/users/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
        const user = await User.findOne({
            where: { uuid }
        })
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

app.post('/posts', bodyParser, async (req, res) => {
    const { userUuid, body } = req.body

    try {
        const user = await User.findOne({
            where: { uuid: userUuid }
        })

        const post = await Post.create({ body, userId: user.id })
        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


app.get('/posts', async (req, res) => {
    try {
        const post = await Post.findAll({ include: ['user'] })
        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

app.listen({ port: 5000 }, async () => {
    console.log('Server up')
    await sequelize.authenticate()
    console.log('Database connnected')
})
