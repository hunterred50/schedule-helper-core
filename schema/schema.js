const graphql = require('graphql');
const _ = require('lodash');
const Item = require('../models/item');
const User = require('../models/user');

const { 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString, 
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const ItemType = new GraphQLObjectType({
  name: 'ToDoItem',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    category: { type: GraphQLString },
    project: { type: GraphQLString },
    startTime: { type: GraphQLString },
    duration: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        console.log(parent);
        // return _.find(users, { id: parent.userId });
        return User.findById(parent.userId);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    birthdate: { type: GraphQLString },
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args) {
        // return _.filter(items, { userId: parent.id });
        return Item.find({ userId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        // code to get data from db / other source
        // return _.find(items, { id: args.id });
        return Item.findById(args.id);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID}},
      resolve(parent, args){
        // return _.find(users, { id: args.id });
        return User.findById(args.id);
      }
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args) {
        // return items;
        return Item.find({});
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // return users;
        return User.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString }
      },
      resolve(parent, args){
        let user = new User({
          name: args.name,
          email: args.email
        });
        return user.save();
      }
    },
    addItem: {
      type: ItemType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        category: { type: GraphQLString },
        project: { type: GraphQLString },
        startTime: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args){
        let item = new Item({
          name: args.name,
          description: args.description,
          category: args.category,
          project: args.project,
          startTime: args.startTime,
          userId: args.userId
        });
        console.log(item);
        return item.save();
      }
    },
    removeItem: {
      type: ItemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args){
        return Item.findByIdAndDelete(args.id);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});