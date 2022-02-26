import mongoose from "mongoose"

const pollAnswerSchema = new mongoose.Schema(
    {
        poll: {
            type: mongoose.Schema.ObjectId,
            ref: "Poll",
            required: [true, "Poll id needed"],
        },
        recipients: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
        option: {
            type: String,
            default: "Default option value"
        },
        created: {
            type: Date,
            default: Date.now,
        },
        updated: {
            type: Date
        },
    },
    {
        strict: false
    }
)

module.exports = mongoose.model("PollAnswer", pollAnswerSchema)
