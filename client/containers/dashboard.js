import React, {Component} from 'react';

import PollCreator from '../components/poll-creator';


export default class Dashboard extends Component {
	render() {
		let {
			user,
			store,
		} = this.props;
		
		if(!user && false) {
			return <div>
				Not logged in
				<button>Login</button>
			</div>;
		}
		
		return <div>
			<PollCreator onCreate={poll => store.createPoll(poll)} />
			My polls, ordered by popularity or recentness
		</div>;
	}
}