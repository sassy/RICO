var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
      title: "Rico: WebRTC conference service",
      api_key : process.env.SKYWAY_API_KEY,
  });
});

module.exports = router;
