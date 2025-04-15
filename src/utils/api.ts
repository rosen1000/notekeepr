import axios from 'axios';

const app = axios.create({
	baseURL: '/api/',
	withCredentials: true,
});

export default {
	auth: {
		login(username: string, password: string) {
			return app.post('/auth/login', { username, password });
		},
		register(username: string, password: string) {
			return app.post('/auth/register', { username, password });
		},
	},
	note: {
		new(note: Note) {
			return app.post('/note/new', note);
		},
		all() {
			return app.get<NoteResponse[]>('/note/all');
		},
		get(id: number) {
			return app.get(`/note/${id}`);
		},
	},
};
