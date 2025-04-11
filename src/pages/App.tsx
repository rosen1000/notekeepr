import { Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import './App.css';

function App() {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col gap-8 items-center justify-center h-screen'>
			<h1 className='text-8xl'>Notekeepr <Icon icon="twemoji:memo" className='inline' /></h1>
			<span className='flex flex-col gap-4 w-64'>
				<Button onClick={() => navigate('/note/new')} variant='contained' size='large'>
					Begin
				</Button>
				<Button onClick={() => navigate('/auth/login')} variant='outlined' size='large'>
					Login
				</Button>
			</span>
		</div>
	);
}

export default App;
