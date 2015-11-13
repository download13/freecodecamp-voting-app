import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from '../state/actions';
import PollCard from '../components/poll-card';
import graphql from '../state/graphql';


class Poll extends Component {
	constructor() {
		super();
		
		this.state = {picked: false};
	}
	
	componentDidMount() {
		let {
			params,
			loadDisplayPoll
		} = this.props;
		
		loadDisplayPoll(params.id);
	}
	
	render() {
		let {poll, vote} = this.props;
		let {picked} = this.state;
		
		if(!poll) return <div/>;
		
		let {question, answers} = poll;
		
		let onSelect;
		if(!picked) { // Render picker
			onSelect = answerIndex => {
				vote(poll.id, answerIndex);
				
				this.setState({picked: true});
			};
		}
		
		// Render graph
		return <div className="poll-display">
			<PollCard poll={poll} onSelect={onSelect} />
			<label className="poll-display__share-link">
				Share Link&nbsp;
				<input onClick={e => e.target.select()} value={`https://vote-download13.c9.io/poll/${poll.id}`} readOnly={true} spellCheck={false} />
			</label>
		</div>;
	}
}

export default connect(
	({polls}) => {
		return {poll: polls.display};
	},
	dispatch => {
		return {
			loadDisplayPoll: bindActionCreators(actions.loadDisplayPoll, dispatch),
			vote: bindActionCreators(actions.vote, dispatch)
		};
	}
)(Poll);