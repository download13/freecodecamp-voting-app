import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {reduxReactRouter} from 'redux-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import persistState from 'redux-localstorage'

import reducers from './reducers';

const identity = a => a;
const STORAGE_KEY = '__login_token';

const createCustomStore = compose(
	applyMiddleware(thunkMiddleware),
	persistState(null, { // Persist the auth token to localStorage
		key: STORAGE_KEY,
		slicer() {
			return state => state.auth.token || '';
		},
		merge(initialState, persistedState) {
			return {
				...initialState,
				auth: {
					...initialState.auth,
					token: persistedState
				}
			};
		},
		serialize: identity,
		deserialize: identity
	}),
	deriveState(state => { // Create the auth.user derived path from auth.token
		let user = null;
		
		try {
			let payload = window.atob(state.auth.token.split('.')[1]);
			user = JSON.parse(payload);
		} catch(e) {}
		
		return {
			...state,
			auth: {
				...state.auth,
				user
			}
		};
	}),
	reduxReactRouter({createHistory: createBrowserHistory})
)(createStore);


export default () => {
	return createCustomStore(reducers, {});
};


function deriveState(fn) {
	return next => (reducer, initialState) => {
		let store = next(reducer, initialState);
		
		let getState = store.getState;
		store.getState = () => {
			return fn(getState());
		};
		
		return store;
	};
}