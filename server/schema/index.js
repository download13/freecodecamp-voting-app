import {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLList,
	GraphQLString,
	GraphQLInt
} from 'graphql';

import {
	nodeDefinitions,
	fromGlobalId,
	globalIdField,
	connectionDefinitions,
	connectionArgs
} from 'graphql-relay';

import {
	User,
	Poll,
	getUser,
	getPoll,
	hotPolls
} from './data';


let {nodeInterface, nodeField} = nodeDefinitions(
	globalId => {
		let {type, id} = fromGlobalId(globalId);
		switch(type) {
		case 'User':
			return getUser(id);
		case 'Poll':
			return getPoll()
		}
	},
	obj => {
		if(obj instanceof User) return UserType;
		if(obj instanceof Poll) return PollType;
	}
);


const AnswerType = new GraphQLObjectType({
	name: 'Answer',
	fields: {
		text: {type: GraphQLString},
		color: {type: GraphQLString},
		votes: {type: GraphQLInt},
	}
});

const PollType = new GraphQLObjectType({
	name: 'Poll',
	fields: {
		id: globalIdField('Poll'),
		question: {type: GraphQLString},
		answers: {type: AnswerType},
	},
	interfaces: [nodeInterface]
});


const {
	connectionType: PollsConnection
} = connectionDefinitions({
	name: 'Poll',
	nodeType: PollType,
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: globalIdField('User'),
		username: {type: GraphQLString},
		polls: {
			type: PollsConnection,
			args: connectionArgs,
		}
	},
	interfaces: [nodeInterface]
});


const PollsType = new GraphQLObjectType({
	name: 'Polls',
	fields: {
		hot: {
			type: new GraphQLList(PollType),
			description: 'Hottest Polls'
		},
	}
});

let Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		me: {
			type: UserType,
			resolve() {
				//console.log('me', arguments)
				// TODO: Get request information, like req.user
				return {id: 'fdsaf', username: 'down'};
			}
		},
		polls: {
			type: PollsType,
			resolve() {
				return {hot: hotPolls};
			}
		},
		node: nodeField
	}
});


export default new GraphQLSchema({
	query: Query
});

// TODO: Limit the number of answers on a poll to 10 or something