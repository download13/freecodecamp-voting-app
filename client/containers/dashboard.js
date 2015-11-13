import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import actions from '../state/actions';
import PollCard from '../components/poll-card';


const PollItem = ({poll, onDelete}) => {
	return <Link className="dash-poll" to={`/poll/${poll.id}`}>
		{poll.question}
		<br/><br/>
		<button onClick={e => {e.preventDefault(); onDelete();}}>Delete</button>
	</Link>;
};


class Dashboard extends Component {
	componentDidMount() {
		let {refreshMine} = this.props;
		
		refreshMine();
	}
	
	render() {
		let {
			polls,
			removePoll,
			refreshMine
		} = this.props;
		console.log('my polls', polls);
		
		return <div className="dash-polls">
			{polls ? polls.map(poll => <PollItem key={poll.id} poll={poll} onDelete={() => {removePoll(poll.id); refreshMine();}} />) : null}
		</div>;
	}
}

export default connect(
	({polls}) => {
		return {polls: polls.mine};
	},
	dispatch => {
		return {
			refreshMine: bindActionCreators(actions.refreshMine, dispatch),
			removePoll: bindActionCreators(actions.removePoll, dispatch)
		};
	}
)(Dashboard);