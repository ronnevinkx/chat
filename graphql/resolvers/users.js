const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');
const { Op } = require('sequelize');
const { Message, User } = require('../../models');

// 3 days in seconds
const maxAge = 3 * 24 * 60 * 60;

const createToken = user => {
	return jwt.sign({ user }, process.env.JWT_SECRET, {
		expiresIn: maxAge
	});
};

module.exports = {
	Query: {
		getUsers: async (parent, args, { user }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');

				const currentUser = await User.findOne({
					where: { id: user.user.id }
				});

				let users = await User.findAll({
					where: { id: { [Op.ne]: user.user.id } }
				});

				const allUserMessages = await Message.findAll({
					where: {
						[Op.or]: [{ from: currentUser.username }, { to: currentUser.username }]
					},
					order: [['createdAt', 'DESC']]
				});

				users = users.map(otherUser => {
					const latestMessage = allUserMessages.find(m => m.from === otherUser.username || m.to === otherUser.username);
					otherUser.latestMessage = latestMessage;
					return otherUser;
				});

				return users;
			} catch (error) {
				console.log('Error', error);
			}
		},
		login: async (parent, args) => {
			let { username, password } = args;
			username = username.trim();
			let errors = {};

			try {
				if (username === '') errors.username = 'Username must not be empty';
				if (password === '') errors.password = 'Password must not be empty';

				if (Object.keys(errors).length > 0) {
					throw new UserInputError('Bad input', { errors });
				}

				const user = await User.findOne({ where: { username } });

				if (!user) {
					errors.username = 'User not found';
					throw new UserInputError('User not found', { errors });
				}

				const correctPassword = await bcrypt.compare(password, user.password);

				if (!correctPassword) {
					errors.password = 'Password is incorrect';
					throw new UserInputError('Password is incorrect', {
						errors
					});
				}

				// store user id and username in token
				const token = createToken({ id: user.id, username });

				return {
					...user.toJSON(),
					token
				};
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
	},
	Mutation: {
		addUser: async (parent, args) => {
			let { username, email, password, confirmPassword } = args;
			username = username.trim().toLowerCase();
			email = email.trim();
			let errors = {};

			try {
				// validate
				if (email === '') errors.email = 'Email must not be empty';
				if (username === '') errors.username = 'Username must not be empty';
				if (password === '') errors.password = 'Password must not be empty';
				if (confirmPassword.trim() === '') errors.confirmPassword = 'Repeat password must not be empty';
				if (password !== confirmPassword) errors.confirmPassword = 'Passwords must match';

				// check if username / email exists
				// we don't need to do this because of our model's `unique` restraints,
				// meaning User.create will fail if username or email exists
				// const usernameExists = await User.findOne({
				// 	where: { username }
				// });
				// const emailExists = await User.findOne({ where: { email } });

				// if (usernameExists) errors.username = 'Username is taken';
				// if (emailExists) errors.email = 'Email is taken';

				if (Object.keys(errors).length > 0) {
					throw errors;
				}

				// hash password
				const salt = await bcrypt.genSalt();
				password = await bcrypt.hash(password, salt);

				// create user
				const user = await User.create({ username, email, password });

				return user;
			} catch (error) {
				console.log('Error', error);

				if (error.name === 'SequelizeUniqueConstraintError') {
					error.errors.forEach(e => (errors[e.path] = `${e.path.charAt(0).toUpperCase()}${e.path.substr(1)} already exists`));
				} else if (error.name === 'SequelizeValidationError') {
					error.errors.forEach(e => (errors[e.path] = e.message));
				}

				throw new UserInputError('Bad input', { errors });
			}
		}
	}
};
