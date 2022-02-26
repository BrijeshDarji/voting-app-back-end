import jwt from "jsonwebtoken"
import { promisify } from "util"

import User from "../models/User"

import { asyncMiddleware } from "../utils/AsyncMiddleware"
import { generateUserToken } from "../utils/GenerateToken"
import { ErrorResponse } from "../utils/GlobalErrorHandler"

export const signUpUser = asyncMiddleware(async (req, res) => {
    const newUser = await User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        password_confirm: req.body.password_confirm,
    })

    res.status(200).json({
        success: true,
        data: {
            user: newUser,
        },
    })
})

export const signInUser = asyncMiddleware(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorResponse("Enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.correctPassword(user.password, password))) {
        return next(new ErrorResponse("Invalid email or password", 401))
    }

    const token = await generateUserToken(user._id)

    return res.status(200).json({
        success: true,
        data: { token },
    })
})

export const authenticateUser = asyncMiddleware(async (req, res, next) => {
    // Check authToken is provided in header
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return next(new ErrorResponse("You're not logged in, please login", 401))
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET)

    // Check user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new ErrorResponse("Token expired or user doesn't exists", 401))
    }

    // Check password is changes after
    if (currentUser.isPasswordChangedAfterSignIn(decoded.iat)) {
        return next(
            new ErrorResponse("You've changed password, Enter latest password", 401)
        )
    }

    req.user = currentUser

    next()
})
