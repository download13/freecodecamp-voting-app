import React, {Component} from 'react';
import {Link} from 'react-router';
import Relay from 'react-relay';

import Auth from '../components/auth';


class Root extends Component {
	render() {
		const {
			user,
			children
		} = this.props;
		
		return <div>
			<nav className="sitenav">
				<Link activeClassName="active" to="/" onlyActiveOnIndex={true}>Home</Link>
				<Auth user={user} />
			</nav>
			<header className="siteheader">
				<h1>VoteFire</h1>
				<div>Public Opinion Tracking</div>
			</header>
			<main>
				{children}
			</main>
		</div>;
	}
}

export default Relay.createContainer(Root, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				${Auth.getFragment('user')}
			}
		`
	}
});