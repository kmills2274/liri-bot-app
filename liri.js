require("dotenv").config();

var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var Spotify = require("node-spotify-api");
var keys = require("./keys.js");

var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");


switch (command) {
    case "concert-this":
        concertThis(userInput);
        break;
    case "spotify-this-song":
        spotifyThis(userInput);
        break;
    case "movie-this":
        movieThis(userInput);
        break;
    case "do-what-it-says":
        doIt();
        break;
    default:
        console.log("Try again and enter a command");
};

function concertThis(userInput) {
    fs.appendFile("./log.txt", "\n" + "User Command: node liri.js concert-this " + userInput + "\n", function(error) {
		if (error) {
            return console.log(error);
        }
    });
 
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp").then(
        function (response) {
        
            console.log("--------------- Bands In Town Info ---------------");
            fs.appendFile("./log.txt", "--------------- Bands In Town Info ---------------" + "\n", function(error) {
                if (error) {
                    return console.log(error);
                }
            });
            for (var i = 0; i < response.data.length; i++) {
          
                console.log("Venue #" + [i + 1] + ": " + response.data[i].venue.name);
         
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
            
                console.log("Date: " + moment(response.data[i].datetime, "").format("MM/DD/YYYY"));
                fs.appendFile("./log.txt", "Venue #" + [i + 1] + ": " + response.data[i].venue.name + "\n"
                + "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country + "\n"
                + "Date: " + moment(response.data[i].datetime, "").format("MM/DD/YYYY") + "\n"
                , function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
           
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                fs.appendFile("./log.txt", error.response.data + "\n"
                + error.response.status + "\n"
                + error.response.headers + "\n"
                , function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            } else if (error.request) {
      
                console.log(error.request);
                fs.appendFile("./log.txt", error.request + "\n", function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            } else {
         
                console.log("Error, ", error.message);
                fs.appendFile("./log.txt", "Error, " + error.message + "\n", function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
            console.log(error.config);
            fs.appendFile("./log.txt", error.config + "\n", function(error) {
                if (error) {
                    return console.log(error);
                }
            });
        });
}

function spotifyThis(userInput) {
    fs.appendFile("./log.txt", "\n" + "User Command: node liri.js spotify-this-song " + userInput + "\n", function(error) {
		if (error) {
            return console.log(error);
        }
    });

    // * If no song is provided then your program will default to "The Sign" by Ace of Base.
    var spotify = new Spotify(keys.spotify);
    if (!userInput) {
        userInput = "The Sign Ace of Base";
    }
    spotify.search({ type: 'track', query: userInput }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

      
        var songInfo = data.tracks.items[0];
        
        console.log("--------------- Spotify Song Info ---------------");
        console.log("Artist(s): " + songInfo.artists[0].name);
        console.log("Song Name: " + songInfo.name);
        console.log("Preview Link: " + songInfo.preview_url);
        console.log("Album: " + songInfo.album.name);
        fs.appendFile("./log.txt", "--------------- Spotify Song Info ---------------" + "\n"
        + "Artist(s): " + songInfo.artists[0].name + "\n"
        + "Song Name: " + songInfo.name + "\n"
        + "Preview Link: " + songInfo.preview_url + "\n"
        + "Album: " + songInfo.album.name + "\n"
        , function(error) {
            if (error) {
                return console.log(error);
            }
        });
    });
}

function movieThis(userInput) {
    fs.appendFile("./log.txt", "\n" + "User Command: node liri.js movie-this " + userInput + "\n", function(error) {
		if (error) {
            return console.log(error);
        }
    });
    //  * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (!userInput) {
        userInput = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
        fs.appendFile("./log.txt", "If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>\n" + "It's on Netflix!\n", function(error) {
            if (error) {
                return console.log(error);
            }
        });
    }
 
    axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
           
            console.log("--------------- OMDB Movie Info ---------------");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            fs.appendFile("./log.txt", "--------------- OMDB Movie Info ---------------" + "\n"
            + "Title: " + response.data.Title + "\n"
            + "Release Year: " + response.data.Year + "\n"
            + "IMDB Rating: " + response.data.imdbRating + "\n"
            + "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n"
            + "Country: " + response.data.Country + "\n"
            + "Language: " + response.data.Language + "\n"
            + "Plot: " + response.data.Plot + "\n"
            + "Actors: " + response.data.Actors + "\n"
            , function(error) {
                if (error) {
                    return console.log(error);
                }
            });
        })
        .catch(function (error) {
            if (error.response) {
              
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                fs.appendFile("./log.txt", error.response.data + "\n"
                + error.response.status + "\n"
                + error.response.headers + "\n"
                , function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            } else if (error.request) {
                
                console.log(error.request);
                fs.appendFile("./log.txt", error.request + "\n", function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            } else {
                
                console.log("Error, ", error.message);
                fs.appendFile("./log.txt", "Error, " + error.message + "\n", function(error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
            console.log(error.config);
            fs.appendFile("./log.txt", error.config + "\n", function(error) {
                if (error) {
                    return console.log(error);
                }
            });
        });
}

function doIt(userInput) {
    //  * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
    fs.appendFile("./log.txt", "\n" + "User Command: node liri.js do-what-it-says " + "\n", function(error) {
		if (error) {
            return console.log(error);
        }
    });
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        
        var dataArr = data.split(",");

        userInput = dataArr[1].slice(1);

        if (dataArr[0] === "concert-this") {
            concertThis(userInput);
        }
        else if (dataArr[0] === "spotify-this-song") {
            spotifyThis(userInput);
        }
        else if (dataArr[0] === "movie-this") {
            movieThis(userInput);
        }
    });
};

