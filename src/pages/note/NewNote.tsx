import * as Mui from '@mui/material';
import { useMemo, useState } from 'react';
import { set } from '../../utils';
import RichMarkdown from '../../components/RichMarkdown';

export default function NewNote() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [options, setOptions] = useState({ mono: false });
	const note = useMemo<Note>(() => ({ id: -1, title, content, options }), [title, content, options]);
	const setNote = (n: React.SetStateAction<Note>) => {
		if ('content' in n) setContent(n.content);
		else setContent(n(note).content);
	};

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
					<Mui.FormControlLabel
						control={<Mui.Checkbox />}
						label='Mono font'
						onChange={(_, v) => set(setOptions, 'mono', v)}
					/>
				</Mui.AccordionDetails>
			</Mui.Accordion>
			{/* #endregion Note options */}

			<RichMarkdown note={[note, setNote]} />
		</div>
	);
}
