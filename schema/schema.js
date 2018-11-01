const graphql = require('graphql');
const _ = require('lodash');
const User = require('../models/user');
const Tracker = require('../models/tracker');
const Weight = require('../models/weight');

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
      },
      trackers: {
        type: new GraphQLList(TrackerType),
        resolve(parent, args){
        //  return _.filter(trackers, {userId: parent.id})
        return Tracker.find({ userId: parent.id });
        }//grabbing data
      },*/
      email: {type: GraphQLString }, //@isUnique
      password: {type: GraphQLString }
  })
})

const TrackerType = new GraphQLObjectType({
  name: 'Tracker',
  fields: () => ({
      //createdAt: DateTime!
      id: {type: GraphQLID },
      name: {type: GraphQLString },
      trackerModel: {type: GraphQLString },
      users: {
        type: new GraphQLList(UserType),
        resolve(parent, args){
        //  return _.filter(users, {trackerId: parent.id})
        return User.find({ trackerId: parent.id });
        }//grabbing data
      },
      //updatedAt: DateTime!
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
    userPerMail: {
      type: UserType,
      args: { email: {type: GraphQLString }},
      resolve(parent, args){
      // return _.find(users, {id: args.id });
      return User.findOne({ email: args.email });
      }
    },
    tracker: {
      type: TrackerType,
      args: { id: {type: GraphQLID }},
      resolve(parent, args){
      //  return _.find(trackers, {id: args.id});
      return Tracker.findById(args.id);
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
          password: args.password
        });
        return user.save();
      }
    },
    createTracker: {
      type: TrackerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString) },
        trackerModel: {type: new GraphQLNonNull(GraphQLString) },
        userId:  {type: GraphQLID },
      },
      resolve(parent, args){
        let tracker = new Tracker({
          name: args.name,
          trackerModel: args.trackerModel,
          userId: args.userId
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
        updatedAt: {type: DateTimeScalar },
        lastLogin: {type: DateTimeScalar },
      },
      resolve(parent, args){
      return User.update({ authToken: args.authToken }, { active: true, updatedAt: args.updatedAt, lastLogin: args.lastLogin });
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
