import { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form } from 'react-bootstrap';
import { GET_MESSAGES, ADD_MESSAGE } from '../../queries';
import { useMessageState, useMessageDispatch } from '../../contexts/message';
import Message from './Message';

export default function Messages() {
	const [content, setContent] = useState('');
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

	const [addMessage] = useMutation(ADD_MESSAGE, {
		onError: error => console.log(error)
	});

	const handleSubmit = e => {
		e.preventDefault();

		if (content.trim() === '' || !selectedUser) return;

		addMessage({
			variables: {
				to: selectedUser.username,
				content
			}
		});

		setContent('');
	};

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
		selectedChatMarkup = (
			<p className="info-text">
				You are now connected. Send your first message.
			</p>
		);
	}

	return (
		<Col xs={10} md={8} className="p-0">
			<div className="messages-container d-flex flex-column-reverse p-3">
				{selectedChatMarkup}
			</div>
			<div className="px-3 py-2">
				<Form onSubmit={handleSubmit}>
					<Form.Group className="d-flex align-items-center m-0 pb-2">
						<Form.Control
							type="text"
							className="message-input rounded-pill p-4 bg-secondary"
							placeholder="Type a message..."
							value={content}
							onChange={e => setContent(e.target.value)}
						></Form.Control>
						<i
							className="fas fa-paper-plane fa-2x text-primary ml-3"
							onClick={handleSubmit}
							role="button"
						></i>
					</Form.Group>
				</Form>
			</div>
		</Col>
	);
}
