/*

Samsung Snyc for Webfit Server
Demo Only

*/

//import
var express = require('express');
var router = express.Router();
const graphqlHTTP = require('express-graphql');
const schema = require('../../schema/schema');
const { graphql } = require('graphql');
const cors = require('cors');
const axios = require('axios');
// let date = require('date-and-time');
// request


router.get('/sync/samsung', function (req, res) {

      //Globale Variablen
        trackerid = req.query.trackerid;
        user = req.query.user;

  // enable graphql query
    function query(str) {
      return graphql(schema, str);
    }


    function generateSteps(t, currentms){
       var syncdate = currentms - t

       while (syncdate <= currentms){
        // console.log(syncdate + " // " + currentms)
           syncdate2 = new Date(syncdate)
           getHour = syncdate2.getHours()
           if (getHour <= 23 && getHour >= 7){
            var step = Math.floor(Math.random() * 25) + 1; 
            var chance = Math.floor(Math.random()* 4);
           
            if (chance === 0){
                query(`
                mutation{
                 createSteps(
                  time: "${syncdate}",
                  value: ${step},
                  trackerId: "${trackerid}",
                  userId: "${user}"
                ){
                  time
                }
               }
                `).then(done => {
               console.log("Step eingetragen")
              })
            }
           }

           syncdate = syncdate + 60000

       }
    }

    
    function generateHeart(t, currentms){
       var syncdate = currentms - t
       while (syncdate <= currentms){
          // console.log(syncdate + " // " + currentms)
           syncdate2 = new Date(syncdate)
           getHour = syncdate2.getHours()
           if (getHour <= 23 && getHour >= 7){
            var heart = Math.floor(Math.random() * 60) + 60; 
            var chance = Math.floor(Math.random()* 4);
            if (chance === 0){
                
                query(`
                mutation{
                 createHeartRate(
                  time: "${syncdate}",
                  value: ${heart},
                  trackerId: "${trackerid}",
                  userId: "${user}"
                ){
                  time
                }
               }
                `).then(done => {
                console.log("Heart eingetragen")
              })
            }
           }

           syncdate = syncdate + 60000

       }
       
    }

    function final() {
            var now = new Date();
            var currentdate = now.getTime();
          query(`
            mutation{
            updateTracker(id: "${trackerid}", lastSync: "${currentdate}"){id}
            }
        `).then(res.send("Done"))

    }

    // GET STARTED HERE
    query(`
    {
      tracker(id: "${trackerid}") {
        id,
        lastSync
      }
    }
    `).then(data => {
        var current = new Date();
        var currentms = current.getTime();
        var lastSync = data.data.tracker.lastSync
        if (lastSync === "9999"){
            console.log("Erster Sync")
            var t = 604800000
            //var t = 86400000
            generateSteps(t, currentms)
            generateHeart(t, currentms)
            final()
            
        }else{
            console.log("Späterer Sync")
            var t = currentms - lastSync
            generateSteps(t, currentms)
            generateHeart(t, currentms)
            final();
        }
    })
});

module.exports = router;