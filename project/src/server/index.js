require('dotenv').config()
import express, { static } from 'express'
import { urlencoded, json } from 'body-parser'
import fetch from 'node-fetch'
import { join } from 'path'
const app = express()
const port = 8000

app.use(urlencoded({ extended: false }))
app.use(json())

app.use('/', static(join(__dirname, '../public')))

// API Calls fetching rover manifest data and photo data
// incorporaties routes to dynamically respond to user's rover selection
app.get('/manifest/:rovername', async (req, res) => {
    try {
        const roverName = req.params.rovername
        const manifestInfo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ manifestInfo })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/roverPicData/:rovername', async (req, res) => {
    try {
        const roverName = req.params.rovername
        const roverPicData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ roverPicData })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))