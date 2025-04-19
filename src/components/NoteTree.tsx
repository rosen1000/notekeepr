import { Collapse, List, ListItem, ListItemButton } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';

interface Props {
	notes: NoteResponse[];
	paths: string[];
	onSelect: (index: number) => void;
}

export default function NoteTree({ notes, paths, onSelect }: Props) {
	const [selected, setSelected] = useState(-1);
	const [active, setActive] = useState<string[]>([]);

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
				(note, index) =>
					note.path == '/' && (
						<ListItemButton key={index} selected={index === selected} onClick={handleClick(index)}>
							<ListItem>{note.title}</ListItem>
						</ListItemButton>
					)
			)}
			{paths.map((path) => (
				<>
					{path !== '/' && (
						<ListItemButton key={path} onClick={toggleActive(path)} sx={{ ml: '-2rem' }}>
							<ListItem className='pl-4'>
								<Icon
									icon='mdi:chevron-up'
									className={`mr-2 transition duration-200 ${active.includes(path) && 'rotate-180'}`}
									fontSize={'1.5rem'}
								/>{' '}
								{path}
							</ListItem>
						</ListItemButton>
					)}
					<Collapse in={!!active.find((p) => p == path)}>
						{notes.map(
							(note, index) =>
								note.path == path && (
									<ListItemButton
										key={note.title}
										selected={index === selected}
										onClick={handleClick(index)}
										sx={{ pl: '2rem' }}
									>
										<ListItem>{note.title}</ListItem>
									</ListItemButton>
								)
						)}
					</Collapse>
				</>
			))}
		</List>
	);
}
