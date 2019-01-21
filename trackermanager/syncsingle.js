/*

Snyc for Webfit Server

*/


// Imports
var express = require('express');
var router = express.Router();
const schema = require('../schema/schema');
const { graphql } = require('graphql');

// Exports /sync Fucntion

router.get('/sync', function (req, res) {

  //Globale Variablen
  trackerid = req.query.trackerid;
  user = req.query.user;

  // Prüfung ob alle Daten beim Request korrekt angegeben wurden
  if (trackerid == undefined || user == undefined) {
    res.send("Error #01 - Request invalid")
  } else {
    // Log eines neuen Request
    var newDate = new Date();
    var date = newDate.getDay() + "." + newDate.getMonth() + "." + newDate.getFullYear() + " / " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds()
    console.log("=============")
    console.log("Neuer API-Sync-Request: " + date)
    console.log("Tracker: " + trackerid + " // " + "User: " + user)

    // Abfrage der userID durch den Tracker von der Datenbank
    // Anschließend überprüfung ob erhaltene Daten mit angegeneben Daten übereinstimmen
    function query(str) {
      return graphql(schema, str);
    }
    query(`
            {
              tracker(id: "${trackerid}") {
                id,
                lastSync,
                trackerModel{
                  id
                },
                user{
                  id
                }
              }
            }
            `).then(data => {

              // Variablen aus Query-Request
              var dbuser = data['data'].tracker.user.id // WebFit UserID
              var lastSync = data['data'].tracker.lastSync // time in ms
              var trackerModel = data['data'].tracker.trackerModel.id // ModellID
              
              // Check ob Tracker exsistiert
              if (data['data'].tracker == null) {
                  res.send("Error #04 - Not found")
                } else {
            
             // Check ob Nutzer zum Sync berechtigt ist
                    if (dbuser === user) {

              // Abgleich der TTL
                        var currentdate = new Date().getTime()
                        var time_diff = currentdate - lastSync
                        var sync = Math.abs(time_diff)
                        if (sync > 300000) {
                              // #############################################################
                              // Zugriff erlaubt / Tracker vorhanden // TTL okey
                                // Fitbit Connector
                                  if (trackerModel === "5bfeabf014770a36348528c6" || trackerModel === "5c12653218ca114f1404721e"){
                                    res.redirect('/sync/fitbit?user=' + user + "&trackerid=" + trackerid);
                                // Fitbit Connector ENDE

                                // Google Fit Connector
                                  }else if(trackerModel === "5c12653218ca184f7404523f"){
                                    console.log("Google")
                                    res.redirect('/sync/google?user=' + user + "&trackerid=" + trackerid);
                                  }
                                  //Google Fit Connector ENDE
                                  else if (trackerModel === "5c12653448ca1454a7503543"){
                                    console.log("Samsung Tracker")
                                    res.redirect('/sync/samsung?user=' + user + "&trackerid=" + trackerid);
                                  }
                              // Kein gültiges TrackerModell angegeben
                              else{
                                res.send("Error #6 - TrackerModell setup error")
                              }
                              // Connector ENDE
                              // #############################################################
                            
                        } else {
                          res.send("Error #03 - Timeout")
                        }
                  
                      } else {
                        res.send("Error #02 - Not allowed")
                      }
                  
                }
              })
            }


})

module.exports = router;