const express = require("express");
const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlackListModel = require("../model/BlackListModel");
const swaggerUi = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Todo App",
      version: "1.0.0",
    },
    server: [{ url: "http://localhost:8080" }],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSdoc(options);

const UserRouter = express.Router();

UserRouter.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
UserRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({ error: "User Already Exists" });
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[1-9]/.test(password) ||
      !/[!@#$%^&*():"?]/.test(password) ||
      password.length < 8
    ) {
      return res.status(400).json({ error: "password is not vaild" });
    }

    const postUser = UserModel(req.body);

    bcrypt.hash(password, 10, async function (err, hash) {
      postUser.password = hash;
      await postUser.save();
      res.json({ message: "User Created", userCreated: postUser });
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

UserRouter.get("/userGet", async(req,res)=>{
  const users = await UserModel.find()

  res.json({users:users})
})

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "User Does Not Exist" });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          { userId: user._id, userName: user.name },
          "1234"
        );

        res.json({ message: "USer Logged in", token: token, userName:user.name });
      } else {
        res.status(500).send("Wrong Credentials");
      }
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

UserRouter.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: "Login First" });
    }

    const tokenExsists = await BlackListModel.findOne({ token: token });

    if (tokenExsists) {
      return res
        .status(400)
        .json({ error: "User has been already BlacListed" });
    }

    const BlackList = BlackListModel({ token });

    await BlackList.save();

    res.json({ message: "User Logged Out" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = UserRouter;
