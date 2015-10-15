import React, {Component} from 'react';


export default class PollCreator extends Component {
	constructor() {
		super();
		
		this.state = {
			answers: ['', '']
		};
		
		this.questionChange = this.questionChange.bind(this);
		this.addAnswer = this.addAnswer.bind(this);
		this.removeAnswer = this.removeAnswer.bind(this);
		this.save = this.save.bind(this);
	}
	
	render() {
		let {
			question,
			answers
		} = this.state;
		
		let saveDisabled = false;
		if(!question) {
			saveDisabled = true;
		}
		
		let inputs = [];
		for(let i = 0; i < answers.length; i++) {
			if(!answers[i]) {
				saveDisabled = true;
			}

			let placeholder;
			switch(i) {
				case 0:
					placeholder = 'The normal way, point first';
					break;
				case 1:
					placeholder = 'Folded in half';
					break;
				case 2:
					placeholder = 'Backward, crust first';
			}
			
			let input = <input key={i} onChange={this.answerChange(i)} value={answers[i]} placeholder={placeholder} />;
			
			inputs.push(input);
		}
		
		return <div className="poll-creator">
			<h2>Question</h2>
			<input onChange={this.questionChange} value={question} placeholder="The best way to eat pizza is..." />
			<h2>Answers</h2>
			{inputs}
			<button onClick={this.addAnswer}>Add Answer</button>
			<button onClick={this.removeAnswer}>Remove Answer</button>
			<button onClick={this.save} disabled={saveDisabled}>Create Poll</button>
		</div>;
	}
	
	questionChange({target}) {
		this.setState({question: target.value});
	}
	
	addAnswer() {
		let {answers} = this.state;
		answers.push('');
		this.setState({answers});
	}
	
	answerChange(i) {
		return ({target}) => {
			let {answers} = this.state;
			answers[i] = target.value;
			this.setState({answers});
		};
	}
	
	removeAnswer() {
		let {answers} = this.state;
		if(answers.length > 1) {
			answers.pop();
			this.setState({answers});
		}
	}
	
	save() {
		let {onCreate} = this.props;
		let {
			question,
			answers,
		} = this.state;
		
		if(onCreate) {
			onCreate({
				question,
				answers
			}, err => {
				if(err) {
					// TODO: Display error
				} else {
					// Everything went fine, clear
					this.setState({
						question: null,
						answers: ['', '']
					});
				}
			});
		}
	}
}

export default PollCreator;