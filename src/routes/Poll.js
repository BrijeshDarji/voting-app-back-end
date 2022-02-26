import express from "express"

import {
    addPoll,
    deletePollBySignedInUser,
    getPollById,
    getPollList,
} from "../controllers/Poll"
import { authenticateUser } from "../controllers/User"

const router = express.Router()

router
    .route("/")
    .get(authenticateUser, getPollList)
    .post(authenticateUser, addPoll)

router
    .route("/:pollId")
    .get(authenticateUser, getPollById)
    .delete(authenticateUser, deletePollBySignedInUser)

export { router as pollRoutes }
