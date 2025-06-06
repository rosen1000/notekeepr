import axios from 'axios';

const app = axios.create({
	baseURL: '/api/',
	withCredentials: true,
});

export function isLogged() {
	return localStorage.getItem('logged') == '"true"';
}

export function read<T>(key: string): T | null {
	return JSON.parse(localStorage.getItem(key) || 'null');
}

export function write(key: string, value: unknown) {
	localStorage.setItem(key, JSON.stringify(value));
}

export default {
	auth: {
		async login(username: string, password: string) {
			await app.post('/auth/login', { username, password });
			write('logged', 'true');
		},
		async register(username: string, password: string) {
			await app.post('/auth/register', { username, password });
			write('logged', 'true');
		},
		async logout() {
			await app.post('/auth/logout');
			write('logged', 'false');
		},
	},
	note: {
		async new(note: Note) {
			if (isLogged()) await app.post('/note/new', note);
			else {
				const notes: Note[] = read('notes') ?? [];
				notes.push(note);
				write('notes', notes);
			}
		},
		async all() {
			if (isLogged()) return (await app.get<{ notes: NoteResponse[]; paths: string[] }>('/note/all')).data;
			else {
				const notes: NoteResponse[] = read('notes') ?? [];
				const paths: string[] = read('paths') ?? [];
				return { notes, paths };
			}
		},
		async paths() {
			let data: string[];
			if (isLogged()) data = (await app.get<string[]>('/note/paths')).data;
			else data = read('paths') ?? [];
			return data;
		},
		async update(id: number, data: Partial<Note>) {
			if (isLogged()) return app.patch(`/note/${id}`, data);
			else {
				const notes: Note[] = read('notes') ?? [];
				const idx = notes.findIndex((v) => v.id == id);
				if (idx == -1) return;
				notes[idx] = { ...notes[idx], ...data };
				write('notes', notes);
			}
		},
		async get(id: number) {
			if (isLogged()) return (await app.get<Note>(`/note/${id}`)).data;
			else {
				const notes: Note[] = read('notes') ?? [];
				const found = notes.find((n) => n.id == id);
				if (found) return found;
				const error = {
					isAxiosError: true,
					response: {
						status: 404,
						data: {
							message: 'Note not found',
						},
					},
				};
				throw error;
			}
		},
		async delete(id: number) {
			if (isLogged()) return app.delete(`/note/${id}`);
			else throw Error('Not implemented');
		},
	},
	share: {
		async create(id: number) {
			return (await app.post<string>('/share', { id })).data;
		},
		async get(link: string) {
			return (await app.get<Note & { user: { username: string } }>(`/share/${link}`)).data;
		},
		async delete(link: string) {
			await app.delete(`/share/${link}`);
		},
	},
};
