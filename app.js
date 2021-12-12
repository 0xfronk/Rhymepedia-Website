const express = require("express")
const axios = require("axios")
const app = express()
const lyrics_api = require("genius-lyrics-api")
const cors = require("cors")
const e = require("express")
const PORT = process.env.PORT || 3000
const nq_converter = require("node-quill-converter")
const qs = require("qs")
const https = require("https")
require("dotenv").config()

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
axios.create({
    httpsAgent: new https.Agent({keepAlive: true}),
});


app.get("/", (req, res) => {
    res.render("index", {data: []})
})

app.post("/", async (req, res) => {
    const search_input = req.body.search_input
    const results = await axios.get(encodeURI(`https://rhymepedia-api.herokuapp.com/api/song/${search_input}`))
    const data = results.data
    res.render("index", {data: data
      })
})

app.get("/view/:title/:artist", async (req, res) => {
    const title = (req.params.title)
    const artist = (req.params.artist)
    const result = await axios.get(encodeURI(`https://rhymepedia-api.herokuapp.com/api/song/${title}/${artist}`))
    if (result.data.status === 0){
        return res.render("view", {
            content: "No one has annotated the lyrics of this song. Be the first!",
            title: title,
            artist: artist,
            status: 0
        })
    }
    else{
        const song = result.data.song[0]
        return res.render("view", {
            title: song.title,
            artist: song.artist,
            lyrics: song.lyrics,
            status: 1
        })

    }
})

app.get("/create/:title/:artist", async (req, res) => {
    const title = (req.params.title)
    const artist = (req.params.artist)
    const result = await axios.get(encodeURI(`https://rhymepedia-api.herokuapp.com/api/song/${title}/${artist}`))
    if (result.data.status === 0){
        const options = {
        apiKey: process.env.TOKEN,
        title: req.params.title,
        artist: req.params.artist,
        optimizeQuery: true}
        try{
            const lyrics = await lyrics_api.getSong(options)
            res.render("create", {
                title: title,
                artist: artist,
                lyrics: JSON.stringify(nq_converter.convertTextToDelta(lyrics.lyrics).ops)
            })
        }
        catch(error){
            console.log(error)
        }
    }
    else{
        const song = result.data.song[0]
        console.log(song.lyrics)
        return res.render("create", {
            title: song.title,
            artist: song.artist,
            lyrics: song.lyrics,
            status: 1
        })
    }


})

app.post("/create/:title/:artist", async (req, res) => {
    const title = req.params.title
    const artist = req.params.artist
    const lyrics = req.body.lyrics
    const lyrics_text = req.body.lyrics_text
    const data =         {
        "title": title,
        "artist": artist,
        "lyrics": lyrics,
        "lyrics_text": lyrics_text
    }
    console.log(data)
    axios.post("https://rhymepedia-api.herokuapp.com/api/song/api/create", data)
    .then((res) => console.log(res))
    .catch(err => console.log(err))
})


app.listen(PORT, console.log(`Listening on port ${PORT}`))