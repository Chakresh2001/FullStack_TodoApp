const jwt = require('jsonwebtoken');
const UserModel = require("../model/UserModel")
const BlackListModel = require("../model/BlackListModel")

const auth = async(req,res,next)=>{

    try {
        const token = req.headers.authorization

        if(!token){
            return res.status(400).json({error:"Token not provided"})
        }

        const black = await BlackListModel.findOne({token:token})

        if(black){
            return res.status(400).json({error:"Token expired"})
        }


        jwt.verify(token, '1234', async function(err, decoded) {
            
            if(err){
                return res.status(400).json({error:"Invalid Token"})
            }

           const result = await UserModel.findById(decoded.userId)

           if(result){
            req.body.userUniqueId = decoded.userId
            req.body.userUniqueName = decoded.userName
            next()
           }
           else{
            res.status(400).json({error:"User does not exsist in auth"})
           }

            


        });



    } catch (error) {
        res.status(500).send("Internal server error")
    }

}


module.exports = auth