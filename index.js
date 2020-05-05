const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const index = express();

index.use(cors());

mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

index.use('/graphql', graphqlHTTP({
  schema, // both names are the same so es6 doesn't need schema: schema
  graphiql: true,
}));

const PORT = process.env.PORT || 4000;
index.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});