const graphql = require('graphql');
const _ = require('lodash');
const User = require('../models/user');
const Tracker = require('../models/tracker');
const Weight = require('../models/weight');
const TrackerModel = require('../models/tracker-model');

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

var date = new Date();

/*Types*/
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      createdAt: {type: DateTimeScalar },
      updatedAt: {type: DateTimeScalar },
      lastLogin: {type: DateTimeScalar },
      id: {type: GraphQLID },
      firstName: {type: GraphQLString },
      name: {type: GraphQLString },
      authToken: {type: GraphQLString },
      dateOfBirth: {type: DateTimeScalar },
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
      },*/
      trackersIds: {
        type: new GraphQLList(TrackerType),
        resolve(parent, args){
        //  return _.filter(trackers, {userId: parent.id})
        return Tracker.find({ userId: parent.id });
        }//grabbing data
      },
      email: {type: GraphQLString }, //@isUnique
      password: {type: GraphQLString },
      loggedIn: {type: GraphQLBoolean }
  })
})

const TrackerModelType = new GraphQLObjectType({
  name: 'TrackerModel',
  fields: () => ({
      //createdAt: DateTime!
      id: {type: GraphQLID },
      name: {type: GraphQLString },
      trackerModel: {type: GraphQLString },
      trackerIds: {
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
      //createdAt: DateTime!
      id: {type: GraphQLID },
      createdAt: {type: DateTimeScalar },
      trackerModelID: {
        type: new GraphQLList(TrackerModelType),
        resolve(parent, args){
        //  return _.filter(trackers, {userId: parent.id})
        return TrackerModel.find({ trackersIds: parent.id });
      }},
      userId: {
        type: new GraphQLList(UserType),
        resolve(parent, args){
        //  return _.filter(trackers, {userId: parent.id})
        return User.find({ trackersIds: parent.id });
      }},
      token: {type: GraphQLString },
      lastSync: {type: DateTimeScalar }
  })
})

const WeightType = new GraphQLObjectType({
  name: 'Weight',
  fields: () => ({
      //createdAt: DateTime!
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
    }
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
        dateOfBirth: {type: DateTimeScalar },
        gender: {type: GraphQLInt },
        language: {type: GraphQLString },
        country: {type: GraphQLString },
        zipcode: {type: GraphQLInt },
        height: {type: GraphQLFloat },
        trackerId: {type: GraphQLID },
        weightId: {type: GraphQLID },
        email: {type: new GraphQLNonNull(GraphQLString) },
        password: {type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args){
        let user = new User({
          createdAt: date,
          updatedAt: date,
          lastLogin: date,
          name: args.name,
          firstName: args.firstName,
          authToken: args.authToken,
          dateOfBirth: args.dateOfBirth,
          gender: args.gender,
          active: false,// @defaultValue(value: false)
          userGroup: 1,
          //language: args.language,
          //country: args.country,
          //zipcode: args.zipcode,
          //height: args.height,
          //trackerId: args.trackerId,
          //weightId: args.weightId,
          email: args.email,
          password: args.password,
          loggedIn: false
        });
        return user.save();
      }
    },
    createTrackerModel: {
      type: TrackerModelType,
      args: {
        manufacturer: {type: GraphQLString },
        type: {type: GraphQLString },
        apiLink: {type: GraphQLString },
        trackersIds: {type: GraphQLString }
      },
      resolve(parent, args){
        let trackerModel = new TrackerModel({
          manufacturer: args.manufacturer,
          type: args.type,
          apiLink: args.apiLink,
          trackersIds: args.trackersIds
        });
        return trackerModel.save();
      }
    },
    createTracker: {
      type: TrackerType,
      args: {
        trackerModelID: {type: GraphQLID },
        userId: {type: GraphQLID },
        token: {type: GraphQLString },
      },
      resolve(parent, args){
        let tracker = new Tracker({
          trackerModelID: args.trackerModelID,
          userId: args.userId,
          token: args.token
        });
        return tracker.save();
      }
    },
    userNewPW: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString) },
        password: {type: new GraphQLNonNull(GraphQLString) },
        updatedAt: {type: DateTimeScalar },
      },
      resolve(parent, args){
      return User.update({ email: args.email }, { password: args.password, updatedAt: args.updatedAt });
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        authToken: {type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args){
      return User.update({ authToken: args.authToken }, { active: true, loggedIn: true });
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
    }
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
