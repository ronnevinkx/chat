import { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { LOGIN_USER } from '../queries';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAuthDispatch } from '../contexts/auth';

export default function Login() {
	const history = useHistory();

	const [variables, setVariables] = useState({
		username: '',
		password: ''
	});

	const [errors, setErrors] = useState({});
	const dispatch = useAuthDispatch();

	const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
		onError: error => setErrors(error.graphQLErrors[0].extensions.errors),
		onCompleted: data => {
			dispatch({ type: 'LOGIN', payload: data.login });
			history.push('/');
		}
	});

	const handleSubmit = e => {
		e.preventDefault();
		setErrors({});
		let errors = {};

		// client side validation to prevent possible unnecessary server request
		if (variables.username === '') {
			errors.username = 'Username must not be empty';
		}

		if (variables.password === '') {
			errors.password = 'Password must not be empty';
		}

		setErrors(errors);

		if (Object.keys(errors).length === 0) {
			loginUser({ variables });
		}
	};

	return (
		<Row className="bg-white py-5 justify-content-center">
			<Col sm={8} md={6} lg={4}>
				<h1 className="text-center mb-5">Log In</h1>
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label
							className={errors.username && 'text-danger'}
						>
							{errors.username ?? 'Username'}
						</Form.Label>
						<Form.Control
							type="text"
							value={variables.username}
							className={`text-lowercase${
								errors.username ? ' is-invalid' : ''
							}`}
							onChange={e =>
								setVariables({
									...variables,
									username: e.target.value.toLowerCase()
								})
							}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label
							className={errors.password && 'text-danger'}
						>
							{errors.password ?? 'Password'}
						</Form.Label>
						<Form.Control
							type="password"
							value={variables.password}
							className={errors.password && 'is-invalid'}
							onChange={e =>
								setVariables({
									...variables,
									password: e.target.value
								})
							}
						/>
					</Form.Group>
					<div className="text-center">
						<Button
							variant="success"
							type="submit"
							disabled={loading}
						>
							{loading ? 'Loading...' : 'Log In'}
						</Button>
						<div className="mt-5">
							<small>
								Don't have an account?{' '}
								<Link to="/register">Register</Link>
							</small>
						</div>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
