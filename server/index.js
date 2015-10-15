import express from 'express';
import path from 'path';
import graphqlHTTP from 'express-graphql';
import {graphql} from 'graphql';

import schema from './schema';

import auth, {verify} from './auth';


const PUBLIC = path.resolve(__dirname, '../public');
const INDEX = path.join(PUBLIC, 'index.html');


const app = express();

app.use('/graphql', verify, graphqlHTTP(req => (
	{
		schema,
		rootValue: req.user,
		graphiql: true
	}
)));

auth(app);

app.use(express.static(PUBLIC));

app.get('*', (req, res) => {
	res.sendFile(INDEX);
});

const port = process.env.PORT || 80;
const address = process.env.IP || '0.0.0.0';
app.listen(port, address, () => {
	console.log(`Server listening on ${address}:${port}`);
});
