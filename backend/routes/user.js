const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/profile', function(req, res, next) {
    res.send(req.user);
});

module.exports = router;