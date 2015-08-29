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

    // get metadata for name
    var data = []
    var raw = $('.importantInformations .importantInformation')
    raw.each(function() {
      data.push($(this).text().match(/[0-9.]+/)[0])
    })

    // this is just to make `name`'s construction more readable
    var price = data[0]
    var inner_size = data[1]
    var outer_size = data[2]
    var rooms = data[3]

    // construct card name from metadata
    var name = price + "M " + inner_size + "+" + outer_size + "m² /" + rooms

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
