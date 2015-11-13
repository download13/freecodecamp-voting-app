import express from 'express';
import path from 'path';
import graphqlHTTP from 'express-graphql';
import {graphql} from 'graphql';
import jwt from 'jsonwebtoken';

import schema from './schema';

import config from './config';


const PUBLIC = path.resolve(__dirname, '../public');
const INDEX = path.join(PUBLIC, 'index.html');


const app = express();

app.use(
	'/graphql',
	(req, res, next) => {
		let token = req.headers.authorization || '';
		try {
			req.user = jwt.verify(token, config.jwtSecret, {
				algorithms: ['HS256']
			});
		} catch(e) {}
		next();
	},
	graphqlHTTP(req => {
		console.log('req authed', req.user);
		return {
			schema,
			rootValue: req.user || {},
			graphiql: true
		}
	})
);

app.use(express.static(PUBLIC));

app.get('*', (req, res) => {
	res.sendFile(INDEX);
});

const port = process.env.PORT || 80;
const address = process.env.IP || '0.0.0.0';
app.listen(port, address, () => {
	console.log(`Server listening on ${address}:${port}`);
});
