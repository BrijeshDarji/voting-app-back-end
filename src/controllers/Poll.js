import "colors"
import { Types } from "mongoose"

import Poll from "../models/Poll"
import PollAnswer from "../models/PollAnswer"

import { asyncMiddleware } from "../utils/AsyncMiddleware"
import { ErrorResponse } from "../utils/GlobalErrorHandler"
import CommonFeatures from "../utils/CommonFeatures"

export const addPoll = asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id

    if (!userId) {
        return next(
            new ErrorResponse("Login session expired or user don't exists", 401)
        )
    }

    const poll = await Poll.create({ title: req.body.title, creator: userId })

    let pollOptions = []
    if (poll && poll.id) {
        for await (const option of req.body.options) {
            const answer = await PollAnswer.create({
                poll: Types.ObjectId(poll.id),
                option,
            })
            pollOptions.push(answer)
        }
    }

    poll.set("pollOptions", pollOptions)

    res.status(201).json({
        success: true,
        data: poll,
    })
})

export const getPollById = asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id
    const pollId = req.params.pollId

    if (!userId) {
        return next(
            new ErrorResponse("Login session expired or user don't exists", 401)
        )
    }

    let pollData = await Poll.findOne({ _id: Types.ObjectId(pollId) })

    if (!pollData) {
        return next(new ErrorResponse("Poll not found", 404))
    }

    let pollOptions = await PollAnswer.find({ poll: Types.ObjectId(pollId) })
    pollData.set("pollOptions", pollOptions)

    res.status(201).json({
        success: true,
        data: pollData,
    })
})

export const getPollList = asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id

    if (!userId) {
        return next(
            new ErrorResponse("Login session expired or user don't exists", 401)
        )
    }
    const count = await Poll.count({})
    const pollsFeatures = new CommonFeatures(Poll.find(), req.query)
        .paginate()
        .sort()
    const polls = await pollsFeatures.query

    res.status(201).json({
        success: true,
        data: {
            list: polls || [],
            count
        },
    })
})

export const deletePollBySignedInUser = asyncMiddleware(
    async (req, res, next) => {
        // find the poll by id
        const pollId = req.params.pollId
        const userId = req.user._id

        const poll = await Poll.findOne({ _id: pollId })

        if (!poll && !pollId) {
            return next(new ErrorResponse("Poll not found", 404))
        }

        // Does poll belongs to currently loggedIn user?
        if (!poll.creator.equals(userId)) {
            return next(new ErrorResponse(`You're not authorized to delete poll '${poll.title}'`, 400))
        }

        // Delete the all the answers DB
        await PollAnswer.deleteMany({
            poll: poll._id,
        })

        // Delete the poll
        await poll.remove()

        res.status(200).json({
            success: true,
            data: {}
        })
    }
)
