import React, {Component} from 'react';
import {Link} from 'react-router';


export default class Auth extends Component {
	render() {
		let {user} = this.props;
		
		let log, settings;
		if(user) {
			settings = [
				<Link activeClassName="active" key="1" to="/dashboard">{user.username}</Link>,
				<Link activeClassName="active" key="2" to="/settings"><img src="/images/gear_24.png" /></Link>
			];
			log = <Link activeClassName="active" to="/logout">Logout</Link>;
		} else {
			log = <Link activeClassName="active" to="/login">Login</Link>;
		}
		
		return <div className="auth-controls">
			{settings}
			{log}
		</div>;
	}
}
