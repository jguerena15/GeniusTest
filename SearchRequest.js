const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const base_url = "http://api.genius.com";
const token = '25Yu1cwlZkZ3pODJ3QikOtYFaSXt2UdZ4XQ8xWadXJPHzvcs4RSGNGxwl7MYQ8Fp';

class SearchRequest {

  static getLyricsFromSongID(id, fn) {
    const search_url = base_url + `/songs/${id}`
    var options = {
      url: search_url
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var url = info.response.song.url;
        var page = request.get(url, (error, response, body) => {
          const dom = new JSDOM(body);
          fn(dom.window.document.querySelector("p").textContent);
        });
      } else {
        fn(null);
      }
    }

    request.get(options, callback).auth(null, null, true, token);
  }

  static getSongIDsFromArtistID(id, fn) {
    const search_url = base_url + `/artists/${id}/songs`;
    var currentPage = 1;
    var options = {
      url: search_url,
      qs: { page: currentPage }
    };
    var songs = [];
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if (info.response.songs) {
          songs.push(...info.response.songs);
        }
        if (info.response.next_page !== null) {
          currentPage += 1;
          options = {
            url: search_url,
            qs: { page: currentPage }
          };
          request.get(options, callback).auth(null, null, true, token);
        } else {
          fn(songs);
        }
      } else {
        fn(songs);
      }
    }
    request.get(options, callback).auth(null, null, true, token);
  }

  static getArtistID(artist, fn) {
    const search_url = base_url + "/search";
    var options = {
      url: search_url,
      qs: { q: artist }
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        for (var i = 0; i < info.response.hits.length; i++) {
          if (info.response.hits[i].result.primary_artist.name === artist) {
            fn(info.response.hits[i].result.primary_artist.id);
            return;
          }
        }
        fn(null);
      } else {
        fn(null);
      }
    }

    request.get(options, callback).auth(null, null, true, token);
  }

}
module.exports = SearchRequest;
