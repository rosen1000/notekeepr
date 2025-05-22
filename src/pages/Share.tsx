import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import RichMarkdown from '../components/RichMarkdown';
import { Card, CardContent } from '@mui/material';

export function Share() {
	const nav = useNavigate();
	const params = useParams<{ link: string }>();
	const [note, setNote] = useState<Awaited<ReturnType<typeof api.share.get>>>(null!);
	const [err, setErr] = useState('');
	useEffect(() => {
		if (!params.link) {
			nav('/');
			return;
		}
		api.share
			.get(params.link)
			.then(setNote)
			.catch((e) => {
				if (e.status == 404) return setErr('Note was not found');
				console.log(e);
				toast.error(`Error: ${e.message}`);
			});
	}, []);
	return (
		<div className='w-full h-screen flex flex-col items-center justify-center'>
			{note ? (
				<div className='m-8 md:min-w-md'>
					<div className='mx-8 my-4'>Shared by {note.user.username}</div>
					<Card>
						<CardContent sx={{padding: '2rem'}}>
							<RichMarkdown note={[note, () => ({})]} />
						</CardContent>
					</Card>
				</div>
			) : (
				<div className='p-8 bg-gray-800 rounded-md shadow-lg'>{err}</div>
			)}
		</div>
	);
}
