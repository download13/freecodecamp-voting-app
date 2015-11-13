import React, {Component} from 'react';
import {Link} from 'react-router';


const PitchCard = ({image, text}) => {
	return <div className="pitch-card">
		<img src={image} />
		<h2 className="pitch-card__text">{text}</h2>
	</div>;
};

export default class Home extends Component {
	render() {
		return <div>
			<header className="home-header">
				<h1>VoteFire</h1>
				<div>Public Opinion Tracking</div>
			</header>
			<section className="pitch">
				<PitchCard
					image="/images/ballot.png"
					text="Create a poll"
				/>
				<PitchCard
					image="/images/polling.png"
					text="Vote on other polls"
				/>
				<PitchCard
					image="/images/earth.png"
					text="Learn about opinions from around the world"
				/>
			</section>
			<section className="get-started">
				<Link className="get-started__button" to="/dashboard">Get Started</Link>
			</section>
		</div>;
	}
}
