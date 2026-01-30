import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDb from './Db/db.js'
import route from './Routes/beatRoutes.js'
import jamendoRoutes from './Routes/jamendoRoutes.js'
import playlistRoutes from './Routes/playlistRoutes.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
await connectDb()
app.use(cors())
app.use(express.json())

app.use('/api', route)
app.use('/api/jamendo', jamendoRoutes)
app.use('/api/playlist', playlistRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})