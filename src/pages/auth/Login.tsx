import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import z from 'zod';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	Button,
	Card,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from '@mui/material';

export default function Login() {
	const navigate = useNavigate();
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.-]).{8,}$/;
	const schema = z.object({
		username: z.string().min(6),
		password: z
			.string()
			.min(8, 'Password must be atleast 8 characters')
			.refine(
				(v) => passwordRegex.test(v),
				'Password must contain atleast\n1 lowercase letter,\n1 uppercase letter and\n1 number'
			),
	});

	const [formData, setFormData] = useState<{ username?: string; password?: string }>({});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

	useEffect(() => {
		const { success, error } = schema.safeParse(formData);
		if (!success) {
			const { username, password } = error.format();
			setErrors({
				username: formData.username != undefined ? username?._errors.join('\n') : '',
				password: formData.password != undefined ? password?._errors.join('\n') : '',
			});
		} else setErrors({});
	}, [formData]);

	const toggleShowPassword = () => setShowPassword((show) => !show);
	const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { success } = schema.safeParse(formData);
		if (!success) return;
		// TODO: Make API call
		console.log('Submit');
	};

	return (
		<Card className='p-8' sx={{ borderRadius: '8px' }}>
			<h1 className='mb-8'> Login </h1>
			<form onSubmit={submit} className='flex flex-col gap-4'>
				<TextField
					required
					name='username'
					label='Username'
					placeholder='Enter your username'
					onChange={change}
					error={!!errors.username}
					helperText={errors.username}
				/>
				<FormControl error={!!errors.password}>
					<InputLabel htmlFor='password'>Password</InputLabel>
					<OutlinedInput
						id='password'
						name='password'
						type={showPassword ? 'text' : 'password'}
						label='Password'
						placeholder='Enter your password'
						onChange={change}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label={showPassword ? 'hide the password' : 'display the password'}
									onClick={toggleShowPassword}
									edge='end'
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					<FormHelperText className='whitespace-pre'>{errors.password}</FormHelperText>
				</FormControl>
				<div className='flex justify-between'>
					<Button onClick={() => navigate('/auth/register')}> Register </Button>
					<Button type='submit' variant='contained'>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
}
