// node liri.js concert-this twenty one pilots
// node liri.js spotify-this-song stacys mom
// node liri.js movie-this troy
// node liri.js movie-this
// node liri.js do-what-it-says

require("dotenv").config();

var keys = require("./keys.js");
var moment = require("moment")
var axios = require("axios")
var Spotify = require("node-spotify-api");
var fs = require("fs")

var spotify = new Spotify(keys.spotify);

var typeOfRequest = process.argv[2]
var nameToSearch = ""
var URL = ""

for (i = 3; i < process.argv.length; i++) {
    nameToSearch = nameToSearch + process.argv[i] + "+"
}

nameToSearch = nameToSearch.substring(0, nameToSearch.length - 1)

// console.log("*" + nameToSearch + "*")

if (typeOfRequest == "concert-this") {
    PrintConcertInfo()
} else if (typeOfRequest == "spotify-this-song") {
    PrintSongInfo()
} else if (typeOfRequest == "movie-this") {
    PrintMovieInfo()
} else if (typeOfRequest == "do-what-it-says") {
    ReadFromTextFile()
} else {
    console.log("Improper request type. Valid request types are \"concert-this\", \"spotify-this-song\", \"movie-this\", or \"do-what-it-says\"")
    process.exit()
}


function ReadFromTextFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        var reqType = dataArr[0]
        nameToSearch = dataArr[1]

        nameToSearch = NewReplace(nameToSearch, " ", "+").trim()

        if (reqType == "concert-this") {
            PrintConcertInfo()
        } else if (reqType == "spotify-this-song") {
            PrintSongInfo()
        } else if (reqType == "movie-this") {
            PrintMovieInfo()
        } else {
            console.log("Invalid request type in text file.")
        }
    });
}



function PrintSongInfo() {
    
    var myLimit = 1

    // spotify responses are too annoying to search, sorry ):
    //
    // if (nameToSearch == ""){
    //     nameToSearch = "The Sign"
    //     myLimit = 5
    // }
    
    spotify.search({ type: "track", query: nameToSearch, limit: myLimit }, function (error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log("Artists: " + data.tracks.items[0].artists[0].name)
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    })
}


function PrintConcertInfo() {
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


function PrintMovieInfo() {
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