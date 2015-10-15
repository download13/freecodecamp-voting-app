export default function createLoginStore() {
	const subscribers = new Set();
	
	return {
		login(token) {
			localStorage.setItem('__login_token', token);
			subscribers.forEach(handler => handler());
		},
		getToken() {
			return localStorage.getItem('__login_token');
		},
		onChange(handler) {
			subscribers.add(handler);
			
			if(localStorage.getItem('__login_token')) {
				handler();
			}
			
			return () => subscribers.delete(handler);
		}
	};
}