var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {

    var trello; // will contain auth stuff
    var reqs = [
        'TRELLO_KEY',
        'TRELLO_TOKEN',
        'TRELLO_BOARD'
    ]

    for(r in reqs) {
        if (process.env[reqs[r]]) {
            // save it into `trello`
        } else {
            // return an error
            res.status(500).send(reqs[r] + ' not set')
            return
        }
    }

    res.send('REcardo')

})

app.listen(app.get('port'), function() {
    console.log('REcardo is running on port', app.get('port'));
});
