import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { useAuthDispatch } from '../contexts/auth';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../queries';

export default function Home() {
	const history = useHistory();
	const dispatch = useAuthDispatch();

	const logout = e => {
		dispatch({ type: 'LOGOUT' });
		history.push('/');
	};

	const { loading, data, error } = useQuery(GET_USERS);

	if (error) {
		console.log(error);
	}

	if (data) {
		console.log(data);
	}

	let usersMarkup;

	if (!data || loading) {
		usersMarkup = <p>Loading...</p>;
	} else if (data.getUsers.length === 0) {
		usersMarkup = <p>No users have joined yet.</p>;
	} else if (data.getUsers.length > 0) {
		usersMarkup = data.getUsers.map(user => (
			<div key={user.id}>
				<p>{user.username}</p>
			</div>
		));
	}

	return (
		<>
			<Row className="bg-white justify-content-around mb-1">
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
				<Col xs={4}>{usersMarkup}</Col>
				<Col xs={8}>
					<p>Messages</p>
				</Col>
			</Row>
		</>
	);
}
