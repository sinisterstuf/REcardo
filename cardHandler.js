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


t.getListsOnBoard(board, function(e, lists) {

  var inList
  var outList

  l(lists)

  for (var i in lists) {
    if (lists[i].name.match(/incoming/i)) {
      inList = lists[i].id
    }
    if (lists[i].name.match(/considering/i)) {
      outList = lists[i].id
    }
  }

  l("in", inList)
  l("out", outList)

  if (typeof(inList) != 'undefined' && typeof(outList) != 'undefined') {
    fillOutCard(inList, outList)
  } else {
    l("couldn't set some list, aborting")
  }

})

function fillOutCard(inList, outList) {

  t.getCardsOnList(inList, function(e, cards) {
    for (var i in cards) {
      var card = cards[i]

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
          // TODO: instead of moving the card to a list, it would be better if
          // this script would handle cards in-place in any list
          // t.updateCardList(card.id, list, logOrErr)

          // add attachment manually because Trello client doesn't support this
          request.post(
            t.uri + '/1/cards/' + card.id + '/attachments',
            {form:{
              key: t.key,
              token: t.token,
              url: house.photo
            }},
            logOrErr
          )


        })

      }
    }
  })

}
