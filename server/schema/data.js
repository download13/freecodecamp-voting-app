class User {
	constructor(obj) {
		for(let i in obj) {
			this[i] = obj[i];
		}
	}
}
class Poll {
	constructor(obj) {
		for(let i in obj) {
			this[i] = obj[i];
		}
	}
}


const users = [
	{
		id: 'u0',
		username: 'download',
	},
	{
		id: 'u1',
		username: 'margaret'
	}
];


const polls = [
	{
		id: '0',
		question: 'How can I tell what\'s real?',
		answers: [
			{text: 'I can touch it', color: '#15d', votes: 15},
			{text: 'I can see it', color: '#48e', votes: 20},
			{text: 'It doesn\'t matter', color: '#f81', votes: 90},
		]
	},
	{
		id: '1',
		question: 'What are candles made of?',
		answers: [
			{text: 'Wax', color: '#999', votes: 20},
			{text: 'A strong sense of purpose', color: '#393', votes: 0},
			{text: 'Who are you?', color: '#d4d', votes: 1},
		]
	},
	{
		id: '2',
		question: 'The beast of xmoor',
		answers: [
			{text: 'I can touch it', color: '#49f', votes: 11},
			{text: 'I can see it', color: '#f33', votes: 2},
			{text: 'It doesn\'t matter', color: '#0f3', votes: 5},
		]
	},
];


export function getPoll(id) {
	return new Poll(polls.find(poll => poll.id === id));
}

export function getUser(id) {
	return new User(users.find(user => user.id === id));
}

const hotPolls = polls.slice().sort((a, b) => {
	return a.votes - b.votes;
}).map(poll => poll.id);

export {
	User,
	Poll,
	getUser,
	getPoll,
	hotPolls
};