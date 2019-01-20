/*

Google Snyc for Webfit Server
Snyc a specific google account

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

router.get('/sync/google', function (req, res) {

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
        refreshtoken,
        trackerModel{
          id,
          apiLink,
          apiLinkRequest
        },
        user{
          id
        },
        lastSync
      }
    }
    `).then(data => {

    // Query Answer
    //Tracker-Daten kommen an
    // Nun abgleich mit API-Request Daten
      var tracker = data['data'].tracker.id // WebFit TrackerID
      var user = data['data'].tracker.user.id // WebFit UserID
      // var refresh_token = data['data'].tracker.refresh_token // Refresh token
      var token_type = data['data'].tracker.token_type // Bearer Token
      var apiLink = data['data'].tracker.trackerModel.apiLink // e.g. api.fitbit.com
      var apiLinkRequest = data['data'].tracker.trackerModel.apiLinkRequest // e.g. /steps
      var lastsyncdate = data['data'].tracker.lastSync
      var refreshtoken = data['data'].tracker.refreshtoken
            // REQUEST CURRECT ACCESS_TOKEN
            // THROUGH AXIOS REFRESH_TOKEN REQUEST
            var refresh_link = apiLink + "/oauth2/v4/token"

            console.log("now refresh token with " + refresh_link)
            axios.post(
                refresh_link,
                {

                        client_id : "1008561982846-6omt5dknbiqv124o2h5g5nrgg27l7o7v.apps.googleusercontent.com",
                        client_secret : "qo4YWmhVsTn02kyIQkL-z0a0",
                        refresh_token : refreshtoken,
                        grant_type : "refresh_token"


                  }
                )
                .then(function (response) {
                    res.send("Neuer Token ist da")
                    console.log(response.data.access_token)
                    var access_token = response.data.access_token
                    var auth = token_type + " " + access_token
                    console.log("Request with " + auth)

                    // ==== EIGENTLICHER API REQUEST ==== //

                  
                    var step_request_link = apiLink + apiLinkRequest
                    var currentdate = new Date().getTime()

                     // Check if first sync
                    if (lastsyncdate === "9999"){
                      var starttime = currentdate - 1209600000
                    }else{
                      var starttime = lastsyncdate
                    }

                    const params = {
                      "aggregateBy": [{
                        "dataTypeName": "com.google.step_count.delta",
                        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                      }],
                      "bucketByTime": { "durationMillis": 60000 },
                      "startTimeMillis": starttime,
                      "endTimeMillis": currentdate
                    };

                    const params2 = {
                      "aggregateBy": [{
                        "dataTypeName": "com.google.heart_rate.summary",
                        "dataSourceId": "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm"
                      }],
                      "bucketByTime": { "durationMillis": 60000 },
                      "startTimeMillis": starttime,
                      "endTimeMillis": currentdate
                    }

                    axios.post(step_request_link, params, {
                      headers: {
                          'content-type': 'application/json',
                          'Authorization': token_type + " " + access_token
                      },
                    })
                    .then(function (response) {
                      console.log("======================")
                      // console.log(response.data)
                      var bucket = response.data.bucket

                      bucket.forEach(element => {
                        //console.log(element.dataset[0].point)
                          if (element.dataset[0].point.length === 0){

                          }else{
                            var bucket_with_steps = element.dataset[0].point[0]
                           // console.log(bucket_with_steps)
                            var bucket_start_time = bucket_with_steps.startTimeNanos
                            var bucket_end_time = bucket_with_steps.endTimeNanos
                            var steps_counter = bucket_with_steps.value[0].intVal
                            var time = Math.round(bucket_start_time / 1000000)

                            query(`
                                mutation{
                                  createSteps(
                                  time: "${time}",
                                  value: ${steps_counter},
                                  trackerId: "${tracker}",
                                  userId: "${user}"
                                ){
                                  time
                                }
                                }
                                `)

                            console.log(steps_counter)
                          }
                      })
                    })
                    .catch(function (error) {
                      console.log(error)
                      res.send("Error #05 - Warehouse-API returned an error <br />" + error)
                    })

             //Heart Rate

             axios.post(step_request_link, params2, {
              headers: {
                  'content-type': 'application/json',
                  'Authorization': token_type + " " + access_token
              },
            })
            .then(function (response) {
              console.log("========== Heart Rate ============")
              //console.log(response.data)
              var heartrate = response.data.bucket

              heartrate.forEach(rate => {
                //console.log(element.dataset[0].point)
                  if (rate.dataset[0].point.length === 0){

                  }else{
                    var bucket_with_rate = rate.dataset[0].point[0]
                   //console.log(bucket_with_rate)
                    var bucket_start_time_rate = bucket_with_rate.startTimeNanos
                    var bucket_end_time = bucket_with_rate.endTimeNanos
                    var rate_counter = bucket_with_rate.value[0].fpVal
                    var time_rate = Math.round(bucket_start_time_rate / 1000000)
                    console.log(time_rate + " " + rate_counter + " " + tracker + user)

                    query(`
                        mutation{
                          createHeartRate(
                          time: "${time_rate}",
                          value: ${rate_counter},
                          trackerId: "${tracker}",
                          userId: "${user}"
                        ){
                          time
                        }
                        }
                        `).then(done => {
                          console.log("Hat funktioniert")
                          console.log(done)
                      query(`
                            mutation{
                              updateTracker(id: "${tracker}", lastSync: "${currentdate}"){id}
                              }
                          `)
                    }).catch(error => {
                      console.log(error)
                    })

                    console.log(rate_counter)
                  }
              })
            })
            .catch(function (error) {
              console.log(error)
              res.send("Error #05 - Warehouse-API returned an error <br />" + error)
            })


                  

                    // ==== EIGENTLICHER API REQUEST ENDE ==== //

                })
                .catch(function (error) {
                    console.log(error)
                    res.send("Error #05 - Warehouse-API returned an error <br />" + error)
                  })
  }

  );
});

module.exports = router;
