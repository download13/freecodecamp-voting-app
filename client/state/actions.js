import {pushState} from 'redux-router';

// TODO: Handle expired tokens by logging user out
import graphql from './graphql';


const POLL_FRAGMENT = `
... on Poll {
	id
	question
	answers {
		text
		color
		votes
	}
}`;

const actions = {
	login(username, password) {
		return (dispatch, getState) => {
			createTokenRequest(getState, `
				mutation M($u: String!, $p: String!) {
					login(username: $u, password: $p) {
						token
					}
				}
			`, {
				u: username,
				p: password
			})
			.then(data => {
				if(!data.login || !data.login.token) {
					dispatch({type: 'setError', error: 'Invalid username or password'});
				} else {
					dispatch({type: 'clearError'});
					dispatch({type: 'setLoggedIn', token: data.login.token});
				}
			}, () => {
				dispatch({type: 'setError', error: 'Invalid username or password'});
			});
		};
		
	},
	logout() {
		return {type: 'setLoggedOut'};
	},
	
	// Poll actions
	selectCategory(category) {
		return {type: 'setCategory', category};
	},
	refreshMine: createGetData(
		`{
			polls {
				mine {
					${POLL_FRAGMENT}
				}
			}
		}`,
		data => ({type: 'setMine', polls: data.polls.mine})
	),
	refreshHot: createGetData(
		`{
			polls {
				hot {
					${POLL_FRAGMENT}
				}
			}
		}`,
		data => ({type: 'setHot', polls: data.polls.hot})
	),
	loadDisplayPoll(id) {
		return (dispatch, getState) => {
			createTokenRequest(getState, `
				query Q($id: ID!) {
					polls {
						poll(id: $id) {
							${POLL_FRAGMENT}
						}
					}
				}
			`, {
				id
			})
			.then(data => {
				dispatch({type: 'setDisplayPoll', poll: data.polls.poll});
			});
		};
	},
	createPoll(poll) {
		return (dispatch, getState) => {
			createTokenRequest(getState, `
				mutation CreatePoll($poll: PollInput!) {
					polls {
						create(poll: $poll) {
							${POLL_FRAGMENT}
						}
					}
				}
			`, {
				poll
			})
			.then(data => {
				let poll = data.polls.create;
				
				dispatch({type: 'setDisplayPoll', poll});
				debugger;
				dispatch(pushState(null, `/poll/${poll.id}`));
			}, err => {
				throw err;
			});
		};
	},
	removePoll(id) {
		return (dispatch, getState) => {
			createTokenRequest(getState, `
				mutation RemovePoll($id: ID!) {
					polls {
						remove(id: $id)
					}
				}
			`, {
				id
			})
			.then(data => {
				console.log('client remove poll', data);
				// TODO
			}, err => {
				throw err;
			});
		};
	},
	vote(pollId, answerIndex) {
		return (dispatch, getState) => {
			// TODO
			console.log('action vote',pollId, answerIndex);
			
			createTokenRequest(getState, `
				mutation Vote($pollId: ID!, $answerIndex: Int!) {
					polls {
						vote(pollId: $pollId, answerIndex: $answerIndex) {
							${POLL_FRAGMENT}
						}
					}
				}
			`, {
				pollId,
				answerIndex
			})
			.then(data => {
				dispatch({type: 'setDisplayPoll', poll: data.polls.vote});
			}, err => {
				throw err;
			});
		};
	}
};

export default actions;


function createGetData(query, dataToActionFn) {
	return () => {
		return (dispatch, getState) => {
			createTokenRequest(getState, query)
			.then(data => {
				dispatch(dataToActionFn(data))
			});
		};
	};
}

function createTokenRequest(getState, query, variables) {
	return graphql(query, variables, {
		headers: {
			Authorization: getState().auth.token
		}
	});
}