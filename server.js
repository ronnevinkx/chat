const { ApolloServer } = require('apollo-server');
const { sequelize } = require('./models');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./utils/context');
require('dotenv').config();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context,
	subscriptions: { path: '/' }
});

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`Server ready at ${url}`);
	console.log(`Subscriptions ready at ${subscriptionsUrl}`);

	sequelize
		.authenticate()
		.then(() => console.log(`Db connected`))
		.catch(error => console.log('Error', error));
});
