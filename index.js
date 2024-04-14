import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import mongoose from "mongoose"

import { registerValidation } from "./validations/auth.js"

import { validationResult } from 'express-validator'

import UserModel from './models/User.js'

mongoose
    .connect('mongodb+srv://iykisoba:artur42r@cluster0.reryft7.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log("DB error", err))

const app = express()

app.use(express.json())

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email, })

        if (!user) {
            return req.status(404).json({
                message: "Пользователь не найден"
            })
        }


        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return req.status(404).json({
                message: "Неверный логин или пароль"
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: "30d"
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })




    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось авторизоваться"
        })
    }



})



app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) res.status(400).json(errors.array())

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._doc._id
            },
            "secret1234",
            {
                expiresIn: "30d"
            }
        );


        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегетрироваться"
        })
    }

})




app.listen(4444, (err) => {

    if (err) {
        return console.log("Ошибка!!!")
    }

    console.log("Server ОК")

})