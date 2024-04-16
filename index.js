import express from "express"
import mongoose from "mongoose"
import { postCreateValidation, loginValidation, registerValidation } from "./validations.js"
import checkAuth from './utils/checkAuth.js'
import * as UseController from './controllers/UseController.js'
import * as PostController from './controllers/PostController.js'
mongoose
  .connect('mongodb+srv://iykisoba:artur42r@cluster0.reryft7.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log("DB error", err))

  // 111
const app = express()
app.use(express.json())
app.post('/auth/login', loginValidation, UseController.login)
app.post('/auth/register', registerValidation, UseController.register)
app.get('/auth/me', checkAuth, UseController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
// app.delete('/posts', PostController.remove)
// app.patch('/posts', PostController.update)


// app.post('/auth/ebasit', ebasit)
app.listen(4444, (err) => {
  if (err) {
    return console.log("Ошибка!!!")
  }
  console.log("Server ОК")
})
