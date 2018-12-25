var express = require('express');
var router = express.Router();
/*GraphQL*/
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const {graphql} = require('graphql');
const cors = require('cors');

/*Axios*/
const axios = require('axios');

router.get('/syncall', function(req, res){

     //Check is request is authorised
  var tooken = req.query.tooken
  if (tooken === "4vtDFA9pjo@aevervj§§röS!2Sfda342346rAFDafkdlfa$"){
  // Abfrage aller Tracker  
    console.log("=======================")
    console.log("Complete Sync Tracker Triggerd")
    console.log("=======================")
    function query (str) {
      return graphql(schema, str);
    }
    query(`
    {
      allTrackers {
        id
        user {
          id
        }
      }
    }

  `).then(data => {
    var alltracker = data.data.allTrackers
    var synctracker = 0;
    alltracker.forEach(element => {
      var request = "http://projekt-webfit.de:4009/sync?user="+ element.user.id + "&trackerid=" + element.id
      axios.get(request).then(function(response){
        console.log(element.id + " // " +response.data)
        if (response.data === "Success"){
          synctracker = synctracker + 1
        }
      }
      )
    })
    res.send("Tracker werden gesynct")
    

  })

  // Falls kein Tooken mit übergeben wird  
  }else{
    res.send('Keine Berechtigung')
  }

});

module.exports = router;