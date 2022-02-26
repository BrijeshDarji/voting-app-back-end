import express from "express"
import { signUpUser, signInUser } from "../controllers/User"

const router = express.Router()

router.post("/signup", signUpUser)
router.post("/signin", signInUser)

export { router as userRoutes }
