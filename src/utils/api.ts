export default {
	auth: {
		login(username: string, password: string) {
			return fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});
		},
		register(username: string, password: string) {
			return fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});
		},
	},
	note: {
		new(note: Note) {
			return fetch('/api/note/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(note),
			});
		},
	},
};
