var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('REcardo')
})

app.listen(app.get('port'), function() {
    console.log('REcardo is running on port', app.get('port'));
});
