import { List, ListItem, ListItemButton } from '@mui/material';
import { useState } from 'react';

interface Props {
	notes: NoteResponse[];
	onSelect: (index: number) => void;
}

export default function NoteTree({ notes, onSelect }: Props) {
	const [selected, setSelected] = useState(-1);

	function handleClick(index: number) {
		setSelected(index);
		onSelect(index);
	}

	return (
		<List disablePadding className='w-full'>
			{notes.map((note, index) => (
				<ListItemButton key={index} selected={index === selected} onClick={() => handleClick(index)}>
					<ListItem>{note.title}</ListItem>
				</ListItemButton>
			))}
		</List>
	);
}
