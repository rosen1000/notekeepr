import RichMarkdown from '../../components/RichMarkdown';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Note() {
	const navigate = useNavigate();
	// TODO: Fetch note from somewhere
	const [note, setNote] = useState<Note>(null as unknown as Note);
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

	return (
		<div className='flex h-screen'>
			{/* //#region Sidebar/Navigation */}
			<div className='flex flex-col items-center py-8 min-w-3xs border-r border-gray-600'>
				{/* TODO: Get notes and build tree-like thing */}
				<Button size='large' variant='contained' onClick={() => navigate('/note/new')}>
					Compose
				</Button>
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
