import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink,} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

//Constructing main GraphQL API endpoint
const httpLink = new ApolloClient({
  uri: '/graphql'
})

//Constructing to request the middleware that will attach JWT token to every request as an 'Authorization' Header

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers, 
      authorization: token? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
//Set up client to execute authorization middleware prior to making requests to GraphQL endpoint
  link: authLink.concat(httpLink),
  cache: new InMemoryCache
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
