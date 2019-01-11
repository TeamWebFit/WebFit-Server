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



          // Sync ist erlaubt
          // hier folgt der Warehouse Request

          var api_request_link = apiLink + wearhouse_userid + apiLinkRequest

        axios.get(

          api_request_link,
          {
            headers: {
              "Authorization": token_type + " " + token
            }
          }

        )
          .then(function (response) {
            var currentdate = new Date().getTime()
            //console.log(response.data);
            // Nun die Daten in die Datenbank schreiben
            var array_steps = response.data["activities-steps"];
            // var array_steps_length = array_steps.length;
            array_steps.forEach(element => {
              query(`
                   mutation{
                    createSteps(
                     time: "${element.dateTime}",
                     value: "${element.value}",
                     trackerId: "${tracker}",
                     userId: "${user}"
                   ){
                     time
                   }
                  }
                   `).then(done => {
                query(`
                      mutation{
                        updateTracker(id: "${tracker}", lastSync: "${currentdate}"){id}
                         }
                    `)
              })
            })
            console.log("Success")
            res.send("Success")
          })
          .catch(function (error) {
            res.send("Error #05 - Warehouse-API returned an error <br />" + error)
          })



  }

  );
});

module.exports = router;
