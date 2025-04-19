import axios from 'axios';

const app = axios.create({
	baseURL: '/api/',
	withCredentials: true,
});

// TODO: make all calls respect login status
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
			return app.post<void>('/note/new', note);
		},
		all() {
			return app.get<{ notes: NoteResponse[]; paths: string[] }>('/note/all');
		},
		paths() {
			return app.get<string[]>('/note/paths');
		},
		get(id: number) {
			return app.get<Note>(`/note/${id}`);
		},
	},
};
