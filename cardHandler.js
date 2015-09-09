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

/*
 * Add attachment manually because Trello client doesn't support this
 * TODO: ideally this sould be inside the Trello prototype
 *
 * @cardId Trello card to receive attachment
 * @url web URL to photo/file to attach
 */
function addAttachment(cardId, url) {
  request.post(
    t.uri + '/1/cards/' + cardId + '/attachments',
    {form:{
      key: t.key,
      token: t.token,
      url: url
    }},
    logOrErr // TODO this gives way too much output
  )
}

t.getListsOnBoard(board, function(e, lists) {

  if (e) {
    l('error:', e)
    return 1
  }

  if (typeof(lists) == 'string') {
    l('could not get lists for board')
    return 2
  }

  l('lists', lists)

  lists.forEach(function(list) {
    findCards(list)
  })

})

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

    l('cards', cards)

    cards.forEach(function(card) {

      if (card.name.match(/#[0-9]+/)) {
        // l(card)

        houseId = (card.name.match(/#[0-9]+/)[0]).substring(1)
        l(houseId)

        ingatlan.scrape(houseId, function(e, house) {
          l(house)

          // swap the #12345 for useful metadata
          var name = card.name.replace(/#[0-9]+/, house.name)

          // actually update the card info
          t.updateCardName(card.id, name, logOrErr)
          t.updateCardDescription(card.id, house.desc, logOrErr)
          addAttachment(card.id, house.photo)

        })

      }
    })
  })

}
