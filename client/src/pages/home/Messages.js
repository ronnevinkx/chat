import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Col } from 'react-bootstrap';
import { GET_MESSAGES } from '../../queries';
import { useMessageState, useMessageDispatch } from '../../contexts/message';
import Message from './Message';
import AddMessage from './AddMessage';

export default function Messages() {
	const dispatch = useMessageDispatch();
	const { users } = useMessageState();
	const selectedUser = users?.find(user => user.selected);
	const messages = selectedUser?.messages;
	const [getMessages, { loading, data }] = useLazyQuery(GET_MESSAGES);

	useEffect(() => {
		if (selectedUser && !selectedUser.messages) {
			getMessages({ variables: { from: selectedUser.username } });
		}
	}, [selectedUser, getMessages]);

	useEffect(() => {
		if (data) {
			dispatch({
				type: 'SET_USER_MESSAGES',
				payload: {
					username: selectedUser.username,
					messages: data.getMessages
				}
			});
		}
		// eslint-disable-next-line
	}, [data]);

	let selectedChatMarkup;

	if (!messages && !loading) {
		selectedChatMarkup = <p className="info-text">Select a friend</p>;
	} else if (loading) {
		selectedChatMarkup = <p className="info-text">Loading...</p>;
	} else if (messages.length > 0) {
		selectedChatMarkup = messages.map((message, index) => (
			<div key={message.uuid} className="d-flex">
				<Message message={message} />
				{index === messages.length - 1 && (
					<div className="invisible">
						<hr className="m-0" />
					</div>
				)}
			</div>
		));
	} else if (messages.length === 0) {
		selectedChatMarkup = <p className="info-text">You are now connected. Send your first message.</p>;
	}

	return (
		<Col xs={10} md={8} className="p-0">
			<div className="messages-container d-flex flex-column-reverse p-3">{selectedChatMarkup}</div>
			<div className="px-3 py-2">
				<AddMessage selectedUser={selectedUser} />
			</div>
		</Col>
	);
}
