import {
	users,
	polls,
	hotPolls
} from './data';


export {hotPolls};

export function getPoll(id) {
	return polls.find(poll => poll.id === id);
}

export function getUser(id) {
	return users.find(user => user.id === id);
}

export function getUserByUsername(username) {
	return users.find(user => user.username === username);
}

export function addUser(username, auth_hash) {
	let id = `u${Math.random().toString().substr(2)}`;
	
	let user = {
		id,
		username,
		auth_hash,
		scope: 'user'
	};
	
	users.push(user);
	
	return user;
}

export function addPoll(userId, poll) {
	let id = `p${Math.random().toString().substr(2)}`;
	
	let poll = {
		id,
		question: poll.question,
		answers: poll.answers,
		owner: userId
	};
	
	polls.push(poll);
	
	return poll;
}
