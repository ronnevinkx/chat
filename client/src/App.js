import {
	ApolloProvider,
	ApolloClient,
	InMemoryCache,
	createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './contexts/auth';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import { Container } from 'react-bootstrap';
import DynamicRoute from './utils/DynamicRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

const httpLink = createHttpLink({ uri: 'http://localhost:4000' });
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});

export default function App() {
	return (
		<Router>
			<ApolloProvider client={client}>
				<AuthProvider>
					<Container className="pt-5">
						<Switch>
							<DynamicRoute
								exact
								path="/"
								component={Home}
								authenticated
							/>
							<DynamicRoute
								path="/register"
								component={Register}
								guest
							/>
							<DynamicRoute
								path="/login"
								component={Login}
								guest
							/>
						</Switch>
					</Container>
				</AuthProvider>
			</ApolloProvider>
		</Router>
	);
}
