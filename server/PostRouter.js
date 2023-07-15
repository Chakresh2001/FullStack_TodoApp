const express = require('express');
const TodoModel = require("../model/TodoModel")
const auth = require('../middleware/auth')
const UserModel = require('../model/UserModel')

const PostRouter = express.Router()

PostRouter.post("/add",auth,async(req, res)=>{

    try {
    const {userUniqueId, title} = req.body

    const Todo = TodoModel({title:title})
    await Todo.save()
    
    const user = await UserModel.findById(userUniqueId)
    if(!user){
        res.status(400).send("kindly login")
    }
    
    user.todos.push(Todo._id)

    await user.save()

    res.json({user:user})


    } catch (error) {   
        res.send("error")
    }
})

PostRouter.get("/get", auth, async(req,res)=>{

    try {

        const {userUniqueId} = req.body

        const user = await UserModel.findById(userUniqueId).populate("todos")

        res.send({todos:user.todos})

    } catch (error) {
        res.send("error")
    }

})
PostRouter.get("/get/:id", auth, async(req,res)=>{

    try {

        const {id} = req.body

        const todo = await TodoModel.findOne(id)

        res.send({todos:todo})

    } catch (error) {
        res.send("error")
    }

})

PostRouter.patch("/patch/:id", auth, async(req,res)=>{
    try {
        const {id} = req.params

        const updateData = await TodoModel.findByIdAndUpdate(id,req.body)

        res.send("updated")

    } catch (error) {
        res.end(error)
    }
})
PostRouter.delete("/delete/:id", auth, async(req,res)=>{
    try {
        const {id} = req.params
        console.log(id)
        await TodoModel.findByIdAndDelete(id)

        res.send("Deleted")

    } catch (error) {
        res.end(error)
    }
})




module.exports = PostRouter