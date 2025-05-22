import api from '../utils/api';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { set } from '../utils';
import { useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

interface Props {
	note: [Note, React.Dispatch<React.SetStateAction<Note>>];
	editable: boolean;
}

export default function RichMarkdown({ note: [note, setNote], editable = false }: Props) {
	const navigate = useNavigate();
	const [, rerender] = useState(0);
	const markdown = useMemo(() => `# ${note.title}\n${note.content}`, [note.title, note.content]);
	const [openDialog, toggleDialog] = useReducer((state) => !state, false);
	const [modalMode, setModalMode] = useState<'share' | 'delete'>('share');
	const [shared, setShared] = useState(note.Share.length > 0);
	const [shareLink, setSharedLink] = useState(note.Share.length > 0 ? note.Share[0].link : '');
	const fullShareLink = useMemo(() => `${window.location.origin}/share/${shareLink}`, [shareLink]);
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

	function handleModalShare() {
		setModalMode('share');
		toggleDialog();
	}

	function handleModalDelete() {
		setModalMode('delete');
		toggleDialog();
	}

	function handleCopy() {
		navigator.clipboard.writeText(fullShareLink);
		toast.info('Copied to clipboard');
	}

	function handleShare() {
		if (shared && shareLink) {
			api.share.delete(shareLink).then(() => {
				setShared(false);
			});
		} else {
			api.share.create(note.id).then((link) => {
				setShared(true);
				setSharedLink(link);
			});
		}
	}

	function handleDelete() {
		api.note
			.delete(note.id)
			.then(() => {
				toggleDialog();
				toast('Note deleted');
			})
			.catch((e) => {
				console.error(e);
				toast.error(`Error: ${e.message}`);
			});
	}

	return (
		<div className={'prose prose-invert text-white! ' + (note.options?.mono ? 'font-mono' : 'font-inherit')}>
			<Dialog open={openDialog} onClose={toggleDialog}>
				{modalMode == 'share' ? (
					<>
						<DialogTitle>Share</DialogTitle>
						<DialogContent>
							<p>Share this note with others.</p>
							<FormControlLabel control={<Checkbox checked={shared} onChange={handleShare} />} label='Share' />
							<div>
								{shared && (
									<span>
										{fullShareLink} <Button onClick={handleCopy}>Copy link</Button>
									</span>
								)}
							</div>
							<Button onClick={toggleDialog}>Close</Button>
						</DialogContent>
					</>
				) : (
					<>
						<DialogTitle>Delete note?</DialogTitle>
						<DialogContent className='flex gap-4'>
							<Button variant='outlined' onClick={toggleDialog}>
								No
							</Button>
							<Button variant='contained' color='error' onClick={handleDelete}>
								Yes
							</Button>
						</DialogContent>
					</>
				)}
			</Dialog>
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ children }) => (
						<h1>
							{children}
							<div className='inline pl-4'>
								{editable && [
									<IconButton onClick={() => navigate(`/note/edit/${note.id}`)}>
										<Icon icon='mdi-edit' />
									</IconButton>,
									<IconButton onClick={handleModalShare}>
										<Icon icon='mdi-share-variant' className={`${shared ? 'text-green-500' : ''}`} />
									</IconButton>,
									<IconButton onClick={handleModalDelete}>
										<Icon icon='mdi-delete' />
									</IconButton>,
								]}
							</div>
						</h1>
					),
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
