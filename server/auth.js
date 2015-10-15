import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import {jwtSecret} from './config';

const MONTH = 30 * 24 * 60 * 60;


export default (app) => {
	app.post('/login', bodyParser.json(), (req, res) => {
		const {
			username,
			password,
		} = req.body;
		
		// TODO: Check database for user entry
		// create jwt or send back unauthorized
		const token = jwt.sign(
			{
				id: 'userid4324234',
				username: username,
				scope: 'user'
			},
			jwtSecret,
			{
				algorithm: 'HS256',
				expiresIn: MONTH
			}
		);
		
		res.send(token);
	});
};


export function verify(req, res, next) {
	const token = req.headers.authorization;
	//console.log('verify', req.headers)
	
	try {
		req.user = jwt.verify(token, jwtSecret, {
			algorithms: ['HS256']
		});
		console.log('verified')
	} catch(e) {}
	
	next();
}