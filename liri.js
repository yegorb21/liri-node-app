require("dotenv").config();

var keys = require("./keys.js");
var moment = require("moment")
var axios = require("axios")
var Spotify = require("node-spotify-api");
var fs = require("fs")

var spotify = new Spotify(keys.spotify);

// commands
// * `concert-this`
// 1. `node liri.js concert-this <artist/band name here>`


// * `spotify-this-song`
// 2. `node liri.js spotify-this-song '<song name here>'`


// * `movie-this`
// 3. `node liri.js movie-this '<movie name here>'`


// * `do-what-it-says`
// 4. `node liri.js do-what-it-says`

var typeOfRequest = process.argv[2]
var nameToSearch = ""
var URL = ""

for (i = 3; i < process.argv.length; i++) {
    nameToSearch = nameToSearch + process.argv[i] + "+"
}

nameToSearch = nameToSearch.substring(0, nameToSearch.length - 1)

console.log("*" + nameToSearch + "*")

if (typeOfRequest == "concert-this") {
    printConcertInfo()
} else if (typeOfRequest == "spotify-this-song") {

} else if (typeOfRequest == "movie-this") {
    printMovieInfo()
} else if (typeOfRequest == "do-what-it-says") {

} else {
    console.log("Improper request type. Valid request types are \"concert-this\", \"spotify-this-song\", \"movie-this\", or \"do-what-it-says\"")
    process.exit()
}

console.log(URL)

function printConcertInfo() {
    var eventNum = 1
    URL = "https://rest.bandsintown.com/artists/" + nameToSearch + "/events?app_id=codingbootcamp"

    axios.get(URL).then(function (response) {
        response.data.forEach(function (entry) {
            console.log("Event #" + eventNum)
            console.log("Venue Name: " + entry.venue.name);
            console.log("Venue Location: " + entry.venue.country);
            console.log("Venue Date (MM/DD/YYYY format): " + moment(entry.datetime).format("MM/DD/YYYY"));
            console.log("\n")
            eventNum++
        })
    })
}

function printMovieInfo() {
    if (nameToSearch == "") {
        nameToSearch = "Mr. Nobody"
    }
    URL = "http://www.omdbapi.com/?t=" + nameToSearch + "&apikey=trilogy"

    axios.get(URL).then(
        function (response) {
            if (typeof response.data.Title !== 'undefined') {
                console.log("Title: " + response.data.Title)
                console.log("Year: " + response.data.Year)
                console.log("IMDB Rating: " + response.data.imdbRating)
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
                console.log("Country: " + response.data.Country)
                console.log("Language: " + response.data.Language)
                console.log("Plot: " + response.data.Plot)
                console.log("Actors: " + response.data.Actors)
            } else {
                nameToSearch = NewReplace(nameToSearch, "+", " ")
                console.log("Couldnt find the movie \"" + nameToSearch + "\", try again.")
            }
        }
    )
}

function NewReplace(string, replace, replaceWith) {
    return string.split(replace).join(replaceWith)
}



