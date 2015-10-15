import React, {Component} from 'react';
import {Link} from 'react-router';
import Relay from 'react-relay';


class Auth extends Component {
	render() {
		const {user} = this.props;
		console.log(0, user)
		let log, settings;
		if(user) {
			log = <Link activeClassName="active" to="/logout">Logout</Link>;
			settings = <Link activeClassName="active" to="/settings">{user.username}</Link>;
		} else {
			log = <Link activeClassName="active" to="/login">Login</Link>;
		}
		
		return <div className="auth-controls">
			{settings}
			{log}
		</div>;
	}
}


export default Relay.createContainer(Auth, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				id
				username
			}
		`
	}
});