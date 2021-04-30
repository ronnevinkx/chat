import { gql } from '@apollo/client';

export const GET_USERS = gql`
	query getUsers {
		getUsers {
			id
			username
			email
			createdAt
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
