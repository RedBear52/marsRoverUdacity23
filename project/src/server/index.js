require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const Immutable = require('immutable');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API Calls fetching rover manifest data and photo data
// paramaterized routes to dynamically respond to user's rover selection
app.get('/manifest/:rovername', async (req, res) => {
    try {
        const roverName = req.params.rovername
        const manifestInfo = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=${process.env.API_KEY}`
        ).then(res => res.json())
        res.send({ manifestInfo })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/roverPicData/:rovername', async (req, res) => {
    try {
        const roverName = req.params.rovername
        let roverPicData = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`
        ).then(res => res.json())
        res.send({ roverPicData })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))