import RichMarkdown from '../../components/RichMarkdown';
import { useEffect, useRef, useState } from 'react';

export default function Note() {
	// TODO: Fetch note from somewhere
	const [note, setNote] = useState<Note>({ id: '1', title: 'Note Title', content: '- [ ] Milk' });
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
			<div className='min-w-3xs border-r border-gray-600'>
				{/* TODO: Get notes and build tree-like thing */}
				Note sidebar
			</div>
			{/* //#endregion */}

			{/* //#region Content */}
			<div className='w-full flex flex-col items-center justify-center'>
				{note ? (
					<div className='p-8 bg-gray-800 rounded-md shadow-lg'>
						<RichMarkdown note={[note, setNote]} />
					</div>
				) : (
					<div className='p-4 bg-gray-800 rounded-md shadow-lg'>No note selected.</div>
				)}
			</div>
			{/* //#endregion */}
		</div>
	);
}
