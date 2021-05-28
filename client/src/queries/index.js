import { gql } from '@apollo/client';

export const GET_USERS = gql`
	query getUsers {
		getUsers {
			id
			username
			email
			imageUrl
			createdAt
			latestMessage {
				uuid
				from
				to
				content
				createdAt
			}
		}
	}
`;

export const ADD_USER = gql`
	mutation addUser(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		addUser(
			username: $username
			email: $email
			password: $password
			confirmPassword: $confirmPassword
		) {
			username
			email
			createdAt
		}
	}
`;

export const LOGIN_USER = gql`
	query login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			username
			email
			createdAt
			token
		}
	}
`;

export const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			from
			to
			content
			createdAt
			reactions {
				uuid
				content
			}
		}
	}
`;

export const ADD_MESSAGE = gql`
	mutation addMessage($to: String!, $content: String!) {
		addMessage(to: $to, content: $content) {
			uuid
			from
			to
			content
			createdAt
		}
	}
`;

export const REACT_TO_MESSAGE = gql`
	mutation reactToMessage($uuid: String!, $content: String!) {
		reactToMessage(uuid: $uuid, content: $content) {
			uuid
		}
	}
`;

export const NEW_MESSAGE = gql`
	subscription newMessage {
		newMessage {
			uuid
			from
			to
			content
			createdAt
		}
	}
`;

export const NEW_REACTION = gql`
	subscription newReaction {
		newReaction {
			uuid
			content
			message {
				uuid
				from
				to
			}
		}
	}
`;
