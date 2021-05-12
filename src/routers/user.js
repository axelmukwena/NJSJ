const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const {users} = require('../models/user')

const router = new express.Router()

const path = require('path')
// Create user route
router.post('/users', async(req,res) => {
    const user = new users(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('auth_token',token)
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login user
router.post('/users/login',async (req, res) =>{
    try {
        const user = await users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.status(200).send({user , token})
    } catch (error) {
        res.status(500).send('Unable to login here')
    }
})

//Logout user
router.post('/users/logout', auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Logout  all
router.post('/users/logoutAll', auth, async(req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// get user profile
router.get('/users/me', auth, (req, res)=>{
    res.send(req.user)
})

// update user
router.patch('/users/me', auth, async (req, res)=>{
    let updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'surname', 'email', 'password']
    const isValideOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValideOperation) res.status(400).send({error: 'Invalid updates'})

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
        updates = undefined
    } catch (error) {
        res.status(500).send(error)
        updates = undefined
    }
})

// delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

// Uploading user avatar
const upload = multer ({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error ('Please upload an image file'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'),async (req, res)=>{
    try {
        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height:250
        }).png().toBuffer()

        req.user.avatar = buffer
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// delete user avatar
router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//render user avatar
router.get('/users/me/avatar', auth, (req, res)=>{
    try {
        if(!req.user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})
module.exports = router