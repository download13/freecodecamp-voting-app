import {isWebUri} from 'valid-url';

import isEmail from 'check-email-valid';

import {
	GraphQLScalarType
} from 'graphql';

import {Kind} from 'graphql/language';

import {GraphQLError} from 'graphql/error';


export let UrlField = new GraphQLScalarType({
	name: 'Url',
	serialize: String,
	parseValue(value) {
		if(!isWebUri(value)) {
			throw new GraphQLError('Invalid URL');
		}

		return value;
	},
	parseLiteral(node) {
		if(node.kind !== Kind.STRING || !isWebUri(node.value)) {
			throw new GraphQLError('Invalid URL', [node]);
		}

		return node.value;
	}
});

export let EmailField = new GraphQLScalarType({
	name: 'Email',
	serialize: String,
	parseValue(value) {
		if(!isEmail(value)) {
			throw new GraphQLError('Invalid Email');
		}

		return value;
	},
	parseLiteral(node) {
		if(node.kind !== Kind.STRING || !isEmail(node.value)) {
			throw new GraphQLError('Invalid Email', [node]);
		}

		return node.value;
	}
});
