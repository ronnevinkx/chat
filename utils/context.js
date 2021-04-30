const jwt = require('jsonwebtoken');

module.exports = context => {
	if (context.req && context.req.headers.authorization) {
		const token = context.req.headers.authorization.split('Bearer ')[1];

		jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
			// don't throw error, we don't care if user is logged in for unauthenticated routes
			// if (error) {
			// 	throw new AuthenticationError('Unauthenticated');
			// }

			context.user = decodedToken;
		});
	}

	return context;
};
