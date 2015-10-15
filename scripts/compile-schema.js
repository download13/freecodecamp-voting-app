import fs from 'fs';
import path from 'path';
import {graphql}  from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';

import schema from '../server/schema';


const SCHEMA_DIR = path.resolve(__dirname, '../server/schema');


async () => {
	let result = await graphql(schema, introspectionQuery);
	if(result.errors) {
		console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2));
	} else {
		fs.writeFileSync(
			path.join(SCHEMA_DIR, 'compiled.json'),
			JSON.stringify(result, null, '\t')
		);
	}
}();

fs.writeFileSync(
	path.join(SCHEMA_DIR, 'compiled.graphql'),
	printSchema(schema)
);