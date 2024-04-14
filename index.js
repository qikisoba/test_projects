import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import mongoose from "mongoose"

import { registerValidation } from "./validations/auth.js"

import { validationResult } from 'express-validator'

import { UserModel } from './models/User.js'

mongoose
    .connect('mongodb+srv://iykisoba:artur42r@cluster0.reryft7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log("DB error", err))

const app = express()

app.use(express.json())

app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) res.status(400).json(errors.array())

    const password = req.body.password
    const salt = await bcrypt.genSalt
    const passwordHash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.email,
        avatarUrl: req.body.avatarUrl,
        passwordHash: req.body.passwordHash,

    })

    const user = await doc.save()

    res.json(user)



})




app.listen(4444, (err) => {

    if (err) {
        return console.log("Ошибка!!!")
    }

    console.log("Server ОК")

})