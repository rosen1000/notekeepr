interface NoteOptions {
	mono: boolean;
}

interface NoteResponse {
	id: number;
	title: string;
	path: string;
	tags: any;
}

interface Note {
	id: number;
	title: string;
	content: string;
	options?: Partial<NoteOptions>;
	tags: any;
}
