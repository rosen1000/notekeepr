import RichMarkdown from '../../components/RichMarkdown';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NoteTree from '../../components/NoteTree';
import api from '../../utils/api';
import { AxiosError } from 'axios';

export default function Note() {
	const navigate = useNavigate();
	const params = useParams<{ id: string }>();
	const [note, setNote] = useState<Note>(null as unknown as Note);
	const [notes, setNotes] = useState<NoteResponse[]>([]);
	const [paths, setPaths] = useState<string[]>([]);

	useEffect(() => {
		if (params.id) {
			api.note.get(+params.id).then(({ data }) => {
				setNote(data);
			});
		}
	}, [params]);

	useEffect(() => {
		api.note
			.all()
			.then(({ data }) => {
				setNotes(data.notes);
				setPaths(data.paths);
			})
			.catch((e: AxiosError) => {
				if (e.status == 401) {
					alert('You are not logged in');
				}
				console.log(e);
			});
	}, []);

	function handleSelect(index: number) {
		navigate(`/note/${index}`);
		// api.note.get(notes[index].id).then(({ data }) => {
		//   setNote(data);
		// });
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
				{notes.length > 0 && (
					<NoteTree notes={notes} paths={paths} select={params.id ? +params.id : -1} onSelect={handleSelect} />
				)}
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
