import React, {Component} from 'react';


export default class PollCard extends Component {
	render() {
		let {
			poll,
			onSelect
		} = this.props;
		
		let {
			question,
			answers,
		} = poll;
		
		const style = {
			width: '280px',
			height: '280px'
		};
		
		const marginPercent = 10; // percent of x axis space that will be margin
		const marginWidth = marginPercent / (answers.length + 1);
		const width = (100 - marginWidth * (answers.length + 1)) / answers.length;
		const widthText = `${width}%`;
		
		const voteInfo = answers.reduce((acc, item) => {
			acc.total += item.votes;
			
			if(item.votes > acc.greatest) {
				acc.greatest = item.votes;
			}
			
			return acc;
		}, {total: 0, greatest: 0});
		
		let left = marginWidth;
		const scale = voteInfo.greatest / voteInfo.total;
		
		const answerEls = answers.map(({text, color, votes}, i) => {
			let heightPercent = (votes / voteInfo.total) * 100 / scale;
			if(heightPercent < 1) {
				heightPercent = 1;
			}
			
			const el = <div key={`answer${i}`} style={{
				position: 'absolute',
				bottom: 0,
				textAlign: 'center',
				fontWeight: 'bold',
				backgroundColor: color,
				width: widthText,
				height: `${heightPercent}%`,
				left: `${left}%`,
			}}>{votes}</div>;
			
			left += width + marginWidth;
			
			return el;
		});
		
		const legendEls = answers.map(({text, color}, i) => {
			return <tr key={`legend${i}`} onClick={() => onSelect(i)}>
				<td><div className="legend-color" style={{backgroundColor: color}}></div></td>
				<td><span className="legend-text">{text}</span></td>
			</tr>;
		});
		
		return <div className={'poll-card' + (onSelect ? ' selectable' : '')}>
			<h3>{question}</h3>
			<div className="poll-card-answers">
				{answerEls}
			</div>
			<table className="poll-card-legend"><tbody>
				{legendEls}
			</tbody></table>
		</div>;
	}
}