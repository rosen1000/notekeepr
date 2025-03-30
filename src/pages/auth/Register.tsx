import { Button, Card, TextField } from '@mui/material';
import { useNavigate } from 'react-router';

export default function Register() {
	const navigate = useNavigate();

	function submit() {}

	return (
		<Card className='p-8'>
			<form onSubmit={submit} className='flex flex-col gap-4'>
				<h1>Register</h1>
				<TextField name='username' label='Username' placeholder='Enter your username' />
				<TextField type='password' name='password' label='Password' placeholder='Enter your password' />
				<div className='flex justify-between'>
					<Button onClick={() => navigate('/auth/register')}>Register</Button>
					<Button> Login </Button>
				</div>
			</form>
		</Card>
	);
}
