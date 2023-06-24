const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

router.post('/register', async (req, res) => {

    const { name, email, password, confirmPassword } = req.body

    if(!name){
        return res.status(422).json({ message: "O nome é obrigatório "})
    }
    if(!email){
        return res.status(422).json({ message: "O email é obrigatório "})

    }
    if(!password){
        return res.status(422).json({ message: "A senha é obrigatória "})
    }
    
    if(password !== confirmPassword){
        return res.status(422).json({ message: "As senhas não conferem! "})
    }

    //user existence

    const userExists = await User.findOne({ email: email })

    if(userExists){
        return res.status(422).json({ message: "Por favor, utilize outro email "})
    }

    //password
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try{

        await user.save()

        res.status(201).json({ message: "Usuário criado com sucesso! "})

    }catch(error){
        res.status(500).json({ message: error })
    }

})

router.get('/', async (req, res) => {

    try{

        const users = await User.find()

        res.status(200).json(users)

    }catch (error){
        res.status(500).json({error: error})
    }

})

module.exports = router