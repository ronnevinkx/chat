import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { AuthProvider } from './contexts/auth';
import { MessageProvider } from './contexts/message';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import { Container } from 'react-bootstrap';
import DynamicRoute from './utils/DynamicRoute';
import Home from './pages/home/Home';
import Register from './pages/Register';
import Login from './pages/Login';

const httpLinkUri = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/graphql' : '/graphql/';
let httpLink = createHttpLink({ uri: httpLinkUri });
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

httpLink = authLink.concat(httpLink);

const host = window.location.host;
const wsUri = process.env.NODE_ENV === 'development' ? 'ws://localhost:4000' : `ws://${host}/graphql/`;

const wsLink = new WebSocketLink({
	uri: wsUri,
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	}
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache()
});

export default function App() {
	return (
		<Router>
			<ApolloProvider client={client}>
				<AuthProvider>
					<MessageProvider>
						<Container className="pt-5">
							<Switch>
								<DynamicRoute exact path="/" component={Home} authenticated />
								<DynamicRoute path="/register" component={Register} guest />
								<DynamicRoute path="/login" component={Login} guest />
							</Switch>
						</Container>
					</MessageProvider>
				</AuthProvider>
			</ApolloProvider>
		</Router>
	);
}
