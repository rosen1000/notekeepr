import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import './App.css';

function App() {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col gap-8 items-center justify-center h-screen'>
			<h1 className='text-8xl'>Notekeepr</h1>
			<span className='flex flex-col gap-4 w-64'>
				<Button onClick={() => navigate('/note')} variant='contained' size='large'>
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
