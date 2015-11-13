import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {replaceState} from 'redux-router';

import actions from '../state/actions';


class Login extends Component {
	constructor() {
		super();
		
		this.login = this.login.bind(this);
		this.formSubmit = this.formSubmit.bind(this);
	}
	
	render() {
		let {error} = this.props;
		
		return <div className="login">
			<h2>Login or Sign Up</h2>
			<div className="error">{error}</div>
			<input ref="user" placeholder="Username" onKeyDown={this.formSubmit} />
			<input ref="pass" placeholder="Password" onKeyDown={this.formSubmit} type="password" />
			<button onClick={this.login}>Login</button>&nbsp;
			<button onClick={this.login}>Create Account</button>
		</div>;
	}
	
	formSubmit(e) {
		if(e.keyCode === 13) {
			this.login();
		}
	}
	
	login() {
		let {onLogin} = this.props;
		let {user, pass} = this.refs;
		
		onLogin(user.value || null, pass.value || null);
	}
	
	componentWillReceiveProps(newProps) {
		let {token, navTo, location} = this.props;
		
		if(!this.props.token && newProps.token) {
			let nextPath = '/dashboard';
			if(location && location.state && location.state.nextPath) {
				nextPath = location.state.nextPath;
			}
			// TODO: This should be in the action creator
			navTo(null, nextPath);
		}
	}
}

export default connect(
	({auth, router}) => {
		return {
			error: auth.error,
			token: auth.token,
			location: router.location
		};
	},
	dispatch => {
		return {
			onLogin: bindActionCreators(actions.login, dispatch),
			navTo: bindActionCreators(replaceState, dispatch)
		};
	}
)(Login);