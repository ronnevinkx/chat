const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
	withFilter
} = require('apollo-server');
const { Op } = require('sequelize');
const { User, Message, Reaction } = require('../../models');

module.exports = {
	Query: {
		getMessages: async (parent, { from }, { user }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');

				const mainUser = await User.findOne({
					where: { id: user.user.id }
				});
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
					order: [['createdAt', 'DESC']],
					include: [{ model: Reaction, as: 'reactions' }]
				});

				return messages;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
	},
	Mutation: {
		addMessage: async (parent, { to, content }, { user, pubSub }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');

				const from = await User.findOne({
					where: { id: user.user.id }
				});

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

				pubSub.publish('NEW_MESSAGE', { newMessage: message });

				return message;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
		reactToMessage: async (parent, { uuid, content }, { user, pubSub }) => {
			const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

			try {
				if (!reactions.includes(content)) {
					throw new UserInputError('Invalid reaction');
				}

				// get user by context username
				const username = user ? user.user.username : '';

				if (!user) {
					throw new AuthenticationError('Unauthenticated');
				}

				// get message by id
				const message = await Message.findOne({
					where: { uuid }
				});

				if (!message) {
					throw new UserInputError('Message not found');
				}

				if (message.from !== username && message.to !== username) {
					throw new ForbiddenError('Unauthorized');
				}

				let reaction = await Reaction.findOne({
					where: { messageId: message.id, userId: user.user.id }
				});

				if (reaction) {
					// reaction exists; update it
					reaction.content = content;
					await reaction.save();
				} else {
					// reaction doesn't exist; create it
					reaction = await Reaction.create({
						messageId: message.id,
						userId: user.user.id,
						content
					});
				}

				pubSub.publish('NEW_REACTION', { newReaction: reaction });

				return reaction;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
	},
	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(parent, args, { user, pubSub }) => {
					if (!user) throw new AuthenticationError('Unauthenticated');
					return pubSub.asyncIterator('NEW_MESSAGE');
				},
				({ newMessage }, args, { user: { user } }) =>
					newMessage.from === user.username ||
					newMessage.to === user.username
						? true
						: false
			)
		},
		newReaction: {
			subscribe: withFilter(
				(parent, args, { user, pubSub }) => {
					if (!user) throw new AuthenticationError('Unauthenticated');
					return pubSub.asyncIterator('NEW_REACTION');
				},
				async ({ newReaction }, args, { user: { user } }) => {
					const message = await newReaction.getMessage();
					return message.from === user.username ||
						message.to === user.username
						? true
						: false;
				}
			)
		}
	}
};
