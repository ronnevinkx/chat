import { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../queries';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function Register() {
	const history = useHistory();

	const [variables, setVariables] = useState({
		email: '',
		username: '',
		password: '',
		confirmPassword: ''
	});

	const [errors, setErrors] = useState({});

	const [registerUser, { loading }] = useMutation(REGISTER_USER, {
		update: (cache, res) => history.push('/'),
		onError: error => setErrors(error.graphQLErrors[0].extensions.errors)
	});

	const handleSubmit = e => {
		e.preventDefault();
		setErrors({});
		let errors = {};

		// client side validation to prevent possible unnecessary server request
		if (variables.email === '') {
			errors.email = 'Email must not be empty';
		}

		if (variables.username === '') {
			errors.username = 'Username must not be empty';
		}

		if (variables.password === '') {
			errors.password = 'Password must not be empty';
		}

		if (variables.confirmPassword.trim() === '') {
			errors.confirmPassword = 'Repeat password must not be empty';
		}

		if (variables.password !== variables.confirmPassword) {
			errors.confirmPassword = 'Passwords must match';
		}

		setErrors(errors);

		if (Object.keys(errors).length === 0) {
			registerUser({ variables });
		}
	};

	return (
		<Row className="bg-white py-5 justify-content-center">
			<Col sm={8} md={6} lg={4}>
				<h1 className="text-center mb-5">Register</h1>
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label className={errors.email && 'text-danger'}>
							{errors.email ?? 'Email address'}
						</Form.Label>
						<Form.Control
							type="email"
							value={variables.email}
							className={errors.email && 'is-invalid'}
							onChange={e =>
								setVariables({
									...variables,
									email: e.target.value
								})
							}
						/>
					</Form.Group>
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
					<Form.Group>
						<Form.Label
							className={errors.confirmPassword && 'text-danger'}
						>
							{errors.confirmPassword ?? 'Confirm password'}
						</Form.Label>
						<Form.Control
							type="password"
							value={variables.confirmPassword}
							className={errors.confirmPassword && 'is-invalid'}
							onChange={e =>
								setVariables({
									...variables,
									confirmPassword: e.target.value
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
							{loading ? 'Loading...' : 'Register'}
						</Button>
						<div className="mt-5">
							<small>
								Already have an account?{' '}
								<Link to="/login">Log In</Link>
							</small>
						</div>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
