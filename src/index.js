import app from './App'

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`server started @ ${PORT}`)
})
