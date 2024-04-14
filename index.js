import express from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { registerValidation } from "./validations/auth.js"
import { validationResult } from 'express-validator'


mongoose
    .connect('mongodb+srv://iykisoba:artur42r@cluster0.reryft7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log("DB error", err))

const app = express()

app.use(express.json())

app.post('/auth/register', registerValidation, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) res.status(400).json(errors.array())

    res.json({
        success: true
    })



})




app.listen(4444, (err) => {

    if (err) {
        return console.log("Ошибка!!!")
    }

    console.log("Server ОК")

})