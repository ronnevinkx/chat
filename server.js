const { ApolloServer } = require('apollo-server');
const { sequelize } = require('./models');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ctx => ctx
});

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);

	sequelize
		.authenticate()
		.then(() => console.log(`Db connected`))
		.catch(error => console.log('Error', error));
});
