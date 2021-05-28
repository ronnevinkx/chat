import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Button, Container } from 'react-bootstrap';
import { useSubscription } from '@apollo/client';
import { useAuthDispatch, useAuthState } from '../../contexts/auth';
import { useMessageDispatch } from '../../contexts/message';
import { NEW_MESSAGE, NEW_REACTION } from '../../queries';
import Users from './Users';
import Messages from './Messages';

export default function Home() {
	const authDispatch = useAuthDispatch();
	const messageDispatch = useMessageDispatch();
	const { user } = useAuthState();

	const { data: messageData, error: messageError } =
		useSubscription(NEW_MESSAGE);

	const { data: reactionData, error: reactionError } =
		useSubscription(NEW_REACTION);

	useEffect(() => {
		if (messageError) {
			console.log(messageError);
		}

		if (messageData) {
			const message = messageData.newMessage;
			const otherUser =
				user.username === message.to ? message.from : message.to;

			messageDispatch({
				type: 'ADD_MESSAGE',
				payload: {
					username: otherUser,
					message
				}
			});
		}
		// eslint-disable-next-line
	}, [messageData, messageError]);

	useEffect(() => {
		if (reactionError) {
			console.log(reactionError);
		}

		if (reactionData) {
			const reaction = reactionData.newReaction;
			const otherUser =
				user.username === reaction.message.to
					? reaction.message.from
					: reaction.message.to;

			messageDispatch({
				type: 'ADD_REACTION',
				payload: {
					username: otherUser,
					reaction
				}
			});
		}
		// eslint-disable-next-line
	}, [reactionData, reactionError]);

	const logout = e => {
		authDispatch({ type: 'LOGOUT' });
		window.location.href = '/login';
	};

	return (
		<>
			<Row className="bg-primary text-white top-user-name text-center py-2">
				<Container>
					{`Welcome, ${user.username
						.charAt(0)
						.toUpperCase()}${user.username.substr(1)}`}
				</Container>
			</Row>
			<Row className="bg-white justify-content-around border-bottom">
				<Link to="/login">
					<Button variant="link">Login</Button>
				</Link>
				<Link to="/register">
					<Button variant="link">Register</Button>
				</Link>
				<Button variant="link" onClick={logout}>
					Logout
				</Button>
			</Row>
			<Row className="bg-white">
				<Users />
				<Messages />
			</Row>
		</>
	);
}
