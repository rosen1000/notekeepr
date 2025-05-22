import { Collapse, List, ListItem, ListItemButton } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';

interface Props {
	notes: NoteResponse[];
	paths: string[];
	select?: number;
	onSelect: (index: number) => void;
}

export default function NoteTree({ notes, paths, onSelect, select = -1 }: Props) {
	const [selected, setSelected] = useState(select);
	const [active, setActive] = useState<string[]>([]);

	useEffect(() => {
		if (select > -1) {
			setActive([notes.find((n) => n.id === select)?.path || '']);
		}
	}, [notes]);

	function handleClick(index: number) {
		return () => {
			setSelected(index);
			onSelect(index);
		};
	}

	function toggleActive(path: string) {
		return () => {
			if (active.includes(path)) {
				setActive(active.filter((p) => p != path));
			} else {
				setActive((p) => [...p, path]);
			}
		};
	}

	return (
		<List disablePadding className='w-full'>
			{notes.map(
				(note) =>
					note.path == '/' && (
						<ListItemButton selected={note.id === selected} onClick={handleClick(note.id)}>
							<ListItem key={`note-${note.id}`}>{note.title}</ListItem>
						</ListItemButton>
					)
			)}
			{paths.map((path) => (
				<>
					{path != '/' && [
						<ListItemButton key={`group-${path}`} onClick={toggleActive(path)} sx={{ ml: '-2rem' }}>
							<ListItem className='pl-4'>
								<Icon
									icon='mdi:chevron-up'
									className={`mr-2 transition duration-200 ${active.includes(path) && 'rotate-180'}`}
									fontSize={'1.5rem'}
								/>{' '}
								{path}
							</ListItem>
						</ListItemButton>,
						<Collapse in={!!active.find((p) => p == path)}>
							{notes.map(
								(note) =>
									note.path == path && (
										<ListItemButton selected={note.id === selected} onClick={handleClick(note.id)} sx={{ pl: '2rem' }}>
											<ListItem key={`innernote-${note.id}`}>{note.title}</ListItem>
										</ListItemButton>
									)
							)}
						</Collapse>,
					]}
				</>
			))}
		</List>
	);
}
