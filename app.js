require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (req, res) => {
    res.render("home-page")
})

app.get("/artist-search-result", (req, res) => {
    const { artist_search } = req.query

    spotifyApi
        .searchArtists(artist_search, { select: 1 })

        .then(data => {
            console.log(data.body)
            res.render("artist-search-result", {
                artist: data.body.artists.items[0].name,
                artist_img: data.body.artists.items[0].images[0].url,
                artist_id: data.body.artists.items[0].id
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/album/:id", (req, res) => {
    const { id } = req.params
    console.log(req.params)
    spotifyApi
        .getArtistAlbums(id)

        .then(data => {
            console.log(data.body.items)
            res.render("album", { album: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get("/tracks/:id", (req, res) => {
    const { id } = req.params
    console.log(req.params)
    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            res.render("tracks", { tracks: data.body.items })
            // res.send(data.body.items[1].preview_url)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})











app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
