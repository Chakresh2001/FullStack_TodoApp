const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    todos:[{type:mongoose.Schema.Types.ObjectId, ref:"todos"}]
}, {versionKey:false})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel