let users = [
	{
		id: 'f0920d0e-04f4-4301-8dad-f017540b72f3',
		username: 'download',
		auth_hash: '$2a$07$zgz70pk8Y90nM5BebFV3/.W.75cNzAk2nJRdwre1Ms.wSPQOuUqtW',
		scope: 'root'
	},
	{
		id: '9dcd64c8-ed12-4e7e-a92c-d05fb0a4debf',
		username: 'margaret',
		auth_hash: '$2a$07$dYtkagO3DWVKS8LgGfMVTe3Ir4GPHcQn12VbxrLJkOBLz/x68Y.Im',
		scope: 'user'
	}
];


let polls = [
	{
		id: '05683626-977c-4996-946e-af54d636fef4',
		question: 'How can I tell what\'s real?',
		answers: [
			{text: 'I can touch it', color: '#15d', votes: 15},
			{text: 'I can see it', color: '#48e', votes: 20},
			{text: 'It doesn\'t matter', color: '#f81', votes: 90},
		],
		owner: 'f0920d0e-04f4-4301-8dad-f017540b72f3'
	},
	{
		id: 'c3e94164-5370-4f96-b4c9-2aa5057c60b0',
		question: 'What are candles made of?',
		answers: [
			{text: 'Wax', color: '#999', votes: 20},
			{text: 'A strong sense of purpose', color: '#393', votes: 0},
			{text: 'Who are you?', color: '#d4d', votes: 1},
		],
		owner: 'f0920d0e-04f4-4301-8dad-f017540b72f3'
	},
	{
		id: 'eb8df041-afe2-467f-bd8a-d1ed41b467e6',
		question: 'The beast of xmoor',
		answers: [
			{text: 'I can touch it', color: '#49f', votes: 11},
			{text: 'I can see it', color: '#f33', votes: 2},
			{text: 'It doesn\'t matter', color: '#0f3', votes: 5},
		],
		owner: '9dcd64c8-ed12-4e7e-a92c-d05fb0a4debf'
	},
];


export {
	users,
	polls
};