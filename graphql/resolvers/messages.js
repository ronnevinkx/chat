const { UserInputError, AuthenticationError } = require('apollo-server');
const { Op } = require('sequelize');
const { User } = require('../../models');
const { Message } = require('../../models');

module.exports = {
	Query: {
		getMessages: async (parent, { from }, { user }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');

				const mainUser = await User.findOne({ where: { id: user.id } });
				const otherUser = await User.findOne({
					where: { username: from }
				});
				if (!otherUser) throw new UserInputError('User not found');

				const usernames = [mainUser.username, otherUser.username];
				const messages = await Message.findAll({
					where: {
						from: { [Op.in]: usernames },
						to: { [Op.in]: usernames }
					},
					order: [['createdAt', 'DESC']]
				});

				return messages;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
	},
	Mutation: {
		addMessage: async (parent, { to, content }, { user }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');

				const from = await User.findOne({ where: { id: user.id } });

				const recipient = await User.findOne({
					where: { username: to }
				});

				if (!recipient) {
					throw new UserInputError('User not found');
				} else if (recipient.username === from.username) {
					throw new UserInputError('You cannot message yourself');
				}

				if (content.trim() === '')
					throw new UserInputError('Message is empty');

				const message = await Message.create({
					from: from.username,
					to,
					content
				});

				return message;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
	}
};
