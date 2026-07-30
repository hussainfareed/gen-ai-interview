const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


/**
 * @route post /api/auth/register
 * @decription register a new user
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route post /api/auth/login
 * @decription login user with email and password
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @name get /api/auth/logout
 * @decription clear token from user cookie and the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @name GET /api/auth/get-me
 * @decription get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;