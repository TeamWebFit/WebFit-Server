var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.send('Hello World!');
});


var syncall = require('./trackermanager/syncall');
applicationCache.use('/syncall', syncall)

module.exports = router;