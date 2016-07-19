// TODO: someday it'd be good to refactor this:
module.exports.main = actuallyDoTheStuff

var Trello = require('trello')
var ingatlan = require('./ingatlan.js')
var request = require('request')

// I am so lazy lol
l = console.log

// read credentials from environment and get access
key = process.env.TRELLO_KEY
token = process.env.TRELLO_TOKEN
board = process.env.TRELLO_BOARD
var t = new Trello(key, token)
l(t)

function logOrErr(e, x) {
  if (e) {
    l(e)
  } else {
    l(x)
  }
}

function actuallyDoTheStuff() {
  t.getListsOnBoard(board, function(e, lists) {

    if (e) {
      l('error:', e)
      return 1
    }

    if (typeof(lists) == 'string') {
      l('could not get lists for board')
      return 2
    }

    lists.forEach(function(list) {
      findCards(list)
    })

  })
}

function findCards(list) {

  t.getCardsOnList(list.id, function(e, cards) {

    if (e) {
      l('error:', e)
      return 1
    }

    if (typeof(cards) == 'string') {
      l('could not get cards for list')
      return 2
    }

    cards.forEach(function(card) {

      if (card.name.match(/[0-9]{8,}/)) {

        houseId = card.name.match(/[0-9]{8,}/)[0]
        l(houseId)

        l('scraping:', houseId)
        ingatlan.scrape(houseId, function(e, house) {
          l(house)

          // swap the #12345 for useful metadata
          var name = card.name.replace(/[0-9]{8,}/, house.name)

          // actually update the card info
          t.updateCardName(card.id, name, logOrErr)
          t.updateCardDescription(card.id, house.desc, logOrErr)
          t.addAttachmentToCard(card.id, house.photo, logOrErr)

        })

      }
    })
  })

}
