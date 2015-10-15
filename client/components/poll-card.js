import React, {Component} from 'react';


class PollCard extends Component {
	constructor() {
		super();
		
		this.state = {
			className: `poll-card-${Math.random().toString(36).substr(2)}`
		};
	}
	
	// TODO: rerender the pie chart
	render() {
		const {
			question,
			answers,
		} = this.props;
		const {className} = this.state;
		
		const style = {
			width: '280px',
			height: '280px',
		};
		
		const marginPercent = 10; // percent of x axis space that will be margin
		const marginWidth = marginPercent / (answers.length + 1);
		const width = (100 - marginWidth) / answers.length;
		const widthText = `${width}%`;
		let left = marginWidth;
		const answerEls = answers.map(answer => {
			const el = <div style={{
				position: 'absolute',
				bottom: 0,
				backgroundColor: getRandomColor(),
				width: widthText,
				left: `${left}%`,
			}}></div>;
			
			left += width + marginWidth;
			
			return el;
		});
		
		return <div className="poll-card">
			<h3>{question}</h3>
			<div className={className} style={style} answers={answers}></div>
			{answerEls}
		</div>;
	}
	
	componentDidMount() {
		const {answers} = this.props;
		const {className} = this.state;
		
		const labels = [];
		const series = [];
		const colors = [];
		
		answers.forEach(({text, votes, color}) => {
			series.push(votes);
			labels.push(text);
			colors.push(color);
		});
		
		const data = {
			labels,
			series,
			colors,
		};

		//new Chartist.Pie('.' + className, data);
	}
}

export default PollCard;


function getRandomColor() {
	let letters = '0123456789ABCDEF'.split('');
	let color = '#';
	for(let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}