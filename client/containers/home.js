import React, {Component} from 'react';
import Relay from 'react-relay'

import Auth from '../components/auth';
import PollCard from '../components/poll-card';


class Home extends Component {
	render() {
		let {
			polls,
		} = this.props;

		return <div className="sitehome">
			{polls.map(poll => {
				// TODO
				return <PollCard key={poll.id} {...poll} />;
			})}
		</div>;
	}
}


export default Relay.createContainer(Home, {
	fragments: {
		polls: () => Relay.QL`fragment on Polls {
			hot {
				id
				question
				answers {
					text
					color
					votes
				}
			}
		}`
	}
});