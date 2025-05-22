import api from '../../utils/api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import RichMarkdown from '../../components/RichMarkdown';
import * as Mui from '@mui/material';
import { z } from 'zod';
import { set } from '../../utils';
import { toast } from 'react-toastify';

export function EditNote() {
	const nav = useNavigate();
	const params = useParams<{ id: string }>();
	const [note, setNote] = useState<Note>(null!);
	const [err, serr] = useState('');
	const [path, setPath] = useState<string>('/');
	const [options, setOptions] = useState({ mono: false });
	const [paths, setPaths] = useState<string[]>([]);
	const [edit, setEdit] = useState(false);
	const schema = z.object({
		title: z.string().nonempty(),
		content: z.string().nonempty(),
		path: z.string().nonempty().startsWith('/'),
	});

	useEffect(() => {
		if (!params.id || isNaN(+params.id)) {
			nav('/');
			return;
		}
		api.note
			.get(+params.id)
			.then(setNote)
			.catch((e) => {
				if (e.status == 404) return serr('Note was not found');
				if (e.status == 500) return serr("You don't own this note");
			});
		api.note
			.paths()
			.then((paths) => {
				setPaths(paths);
			})
			.catch((e) => {
				toast.error(`Error: ${e.message}`);
			});
	}, []);

	function handleSave() {
		const { success } = schema.safeParse(note);
		if (!success) return toast.error('Error: Note is missing a component');
		api.note.update(+params.id!, note).then(() => nav(`/note/${params.id}`));
	}

	return (
		<>
			{note ? (
				<div className='flex flex-col items-center justify-center my-16 gap-8 lg:mx-[20vw] sm:mx-[10vw] mx-4'>
					<Mui.TextField
						variant='standard'
						label='Title'
						placeholder='Note title'
						value={note.title}
						onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))}
						sx={{
							'& .MuiInputBase-input': { fontSize: '2rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
							'& .MuiFormLabel-root': { fontSize: '1.8rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
							width: '100%',
						}}
					/>
					<Mui.TextField
						variant='standard'
						multiline
						value={note.content}
						label='Content'
						placeholder='Note content'
						onChange={(e) => setNote((n) => ({ ...n, content: e.target.value }))}
						sx={{
							'& .MuiInputBase-input': { fontSize: '1.4rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
							'& .MuiFormLabel-root': { fontSize: '1.2rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
							width: '100%',
						}}
					/>

					<Mui.Accordion>
						<Mui.AccordionSummary>Note options</Mui.AccordionSummary>
						<Mui.AccordionDetails>
							<div className='flex flex-col'>
								<Mui.FormControl>
									<Mui.InputLabel id='folder-select'>Folder</Mui.InputLabel>
									<Mui.Select
										value={path}
										label='Folder'
										labelId='folder-select'
										onChange={(e) => setPath(e.target.value)}
									>
										{paths.map((p) => (
											<Mui.MenuItem key={p} value={p}>
												{p}
											</Mui.MenuItem>
										))}
										<Mui.MenuItem value={path} hidden={paths.includes(path) || path == '__new__'}>
											{path}
										</Mui.MenuItem>
										<Mui.MenuItem value='__new__' onClick={() => setEdit(true)}>
											+ New Folder
										</Mui.MenuItem>
									</Mui.Select>
								</Mui.FormControl>

								{edit && (
									<Mui.TextField
										label='New Folder Name'
										value={path === '__new__' ? '' : path}
										onChange={(e) => setPath(e.target.value)}
										onBlur={() => setEdit(false)}
									/>
								)}

								<Mui.FormControlLabel
									control={<Mui.Checkbox />}
									label='Mono font'
									onChange={(_, v) => set(setOptions, 'mono', v)}
								/>
							</div>
						</Mui.AccordionDetails>
					</Mui.Accordion>
					{/* #endregion Note options */}

					<Mui.Button variant='contained' color='primary' onClick={handleSave}>
						Save
					</Mui.Button>
					<RichMarkdown note={[note, setNote]} />
				</div>
			) : (
				<div className='w-full h-screen flex flex-col items-center justify-center'>
					<div className='p-8 bg-gray-800 rounded-md shadow-lg'>{err}</div>
				</div>
			)}
		</>
	);
}
