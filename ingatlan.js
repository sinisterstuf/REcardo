var request = require('request')
var cheerio = require('cheerio')

module.exports.scrape = scrape

function scrape(id, callback) {

  var uri = "http://ingatlan.com/" + id

  request({ uri: uri }, function(error, response, body) {
    try {
      var $ = cheerio.load(body)
    } catch(e) {
      console.log(e) // XXX: LOL DON'T CARE
      return e
    }

    // this is just to make `name`'s construction more readable
    var price = $('.parameter-price .parameter-value').text()
    var size = $('.parameter-area-size .parameter-value').text()
    var rooms = $('.parameter-room .parameter-value').text()

    // construct card name from metadata
    var name = price + " " + size + " / " + rooms

    // "comment text" with link prepended for card description
    var desc = uri + "\n\n" + $('#commentText').text() +
      "\n\n" + desc

    // first photo's URL for attachment
    var photo = $('#details-box-pictures .highslide-pic.big-index img')
      .attr('src')

    // call back with data
    if (error) {
      callback(error)
    } else {
      callback(null, {
        name: name,
        desc: desc,
        photo: photo
      })
    }

  })
}
