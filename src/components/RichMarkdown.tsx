import { Checkbox, FormControlLabel } from '@mui/material';
import { Dispatch, SetStateAction, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
	title: string;
	content: [string, Dispatch<SetStateAction<string>>];
	options: NoteOptions;
}

export default function RichMarkdown({ title, content: [content, setContent], options }: Props) {
	const markdown = useMemo(() => `# ${title}\n${content}`, [title, content]);
	let taskId = 0;

	function changeTaskList(id: number, value: boolean) {
		const regex = /- \[[ x]\]/gm;
		let found: number | undefined = -1;
		for (let i = 0; i <= id; i++) {
			found = regex.exec(content)?.index;
		}
		if (found == undefined || found == -1) return;
		found += 3;
		setContent(content.slice(0, found) + (value ? 'x' : ' ') + content.slice(found + 1, content.length));
	}

	return (
		<div className={'prose prose-invert text-white! ' + (options.mono ? 'font-mono' : 'font-inherit')}>
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
