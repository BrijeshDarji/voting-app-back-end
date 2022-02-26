import { Types } from "mongoose"

import Poll from "../models/Poll"
import PollAnswer from "../models/PollAnswer"

import { asyncMiddleware } from "../utils/AsyncMiddleware"
import { ErrorResponse } from "../utils/GlobalErrorHandler"

export const addPollAnswer = asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id
    const pollId = req.params.pollId

    const poll = await Poll.findOne({ _id: pollId })

    if (!userId) {
        return next(
            new ErrorResponse("Login session expired or user don't exists", 401)
        )
    }

    if (!poll) {
        return next(new ErrorResponse("Poll not found", 404))
    }

    const pollAnswer = await PollAnswer.create({
        poll: Types.ObjectId(poll.id),
        option: req.body.option,
    })

    res.status(201).json({
        success: true,
        data: pollAnswer,
    })
})

export const updatePollAnswer = asyncMiddleware(async (req, res, next) => {
    const voterId = req.user._id
    const pollAnswerId = req.params.pollAnswerId

    let pollAnswer = await PollAnswer.findById(pollAnswerId)

    if (!pollAnswer) {
        return next(
            new ErrorResponse(`No poll option of the id:${pollAnswerId} found`, 404)
        )
    }

    pollAnswer = await PollAnswer.findByIdAndUpdate(
        pollAnswerId,
        { $addToSet: { recipients: Types.ObjectId(voterId) } },
        {
            new: true,
            runValidators: true,
        }
    )

    res.status(200).json({
        success: true,
        data: pollAnswer,
    })
})
