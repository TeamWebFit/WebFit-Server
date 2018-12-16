const graphql = require('graphql');
const graphqlisodate = require('graphql-iso-date');
const _ = require('lodash');
const User = require('../models/user');
const Tracker = require('../models/tracker');
const Weight = require('../models/weight');
const TrackerModel = require('../models/tracker-model');
const Steps = require('../models/steps');

const DateTimeScalar = require('../scalars/dateTimeScalar');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType
} = graphql;

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = 'graphqlisodate';

var date = new Date();
var dateString = date.toString();
var milliSec = date.getTime();

/*Types*/
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      createdAt: {type: GraphQLString },
      updatedAt: {type: GraphQLString },
      lastLogin: {type: GraphQLString },
      id: {type: GraphQLID },
      firstName: {type: GraphQLString },
      name: {type: GraphQLString },
      authToken: {type: GraphQLString },
      dateOfBirth: {type: GraphQLString },
      gender: {type: GraphQLInt },
      active: {type: GraphQLBoolean },// @defaultValue(value: false)
      userGroup: {type: GraphQLInt },
      //language: {type: GraphQLString },
      //country: {type: GraphQLString },
      //zipcode: {type: GraphQLInt },
      //height: {type: GraphQLFloat },
      /*weights: {
        type: new GraphQLList(WeightType),
        resolve(parent, args){
          //return _.filter(weights, {userId: parent.id})
          return Weight.find({ userId: parent.id });
        }
      },
      trackers: {
        type: new GraphQLList(TrackerType),
        resolve(parent, args){
        //  return _.filter(trackers, {userId: parent.id})
        return Tracker.find({ userId: parent.id });
        }//grabbing data
      },*/
      tracker: {
        type: new GraphQLList(TrackerType),
        resolve(parent, args){
        //  return _.filter(trackers, {userId: parent.id})
        console.log(parent.id);
        return Tracker.find({ userId: parent.id });
      }},
      email: {type: GraphQLString }, //@isUnique
      password: {type: GraphQLString },
      loggedIn: {type: GraphQLBoolean },
      guest: {type: GraphQLBoolean }
  })
})

const TrackerModelType = new GraphQLObjectType({
  name: 'TrackerModel',
  fields: () => ({
      createdAt: {type: GraphQLString},
      id: {type: GraphQLID },
      manufacturer: {type: GraphQLString },
      type: {type: GraphQLString },
      authLink: {type: GraphQLString },
      apiLink: {type: GraphQLString },
      apiLinkRequest: {type: GraphQLString },
      trackers: {
        type: new GraphQLList(TrackerType),
        resolve(parent, args){
        //  return _.filter(users, {trackerId: parent.id})
        return Tracker.find({ trackerModelID: parent.id });
        }//grabbing data
      },
      //updatedAt: DateTime!
  })
})

const TrackerType = new GraphQLObjectType({
  name: 'Tracker',
  fields: () => ({
      id: {type: GraphQLID },
      createdAt: {type: GraphQLString },
      trackerModel: {
        type: TrackerModelType,
        resolve(parent, args){

        return TrackerModel.findOne({ trackerIds: parent.id });
      }},
      user: {
        type: UserType,
        resolve(parent, args){

        return User.findOne({ trackerIds: parent.id });
      }},
      access_token: {type: GraphQLString },
      token_type: {type: GraphQLString },
      expires_in: {type: GraphQLInt },
      refreshtoken: {type: GraphQLString },
      user_id: {type: GraphQLString },
      lastSync: {type: GraphQLString }
  })
})

const WeightType = new GraphQLObjectType({
  name: 'Weight',
  fields: () => ({
      createdAt: {type: GraphQLString},
      id: {type: GraphQLID },
      kilogram: {type: GraphQLFloat },

      users: {
        type: new GraphQLList(UserType),
        resolve(parent, args){
        //  return _.filter(users, {weightId: parent.id})
        return User.find({ weightId: parent.id });
        }//grabbing data
      },
      //updatedAt: DateTime!
  })
})

const StepsType = new GraphQLObjectType({
  name: 'Steps',
  fields: () => ({
      time: {type: GraphQLString},
      value: {type: GraphQLString },
      trackerId: {type: GraphQLID },
      /*{
        type: new GraphQLList(TrackerType),
        resolve(parent, args){
        //  return _.filter(users, {weightId: parent.id})
        return User.find({ stepsId: parent.id });
        }//grabbing data
      }*/
      //updatedAt: DateTime!
  })
})

/*Queries*/
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: {type: GraphQLID }},
      resolve(parent, args){
      // return _.find(users, {id: args.id });
      return User.findById(args.id);
      }
    },
    trackerModel: {
      type: TrackerModelType,
      args: { id: {type: GraphQLID }},
      resolve(parent, args){
      // return _.find(users, {id: args.id });
      return TrackerModel.findById(args.id);
      }
    },
    tracker: {
      type: TrackerType,
      args: { id: {type: GraphQLID }},
      resolve(parent, args){
      // return _.find(users, {id: args.id });
      return Tracker.findById(args.id);
      }
    },
    userPerMail: {
      type: UserType,
      args: { email: {type: GraphQLString }},
      resolve(parent, args){
      // return _.find(users, {id: args.id });
      return User.findOne({ email: args.email });
      }
    },
    allUsers: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
      //  return users
      return User.find({});
      }
    },
    allTrackers: {
      type: new GraphQLList(TrackerType),
      resolve(parent, args){
      //  return trackers
      return Tracker.find({});
      }
    },
    allTrackerModels: {
      type: new GraphQLList(TrackerModelType),
      resolve(parent, args){
      //  return trackerModels
      return TrackerModel.find({});
      }
    },
    allSteps: {
      type: new GraphQLList(StepsType),
      resolve(parent, args){
      //  return steps
      return Steps.find({});
      }
    },
  }
})



/*Mutations*/
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString) },
        name: {type: new GraphQLNonNull(GraphQLString) },
        authToken: {type: new GraphQLNonNull(GraphQLString) },
        dateOfBirth: {type: GraphQLString },
        gender: {type: GraphQLInt },
        language: {type: GraphQLString },
        country: {type: GraphQLString },
        zipcode: {type: GraphQLInt },
        height: {type: GraphQLFloat },
        trackerIds: {type: GraphQLID },
        weightId: {type: GraphQLID },
        email: {type: new GraphQLNonNull(GraphQLString) },
        password: {type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args){
        let user = new User({
          createdAt: dateString,
          updatedAt: dateString,
          lastLogin: dateString,
          name: args.name,
          firstName: args.firstName,
          authToken: args.authToken,
          dateOfBirth: args.dateOfBirth,
          gender: args.gender,
          active: false,// @defaultValue(value: false)
          userGroup: 1,
          language: args.language,
          //country: args.country,
          //zipcode: args.zipcode,
          //height: args.height,
          trackerIds: args.trackerIds,
          //weightId: args.weightId,
          email: args.email,
          password: args.password,
          loggedIn: false,
          guest: false
        });
        return user.save();
      }
    },
    createGuestUser: {
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString) },
        dateOfBirth: {type: GraphQLString },
        gender: {type: GraphQLInt },
        height: {type: GraphQLFloat },
        trackerIds: {type: GraphQLID },
        weightId: {type: GraphQLID }
      },
      resolve(parent, args){
        let user = new User({
          createdAt: dateString,
          updatedAt: dateString,
          userGroup: 1,
          //height: args.height,
          trackerIds: args.trackerIds,
          //weightId: args.weightId,
          guest: true
        });
        return user.save();
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {type: GraphQLID }
      },
      resolve(parent, args){
        return User.deleteOne({ _id: args.id });
      }
    },
    deleteTracker: {
      type: TrackerType,
      args: {
        id: {type: GraphQLID }
      },
      resolve(parent, args){
        return Tracker.deleteOne({ _id: args.id });
      }
    },
    createTrackerModel: {
      type: TrackerModelType,
      args: {
        manufacturer: {type: GraphQLString },
        type: {type: GraphQLString },
        authLink: {type: GraphQLString },
        apiLink: {type: GraphQLString },
        apiLinkRequest: {type: GraphQLString },
        trackerIds: {type: GraphQLString },
      },
      resolve(parent, args){
        let trackerModel = new TrackerModel({
          manufacturer: args.manufacturer,
          type: args.type,
          authLink: args.authLink,
          apiLink: args.apiLink,
          apiLinkRequest: args.apiLinkRequest,
          trackerIds: args.trackerIds
        });
        return trackerModel.save();
      }
    },
    createTracker: {
      type: TrackerType,
      args: {
        trackerModelID: {type: GraphQLID },
        userId: {type: GraphQLID },
        access_token: {type: GraphQLString },
        token_type: {type: GraphQLString },
        expires_in: {type: GraphQLInt },
        refreshtoken: {type: GraphQLString },
        user_id: {type: GraphQLString },
      },
      resolve(parent, args){
        let tracker = new Tracker({
          createdAt: dateString,
          trackerModelID: args.trackerModelID,
          userId: args.userId,
          access_token: args.access_token,
          token_type: args.token_type,
          expires_in: args.expires_in,
          refreshtoken: args.refreshtoken,
          user_id: args.user_id,
          lastSync: milliSec
        });
        console.log(tracker._id);
        tracker.save();

        return User.updateOne({ _id: args.userId }, { $push: { trackerIds: tracker._id } }).then(() =>{
          return TrackerModel.updateOne({ _id: args.trackerModelID }, { $push: { trackerIds: tracker._id } });
          }
        )
        //User.updateOne({ _id: args.userId }, { $push: { trackerIds: tracker._id } });
      },
    },
    createSteps: {
      type: StepsType,
      args: {
        trackerId: {type: GraphQLID },
        time: {type: GraphQLString },
        value: {type: GraphQLString }
      },
      resolve(parent, args){
        let steps = new Steps({
          trackerId: args.trackerId,
          time: args.time,
          value: args.value,
        });
        return steps.save();
      }
    },
    //Update User Funktionen
    updateUser: {
      type: UserType,
      args: {
        id: {type: GraphQLID },
        trackerId: {type: GraphQLString }
      },
      resolve(parent, args){
      return User.updateOne({ _id: args.id }, { $push: { trackerIds: args.trackerId } });
      }
    },
    userNewPW: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString) },
        password: {type: new GraphQLNonNull(GraphQLString) },
        updatedAt: {type: GraphQLString },
      },
      resolve(parent, args){
      return User.update({ email: args.email }, { password: args.password, updatedAt: args.updatedAt });
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        authToken: {type: new GraphQLNonNull(GraphQLString) },
        lastLogin: {type: GraphQLString },
        updatedAt: {type: GraphQLString },
      },
      resolve(parent, args){
      return User.updateOne({ authToken: args.authToken }, { active: true, loggedIn: true, lastLogin: args.lastLogin, updatedAt: args.updatedAt });
      }
    },
    signinUser: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString) },
        password: {type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args){
        return User.findOne({
          email: args.email,
          password: args.password
         });
      }
    },
    //Update Tracker Funktionen
    updateTracker: {
      type: TrackerType,
      args: {
        id: {type: GraphQLID },
        lastSync: {type: GraphQLString },
      },
      resolve(parent, args){
        return Tracker.updateOne({ _id: args.id }, { lastSync: args.lastSync });
      }
    },
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
