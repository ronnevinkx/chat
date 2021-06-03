import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from 'react-bootstrap';
import { ADD_MESSAGE } from '../../queries';

export default function AddMessage({ selectedUser }) {
	const [content, setContent] = useState('');

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

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="d-flex align-items-center m-0 pb-2">
				<Form.Control type="text" className="message-input rounded-pill p-4 bg-secondary" placeholder="Type a message..." value={content} onChange={e => setContent(e.target.value)}></Form.Control>
				<i className="fas fa-paper-plane fa-2x text-primary ml-3" onClick={handleSubmit} role="button"></i>
			</Form.Group>
		</Form>
	);
}
