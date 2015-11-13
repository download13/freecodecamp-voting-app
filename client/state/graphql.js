import fetch from 'isomorphic-fetch';


export default function graphql(query, variables, init = {}) {
	//console.log('gr', query, variables);
	let {headers} = init;
	
	let newInit = {
		...init,
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			...headers
		},
		body: JSON.stringify({query, variables})
	};
	
	return fetch('/graphql', newInit)
	.then(res => {
		
		if(res.ok) {
			return res.json().then(({data, errors}) => {
				if(errors) {
					// TODO: Also, log us out because our token is no longer valid
					throw errors;
				}
				
				return data;
			});
		} else {
			return res.text().then(text => {throw text});
		}
	});
}
