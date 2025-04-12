interface NoteOptions {
	mono: boolean;
}

interface Note {
	id: string;
	title: string;
	content: string;
	options?: NoteOptions;
}
