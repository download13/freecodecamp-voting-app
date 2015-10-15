import React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Relay from 'react-relay';
import ReactRouterRelay from 'react-router-relay';

import createLoginStore from './stores/login';
import createRemoteStore from './stores/remote';

import Root from './containers/root';
import Home from './containers/home';
import Login from './containers/login';
import Dashboard from './containers/dashboard';


const loginStore = createLoginStore();

loginStore.onChange(() => {
	console.log('loginStore change');
	Relay.injectNetworkLayer(
		new Relay.DefaultNetworkLayer('/graphql', {
			headers: {
				'Content-Type': 'application/graphql',
				Authorization: loginStore.getToken()
			}
		})
	);
});


function createApp() {
	const remoteStore = createRemoteStore(loginStore);
	
	render(
		<Router
			history={createBrowserHistory()}
			createElement={ReactRouterRelay.createElement}
			routes={{
				path: '/',
				component: Root,
				queries: {
					user: () => Relay.QL`query { me }`
				},
				indexRoute: {
					component: Home,
					queries: {
						polls: () => Relay.QL`query { polls }`
					},
				},
				childRoutes: [
					{path: 'login', component: Login},
					{path: 'dashboard', component: Dashboard}
				]
			}}
		/>,
		document.querySelector('#root')
	);
}

createApp();