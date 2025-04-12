interface NoteOptions {
	mono: boolean;
}

interface Note {
	id: number;
	title: string;
	content: string;
	options?: Partial<NoteOptions>;
}
