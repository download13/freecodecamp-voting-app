import React from 'react';
import ReactDOM from 'react-dom';
import {ReduxRouter} from 'redux-router';
import {Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';

import createStore from './state/store';
import actions from './state/actions';

import Root from './containers/root';
import Home from './containers/home';
import Login from './containers/login';
import Dashboard from './containers/dashboard';
import Poll from './containers/poll';
import Settings from './containers/settings';
import CreatePoll from './containers/create-poll';
import About from './containers/about';


function createApp() {
	const store = createStore();
	
	const ensureAuthed = (nextState, replaceState) => {
		if(!store.getState().auth.token) {
			replaceState({nextPath: nextState.location.pathname}, '/login');
		}
	};

	return <Provider store={store}>
		<ReduxRouter>
			<Route
				path="/"
				component={Root}
			>
				<Route
					path="login"
					component={Login}
					onEnter={(nextState, replaceState) => {
						if(store.getState().auth.token) {
							replaceState(null, '/dashboard');
						}
					}}
				/>
				<Route
					path="logout"
					onEnter={(nextState, replaceState) => {
						store.dispatch(actions.logout());
						replaceState(null, '/');
					}}
				/>
				
				<IndexRoute component={Home} />
				<Route
					path="create"
					component={CreatePoll}
					onEnter={ensureAuthed}
				/>
				<Route
					path="dashboard"
					component={Dashboard}
					onEnter={ensureAuthed}
				/>
				<Route
					path="poll/:id"
					component={Poll}
				/>
				<Route
					path="settings"
					component={Settings}
					onEnter={ensureAuthed}
				/>
				<Route
					path="about"
					component={About}
				/>
			</Route>
		</ReduxRouter>
	</Provider>;
}

let app = createApp();
ReactDOM.render(app, document.querySelector('#root'));
