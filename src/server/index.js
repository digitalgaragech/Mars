require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

app.get('/rovers', async (req, res) => {
    try {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`
        let rovers = await fetch(url)
        rovers = await rovers.json();
        res.send(rovers)
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/apod/:roverName', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName}/photos?sol=1000&api_key=${process.env.API_KEY}`)

            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);  
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))