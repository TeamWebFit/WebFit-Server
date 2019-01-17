/*

Fitbit Snyc for Webfit Server
Snyc a specific fitbit account

*/

//import
var express = require('express');
var router = express.Router();
const graphqlHTTP = require('express-graphql');
const schema = require('../../schema/schema');
const { graphql } = require('graphql');
const cors = require('cors');
const axios = require('axios');
let date = require('date-and-time');

// request

router.get('/sync/fitbit', function (req, res) {

  //Globale Variablen
  trackerid = req.query.trackerid;
  user = req.query.user;


  // enable graphql query
    function query(str) {
      return graphql(schema, str);
    }
  // query
  query(`
    {
      tracker(id: "${trackerid}") {
        id,
        access_token,
        token_type,
        trackerModel{
          id,
          apiLink,
          apiLinkRequest
        },
        user{
          id
        },
        lastSync,
        user_id
      }
    }
    `).then(data => {

    // Query Answer
    //Tracker-Daten kommen an
    // Nun abgleich mit API-Request Daten
      var tracker = data['data'].tracker.id // WebFit TrackerID
      var user = data['data'].tracker.user.id
      var wearhouse_userid = data['data'].tracker.user_id // FITBIT API
      var token = data['data'].tracker.access_token // Bearer Token
      var token_type = data['data'].tracker.token_type // Bearer Token
      var apiLink = data['data'].tracker.trackerModel.apiLink // e.g. api.fitbit.com
      var apiLinkRequest = data['data'].tracker.trackerModel.apiLinkRequest // e.g. api.fitbit.com
      var lastSyncDate = data['data'].tracker.lastSync

      console.log(lastSyncDate)

      console.log("==================================")
      
      if (lastSyncDate === "9999"){
        // First SYNC
       
        let now = new Date();
        var removeValue = 0;

        while (removeValue !== 1){
          let dateToSync = date.addDays(now, removeValue)
          let finalSyncDate = date.format(dateToSync, 'YYYY-MM-DD')
        
          
         // console.log(data["data"].tracker.trackerModel)
          if (apiLinkRequest === "/activities/steps/date/"){
            // console.log("Steps")
            
            var api_request_link = apiLink + wearhouse_userid + apiLinkRequest + finalSyncDate + "/1d/1min.json"
            axios.get(
    
              api_request_link,
              {
                headers: {
                  "Authorization": token_type + " " + token
                }
              }
    
            )
              .then(function (response) {
                //console.log(response.data);
                // Nun die Daten in die Datenbank schreiben
                var array_steps = response.data["activities-steps-intraday"].dataset;
               
                // var array_steps_length = array_steps.length;
                array_steps.forEach(element => {
                  if (element.value > 0){
                    var time = element.time
                    var falseDate = finalSyncDate + " " + time
                    var falseDate2 = date.parse(falseDate, 'YYYY-MM-DD HH:mm:ss')
                    var finalDate = falseDate2.getTime();
                    console.log(finalDate)
                    query(`
                    mutation{
                     createSteps(
                      time: "${finalDate}",
                      value: ${element.value},
                      trackerId: "${tracker}",
                      userId: "${user}"
                    ){
                      time
                    }
                   }
                    `).then(done => {
                      // console.log(done)
                      var datemiau = new Date();
                      var currentdate = datemiau.getTime();
                 query(`
                       mutation{
                         updateTracker(id: "${tracker}", lastSync: "${currentdate}"){id}
                          }
                     `)
                     console.log("Success")
               })


                  }

                 
                })
              })
              .catch(function (error) {
                res.send("Error #05 - Warehouse-API returned an error <br />" + error)
              })
  
          } //END IF Steps




          removeValue++;
        }
      res.send("Success")

//END IF FIRST SYNC
      }else{
        // Later Sync 
        
        var date2 = new Date();
        let now = new Date();
        var currentdate = date2.getTime();
        var syncDiff = currentdate - lastSyncDate
        var removeValue = syncDiff / 86400000
        console.log(Math.round(removeValue))

        while (removeValue !== 1){
          let dateToSync = date.addDays(now, removeValue)
          let finalSyncDate = date.format(dateToSync, 'YYYY-MM-DD')
        
          
         // console.log(data["data"].tracker.trackerModel)
          if (apiLinkRequest === "/activities/steps/date/"){
            // console.log("Steps")
            
            var api_request_link = apiLink + wearhouse_userid + apiLinkRequest + finalSyncDate + "/1d/1min.json"
            axios.get(
    
              api_request_link,
              {
                headers: {
                  "Authorization": token_type + " " + token
                }
              }
    
            )
              .then(function (response) {
                //console.log(response.data);
                // Nun die Daten in die Datenbank schreiben
                var array_steps = response.data["activities-steps-intraday"].dataset;
               
                // var array_steps_length = array_steps.length;
                array_steps.forEach(element => {
                  if (element.value > 0){
                    var time = element.time
                    var falseDate = finalSyncDate + " " + time
                    var falseDate2 = date.parse(falseDate, 'YYYY-MM-DD HH:mm:ss')
                    var finalDate = falseDate2.getTime();
                    console.log(finalDate)
                    query(`
                    mutation{
                     createSteps(
                      time: "${finalDate}",
                      value: ${element.value},
                      trackerId: "${tracker}",
                      userId: "${user}"
                    ){
                      time
                    }
                   }
                    `).then(done => {
                      // console.log(done)
                      var date3 = new Date();
                      var currentdate = date3.getTime();
                 query(`
                       mutation{
                         updateTracker(id: "${tracker}", lastSync: "${currentdate}"){id}
                          }
                     `)
                     console.log("Success")
               })


                  }

                 
                })
              })
              .catch(function (error) {
                res.send("Error #05 - Warehouse-API returned an error <br />" + error)
              })
  
          } //END IF Steps




          removeValue++;
        }
        


      }


      

















       

       
    }

  );
});

module.exports = router;
