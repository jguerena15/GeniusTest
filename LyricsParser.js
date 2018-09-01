
class LyricsParser {

  static getArrayOfWords(lyrics) {
    const formattedLyrics = lyrics.replace(/’/g, '').replace(/'/g, '').toLowerCase();
    return formattedLyrics.match(/[A-Za-z]+/g);
  }

}

module.exports = LyricsParser;
