import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';


function createReducer(actions, initialState) {
	return (state, action) => {
		if(state === undefined) {
			state = initialState;
		}
		
		let reducer = actions[action.type]
		if(reducer) {
			return reducer(state, action);
		}
		
		return state;
	};
}


function userFromToken(token) {
	if(!token) return null;
	
	try {
		let payload = window.atob(token.split('.')[1]);
	
		return JSON.parse(payload);
	} catch(e) {
		return null;
	}
}


const authReducer = createReducer({
	setLoggedIn(state, {token}) {
		return {
			...state,
			token
		};
	},
	setLoggedOut(state) {
		return {
			...state,
			token: null,
			user: null
		};
	},
	setError(state, {error}) {
		return {
			...state,
			error
		};
	},
	clearError(state) {
		return {
			...state,
			error: null
		};
	}
}, {});


const pollReducer = createReducer({
	setCategory(state, {category}) {
		return {
			...state,
			category
		};
	},
	setHot(state, {polls}) {
		return {
			...state,
			hot: polls
		};
	},
	setMine(state, {polls}) {
		return {
			...state,
			mine: polls
		};
	},
	setDisplayPoll(state, {poll}) {
		return {
			...state,
			display: poll
		};
	}
}, {
	category: 'hot',
	mine: [],
	hot: []
});


export default combineReducers({
	auth: authReducer,
	polls: pollReducer,
	router: routerStateReducer
});
