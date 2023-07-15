const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({

    title:{type:String, required:true},
    status:{type:Boolean, default:false},
    time:{type:String, default: Date.now()}

}, {versionKey:false})

const TodoModel = mongoose.model("todos", TodoSchema)

module.exports = TodoModel