import * as Mui from '@mui/material';
import api from '../../utils/api';
import RichMarkdown from '../../components/RichMarkdown';
import { set } from '../../utils';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

export default function NewNote() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [path, setPath] = useState<string>('/');
	const [options, setOptions] = useState({ mono: false });
	const [paths, setPaths] = useState<string[]>([]);
	const [edit, setEdit] = useState(false);
	const navigate = useNavigate();
	const schema = z.object({
		title: z.string().nonempty(),
		content: z.string().nonempty(),
		path: z.string().nonempty().startsWith('/'),
		options: z.object({ mono: z.boolean() }),
	});

	useEffect(() => {
		api.note
			.paths()
			.then((paths) => {
				setPaths(paths);
			})
			.catch((e) => {
				toast.error(`Error: ${e.message}`);
			});
	}, []);

	const note = useMemo<Note>(() => ({ id: -1, title, path, tags: [], content, options }), [title, content, options]);
	const setNote = (n: React.SetStateAction<Note>) => {
		if ('content' in n) setContent(n.content);
		else setContent(n(note).content);
	};

	function handleSave() {
		const { success } = schema.safeParse(note);
		// TODO: handle error
		if (!success) return;
		api.note
			.new(note)
			.then(() => {
				navigate('/note/' + note.id);
			})
			// TODO: handle error
			.catch((e) => console.log(e));
	}

	return (
		<div className='flex flex-col items-center justify-center my-16 gap-8 lg:mx-[20vw] sm:mx-[10vw] mx-4'>
			<Mui.TextField
				variant='standard'
				label='Title'
				placeholder='Note title'
				onChange={(e) => setTitle(e.target.value)}
				sx={{
					'& .MuiInputBase-input': { fontSize: '2rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
					'& .MuiFormLabel-root': { fontSize: '1.8rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
					width: '100%',
				}}
			/>
			<Mui.TextField
				variant='standard'
				multiline
				value={content}
				label='Content'
				placeholder='Note content'
				onChange={(e) => setContent(e.target.value)}
				sx={{
					'& .MuiInputBase-input': { fontSize: '1.4rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
					'& .MuiFormLabel-root': { fontSize: '1.2rem', fontFamily: options.mono ? 'monospace' : 'inherit' },
					width: '100%',
				}}
			/>

			{/* #region Note options */}
			<Mui.Accordion>
				<Mui.AccordionSummary>Note options</Mui.AccordionSummary>
				<Mui.AccordionDetails>
					<div className='flex flex-col'>
						<Mui.FormControl>
							<Mui.InputLabel id='folder-select'>Folder</Mui.InputLabel>
							<Mui.Select value={path} label='Folder' labelId='folder-select' onChange={(e) => setPath(e.target.value)}>
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
	);
}
