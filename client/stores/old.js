import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';

// TODO
/*
Get initial data from server
Allow to render something for loading and error (with retry)
*/



// Try to be mostly compatible with redux stores
// This class is extended with action handlers as methods:
// handleAction(state, ...customArgs) { /* Returns new state */ }
// Those methods are recreated to be action creators
// Those actions creators automatically create and dispatch an action to the handler
class Store {
	constructor(actions, initialState) {
		this._state = undefined;
		this._subscribers = new Set();
		
		const existingProperties = Object.getOwnPropertyNames(Store.prototype);
		
		Object.keys(actions).forEach(actionName => {
			if(existingProperties.indexOf(actionName)) {
				throw new Error(`${actionName} already exists on store`);
			}
			
			const actionReducer = actions[actionName];
			
			this[actionName] = (...args) => {
				const newState = actionReducer(this._state, ...args);
				if(newState === this._state && typeof newState === 'object') {
					throw new Error('You may not return the same object as a new state');
				}
				
				const oldState = this._state;
				this._state = newState;
				
				if(typeof this.shouldAnnounceChange === 'function') {
					// If the custom method says so
					if(this.shouldAnnounceChange(oldState, newState)) {
						this._announce();
					}
				} else { // also if there is no custom method
					this._announce();
				}
			};
		});
	}
	
	getState() {
		return this._state;
	}
	
	subscribe(handler) {
		this._subscribers.add(handler);
		
		return () => this._subscribers.delete(handler);
	}
	
	_announce() {
		this._subscribers.forEach(handler => handler());
	}
}


function createStore(actions, initialState) {
	return new Store(actions, initialState);
}




class GraphQLStore extends Store {
	constructor() {
		super({
			// TODO
		}, Immutable.Map()); // Set initial state
		// TODO: This should act as relay does
		// Keeping track of objects and allowing the developer to describe pagination
		// and logical links to other database objects
	}
	
	shouldAnnounceChange(oldState, newState) {
		// TODO: Refine this
		return true;
	}
	
	subscribeToQuery(query, handler) {
		// TODO: Whenever some depended-on value in
		// the query changes, call handler
		// How do we listen for changes on a grapql query
		fetch('/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/graphql'
			},
			body: query
		})
		.then(res => res.json())
		.then(({data, errors}) => {
			if(errors) {
				// TODO: renderErrors
				console.log('err', errors)
			} else {
				handler(data);
			}
		});
	}
	
	loadUser(state, user) {
		return state.set('userId', user.id);
	}
	
	createPoll() {
		// TODO: Call a graphql mutation, the reply info goes to the cache as usual
	}
}


export default GraphQLStore;


