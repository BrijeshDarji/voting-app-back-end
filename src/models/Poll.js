import mongoose from "mongoose"

const pollSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: 100,
            required: [true, "Please enter your title"],
        },
        creator: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Poll can't be created without creator id"],
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

module.exports = mongoose.model("Poll", pollSchema)
