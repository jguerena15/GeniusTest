const SearchRequest = require('./SearchRequest');
const LyricsParser = require('./LyricsParser');
const arrayToTxtFile = require('array-to-txt-file')
const artist = "Julien Baker";
const fileName = "Baker";

SearchRequest.getArtistID(artist, (artistID) => {
  if (!artistID) {
    console.log("Error searching for results");
    return
  }
  var words = [];
  var i = 0;
  SearchRequest.getSongIDsFromArtistID(artistID, (songIDs) => {
    if (songIDs.length == 0) {
      console.log("No Songs Found");
      return;
    }

    function callBack(lyrics) {
      console.log(i);
      const formattedLyrics = lyrics.replace(/’/g, '').replace(/'/g, '').toLowerCase();

      if (formattedLyrics !== null && formattedLyrics !== undefined && formattedLyrics.length != 0) {
        words.push(...formattedLyrics.match(/[A-Za-z]+/g));
      } else {
        console.log("Empty lyrics");
      }
      i++;
      if (i < songIDs.length - 1) {
        SearchRequest.getLyricsFromSongID(songIDs[i].id, callBack);
      } else {
        var unique = words.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });
        unique.sort();
        console.log(unique);
        console.log(unique.length);
        console.log(words.length);
        arrayToTxtFile(unique, `./${fileName}-unique-words.txt`, (err) => {
          if (err) {
            console.log(err);
            return
          }
          console.log("Done");
        });
      }
    }

    SearchRequest.getLyricsFromSongID(songIDs[i].id, callBack);
  });
  console.log(artistID);
});
