import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

function Button({ label }) {
	return <button data-testid="btn-primary">{label}</button>;
}

// clean up dom after each test
afterEach(cleanup);

describe('App', () => {
	describe('Initialization', () => {
		it('renders without crashing', () => {
			ReactDOM.render(<Button label="Click me" />, document.createElement('div'));
		});

		it('renders button correctly with "Click me"', () => {
			const { getByTestId } = render(<Button label="Click me" />);
			expect(getByTestId('btn-primary')).toHaveTextContent('Click me');
		});

		it('renders button correctly with "Click again"', () => {
			const { getByTestId } = render(<Button label="Click again" />);
			expect(getByTestId('btn-primary')).toHaveTextContent('Click again');
		});

		it('renders button correctly with "Click me!"', () => {
			const { getByTestId } = render(<Button label="Click me!" />);
			expect(getByTestId('btn-primary')).toHaveTextContent('Click me!');
		});
	});
});
