import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import { Container } from 'react-bootstrap';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache()
});

export default function App() {
	return (
		<Router>
			<ApolloProvider client={client}>
				<Container className="pt-5">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/register" component={Register} />
						<Route path="/login" component={Login} />
					</Switch>
				</Container>
			</ApolloProvider>
		</Router>
	);
}
