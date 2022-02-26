import "colors"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { globalErrorHandler } from "./utils/GlobalErrorHandler"

// Routes
import { userRoutes } from "./routes/User"
import { pollAnswerRoutes } from "./routes/PollAnswer"
import { pollRoutes } from "./routes/Poll"

const app = express()

app.use(cors())

// load env variables
dotenv.config()

// see mongoose queries in log
mongoose.set("debug", true)

// connect to mongodb
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB Connected".green.bold)
    })
    .catch((err) => {
        console.log(`${err}`.red)
    })

// parse application/json
app.use(express.json())

// routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/poll", pollRoutes)
app.use("/api/v1/PollAnswer", pollAnswerRoutes)

// Global error handler
app.use(globalErrorHandler)

export default app
