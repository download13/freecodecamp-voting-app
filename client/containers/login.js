import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';


export default class Login extends Component {
	constructor() {
		super();
		
		this.state = {};
		
		this.login = this.login.bind(this);
	}
	
	render() {
		const {error} = this.state;
		const user = {
			id: '543534fads',
			username: 'download13'
		};
		
		return <div className="login">
			<div>{error}</div>
			<input ref="user" placeholder="Username" />
			<input ref="pass" placeholder="Password" type="password" />
			<button onClick={this.login}>Login</button>
			<button onClick={this.login}>Sign Up</button>
		</div>;
	}
	
	login() {
		// TODO: Error check form fields
		const username = this.refs.user.value;
		const password = this.refs.pass.value;
		// POST to /login and get back a token or an error code
		fetch('/login', {
			method: 'post',
			body: {username, password}
		})
		.then(res => res.text())
		.then(token => {
			// TODO: Store token in local store for use with graphql calls
			console.log(token);
		}, err => {
			// TODO: show an error message
			console.log('err', err)
			this.setState({error: err.toString()});
		});
	}
}