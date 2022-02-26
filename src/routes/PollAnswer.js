import express from "express"

import { addPollAnswer, updatePollAnswer } from "../controllers/PollAnswer"
import { authenticateUser } from "../controllers/User"

const router = express.Router()

/** To dynamically add option to the existing poll */
router.route("/:pollId").post(authenticateUser, addPollAnswer)

/** To update recipient of existing polling option (i.e. For submitting a vote) */
router.route("/:pollAnswerId").put(authenticateUser, updatePollAnswer)

export { router as pollAnswerRoutes }
