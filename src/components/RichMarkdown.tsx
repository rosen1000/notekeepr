import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Checkbox, FormControlLabel } from '@mui/material';
import { set } from '../utils';
import { useMemo, useState } from 'react';

interface Props {
	note: [Note, React.Dispatch<React.SetStateAction<Note>>];
}

export default function RichMarkdown({ note: [note, setNote] }: Props) {
	const [_, rerender] = useState(0);
	const markdown = useMemo(() => `# ${note.title}\n${note.content}`, [note.title, note.content]);
	let taskId = 0;

	function changeTaskList(id: number, value: boolean) {
		const regex = /- \[[ x]\]/gm;
		let found: number | undefined = -1;
		for (let i = 0; i <= id; i++) {
			found = regex.exec(note.content)?.index;
		}
		if (found == undefined || found == -1) return;
		found += 3;
		set(
			setNote,
			'content',
			note.content.slice(0, found) + (value ? 'x' : ' ') + note.content.slice(found + 1, note.content.length)
		);
		rerender((v) => ++v);
	}

	return (
		<div className={'prose prose-invert text-white! ' + (note.options?.mono ? 'font-mono' : 'font-inherit')}>
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					li: ({ children }) => {
						if (!Array.isArray(children)) return <li>{children}</li>;
						const checked = children[0].props.checked;
						const id = taskId++;
						return (
							<li id={`task-${id}`} className='list-none'>
								<FormControlLabel
									control={<Checkbox />}
									label={children[2]}
									checked={checked}
									onChange={(_, checked) => changeTaskList(id, checked)}
								/>
							</li>
						);
					},
					ul: ({ children }) => <ul className='p-0'>{children}</ul>,
				}}
			>
				{markdown}
			</Markdown>
			{(() => {
				taskId = 0;
				return false;
			})()}
		</div>
	);
}
