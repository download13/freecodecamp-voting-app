import {
	GraphQLInputObjectType,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLList,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLID,
	GraphQLNonNull
} from 'graphql';


import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import promisify from 'promisify-any';

import {
	getUser,
	getUserByUsername,
	addUser,
	getPoll,
	getHotPolls,
	getUserPolls,
	addPoll,
	removePoll,
	voteForAnswer
} from '../db/mongo';

import config from '../config';


const MONTH = 30 * 24 * 60 * 60;

const genSalt = promisify(bcrypt.genSalt);
const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);


const AnswerType = new GraphQLObjectType({
	name: 'Answer',
	fields: {
		text: {type: new GraphQLNonNull(GraphQLString)},
		color: {type: new GraphQLNonNull(GraphQLString)},
		votes: {type: new GraphQLNonNull(GraphQLInt)}
	}
});
const AnswerInputType = new GraphQLInputObjectType({
	name: 'AnswerInput',
	fields: {
		text: {type: new GraphQLNonNull(GraphQLString)},
		color: {type: new GraphQLNonNull(GraphQLString)}
	}
});

const PollType = new GraphQLObjectType({
	name: 'Poll',
	fields: {
		id: {type: GraphQLID},
		question: {type: new GraphQLNonNull(GraphQLString)},
		answers: {type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerType)))}
	}
});
const PollInputType = new GraphQLInputObjectType({
	name: 'PollInput',
	fields: {
		question: {type: new GraphQLNonNull(GraphQLString)},
		answers: {type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerInputType)))}
	}
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {type: GraphQLID},
		username: {type: new GraphQLNonNull(GraphQLString)},
		//polls: {type: PollsConnection} // TODO
	}
});


const Polls = new GraphQLObjectType({
	name: 'PollQueries',
	fields: {
		mine: {
			type: new GraphQLList(PollType),
			resolve(parent, args, {rootValue: reqUser}) {
				return getUserPolls(reqUser.id);
			}
		},
		hot: {
			type: new GraphQLList(PollType),
			resolve(parent) {
				return getHotPolls();
			}
		},
		poll: {
			type: PollType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve(reqUser, {id}) {
				return getPoll(id);
			}
		}
	}
});

const PollMutations = new GraphQLObjectType({
	name: 'PollMutations',
	fields: {
		create: {
			type: PollType,
			args: {
				poll: {type: new GraphQLNonNull(PollInputType)}
			},
			resolve(_, {poll}, {rootValue: reqUser}) {
				if(!reqUser.id) return;
				return addPoll(reqUser.id, poll);
			}
		},
		remove: {
			type: GraphQLBoolean,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve(_, {id}, {rootValue: reqUser}) {
				console.log('removePoll', reqUser, id);
				return removePoll(id, reqUser.id);
			}
		},
		vote: {
			type: PollType,
			args: {
				pollId: {type: new GraphQLNonNull(GraphQLID)},
				answerIndex: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(_, {pollId, answerIndex}, {rootValue: reqUser}) {
				return voteForAnswer(pollId, answerIndex).then(() => {
					return getPoll(pollId);
				});
			}
		}
	}
});

export default new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			me: {
				type: UserType,
				resolve(reqUser) {
					if(reqUser.id) return getUser(reqUser.id);
				}
			},
			polls: {
				type: Polls,
				resolve() {
					return {};
				}
			}
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			login: {
				type: new GraphQLObjectType({
					name: 'LoginResult',
					fields: {
						token: {type: GraphQLString}
					}
				}),
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)},
					password: {type: new GraphQLNonNull(GraphQLString)}
				},
				fields: {
					token: {type: GraphQLString}
				},
				resolve(reqUser, {username, password}) {
					return getUserByUsername(username)
					.then(user => {
						if(user) { // Existing user
							return compare(password, user.auth_hash)
							.then(matches => {
								if(matches) return createUserToken(user);
							});
						} else { // Create new user
							return genSalt(config.bcrypt_strength)
							.then(salt => {
								return hash(password, salt);
							})
							.then(auth_hash => {
								return addUser({username, auth_hash}).then(user => {
									return createUserToken(user);
								});
							});
						}
					})
					.then(token => {
						return {token};
					});
				},
			},
			createPoll: {
				type: PollType,
				args: {
					poll: {type: new GraphQLNonNull(PollInputType)}
				},
				resolve(reqUser, {poll}) {
					console.log('createPoll', reqUser, poll)
					if(!reqUser.id) return;
					return addPoll(reqUser.id, poll);
				}
			},
			removePoll: {
				type: GraphQLBoolean,
				args: {
					id: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve(reqUser, {id}) {
					console.log('removePoll', reqUser, id);
					return removePoll(id, reqUser.id);
				}
			},
			polls: {
				type: PollMutations,
				resolve() {
					return {};
				}
			}
		}
	})
});


function createUserToken(user) {
	let {
		id,
		username,
		scope
	} = user;
	
	return jwt.sign(
		{
			id,
			username,
			scope
		},
		config.jwtSecret,
		{
			algorithm: 'HS256',
			expiresIn: MONTH
		}
	);
}