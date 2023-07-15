const mongoose = require('mongoose');
require('dotenv').config();

const connectToserver = async()=>{
    await mongoose.connect(process.env.SERVER_MONGODB)
    console.log("server is running")
}
module.exports = connectToserver