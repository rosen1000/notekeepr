import RichMarkdown from '../../components/RichMarkdown';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import NoteTree from '../../components/NoteTree';
import api from '../../utils/api';
import { AxiosError } from 'axios';

export default function Note() {
	const navigate = useNavigate();
	// TODO: Fetch note from somewhere
	const [note, setNote] = useState<Note>(null as unknown as Note);
	const [notes, setNotes] = useState<NoteResponse[]>([]);
	// WHY DO I HAVE TO DO THIS
	let didMount = useRef(false);
	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			return;
		}
		console.log(note);
		// TODO: Save note in db
	}, [note]);

	useEffect(() => {
		api.note
			.all()
			.then(({ data: notes }) => {
				setNotes(notes);
			})
			.catch((e: AxiosError) => {
				// TODO: use snackbar to display errors
				if (e.status == 401) {
					alert('You are not logged in');
				}
				console.log(e);
			});
	}, []);

	function handleSelect(index: number) {
		api.note.get(notes[index].id).then(({ data }) => {
			setNote(data);
		});
	}

	return (
		<div className='flex h-screen'>
			{/* //#region Sidebar/Navigation */}
			<div className='flex flex-col items-center min-w-3xs border-r border-gray-600'>
				{/* TODO: Get notes and build tree-like thing */}
				<div className='p-4 w-full'>
					<Button size='large' variant='contained' onClick={() => navigate('/note/new')} className='w-full'>
						Compose
					</Button>
				</div>
				<NoteTree notes={notes} onSelect={handleSelect} />
			</div>
			{/* //#endregion */}

			{/* //#region Content */}
			<div className='w-full flex flex-col items-center justify-center'>
				{note ? (
					<div className='p-8 bg-gray-800 rounded-md shadow-lg'>
						<RichMarkdown note={[note, setNote]} />
					</div>
				) : (
					<div className='p-8 bg-gray-800 rounded-md shadow-lg'>No note selected.</div>
				)}
			</div>
			{/* //#endregion */}
		</div>
	);
}
