const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		id: Int
		username: String!
		email: String
		token: String
		imageUrl: String
		createdAt: String!
		latestMessage: Message
	}

	type Message {
		uuid: String!
		from: String!
		to: String!
		content: String!
		createdAt: String!
		reactions: [Reaction]
	}

	type Reaction {
		uuid: String!
		content: String!
		message: Message!
		user: User!
		createdAt: String!
	}

	type Query {
		getUsers: [User]!
		login(username: String!, password: String!): User!
		getMessages(from: String!): [Message]!
	}

	type Mutation {
		addUser(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!

		addMessage(to: String!, content: String!): Message!

		reactToMessage(uuid: String!, content: String!): Reaction!
	}

	type Subscription {
		newMessage: Message!
		newReaction: Reaction!
	}
`;
