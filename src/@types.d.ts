interface NoteOptions {
	mono: boolean;
}

interface Tag {
	id: number;
	name: string;
	color: string;
}

interface NoteResponse {
	id: number;
	title: string;
	path: string;
	tags: Tag[];
}

interface Note {
	id: number;
	title: string;
	content: string;
	options?: Partial<NoteOptions>;
	Share?: { link: string }[];
	tags: Tag[];
}
