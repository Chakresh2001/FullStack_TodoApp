const express = require('express');
const connectToserver = require("./config/db")
const UserRouter = require("./server/userRouter")
const PostRouter = require("./server/PostRouter")
const cors = require("cors")

const app = express()

app.use(cors())


app.use(express.json())

app.use('/', UserRouter)

app.use("/posts", PostRouter)

app.listen(8080, connectToserver())
