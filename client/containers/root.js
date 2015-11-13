import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import Auth from '../components/auth';


class Root extends Component {
	render() {
		const {
			children,
			user
		} = this.props;
		
		return <div>
			<nav className="sitenav">
				<Link activeClassName="active" to="/" onlyActiveOnIndex={true}>Home</Link>
				<Link activeClassName="active" to="/create">Create Poll</Link>
				<Auth user={user} />
			</nav>
			<main className="sitemain">
				{children}
			</main>
		</div>;
	}
}

export default connect(
	state => {
		return {user: state.auth.user};
	}
)(Root);