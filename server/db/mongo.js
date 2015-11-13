import monk from 'monk';
import uuid from 'uuidv4';

import {
	users as userData,
	polls as pollData
} from './data';


const db = monk('localhost/vote');

const users = db.get('users');
const polls = db.get('polls');
const votes = db.get('votes');

users.index('id', {unique: true});
users.index('username', {unique: true});

polls.index('id', {unique: true});
polls.index('owner');
polls.index({total_votes: -1});

// Put dummy data into db TODO Remove this
userData.forEach(user => users.insert(user));
pollData.forEach(poll => polls.insert(poll));



export function getUser(id) {
	return users.findOne({id});
}

export function getUserByUsername(username) {
	return users.findOne({username});
}

export function addUser(user) {
	user = {
		...user,
		id: uuid(),
		scope: 'user'
	};
	
	return users.insert(user)
	.then(doc => {
		console.log('add user doc', doc);
		return doc;
	});
}

export function getUserPolls(userId) {
	return polls.find({owner: userId});
}

export function getHotPolls() {
	return polls.find({}, {sort: {total_votes: -1}});
}

export function getPoll(id) {
	return polls.findOne({id});
}


export function addPoll(userId, poll) {
	let insertPoll = {
		...poll,
		id: uuid(),
		answers: poll.answers.map(answer => {
			answer.votes = 0;
			return answer;
		}),
		total_votes: 0,
		created: Date.now(),
		owner: userId
	};
	
	return polls.insert(insertPoll)
	.then(doc => {
		console.log('add poll', doc);
		return doc;
	}, err => console.error(err));
}

export function removePoll(pollId, userId) {
	return polls.remove({
		id: pollId,
		owner: userId
	}, {
		justOne: true
	})
	.then(count => {
		return count === 1;
	});
}

export function voteForAnswer(pollId, answerIndex) {
	return polls.update({id: pollId}, {
		$inc: {
			total_votes: 1,
			[`answers.${answerIndex}.votes`]: 1
		}
	})
	.then(count => {
		return count === 1;
	});
}