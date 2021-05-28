import { useQuery } from '@apollo/client';
import { Col, Image } from 'react-bootstrap';
import { GET_USERS } from '../../queries';
import { useMessageState, useMessageDispatch } from '../../contexts/message';

export default function Users() {
	const dispatch = useMessageDispatch();
	const { users } = useMessageState();
	const selectedUser = users?.find(user => user.selected)?.username;

	const { loading } = useQuery(GET_USERS, {
		onCompleted: data =>
			dispatch({ type: 'SET_USERS', payload: data.getUsers }),
		onError: error => console.log(error)
	});

	let usersMarkup;

	if (!users || loading) {
		usersMarkup = <p>Loading...</p>;
	} else if (users.length === 0) {
		usersMarkup = <p>No users have joined yet.</p>;
	} else if (users.length > 0) {
		usersMarkup = users.map(user => {
			const activeClass =
				user.username === selectedUser ? ' bg-white' : '';

			return (
				<div
					key={user.id}
					role="button"
					className={`users-container d-flex justify-content-center justify-content-md-start p-3${activeClass}`}
					onClick={() =>
						dispatch({
							type: 'SET_SELECTED_USER',
							payload: user.username
						})
					}
				>
					<Image
						src={
							user.imageUrl ||
							'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
						}
						alt={user.username}
						className="user-image"
					/>
					<div className="d-none d-md-block ml-2">
						<p className="text-success">{user.username}</p>
						<p className="font-weight-light">
							{user.latestMessage
								? user.latestMessage.content
								: 'You are now connected!'}
						</p>
					</div>
				</div>
			);
		});
	}

	return (
		<Col xs={2} md={4} className="p-0 bg-secondary">
			{usersMarkup}
		</Col>
	);
}
