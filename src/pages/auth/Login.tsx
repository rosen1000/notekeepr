import * as Mui from '@mui/material';
import z from 'zod';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { passwordLength, passwordRegex } from '../../utils';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
	const navigate = useNavigate();
	const schema = z.object({
		username: z.string().min(6),
		password: z
			.string()
			.min(passwordLength, `Password must be atleast ${passwordLength} characters`)
			.refine(
				(v) => passwordRegex.test(v),
				'Password must contain atleast\n1 lowercase letter,\n1 uppercase letter and\n1 number'
			),
	});
	type Form = Partial<ReturnType<typeof schema.parse>>;

	const [formData, setFormData] = useState<Form>({});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Form>({});

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
		<Mui.Card className='p-8' sx={{ borderRadius: '8px' }}>
			<h1 className='mb-8'> Login </h1>
			<form onSubmit={submit} className='flex flex-col gap-4'>
				<Mui.TextField
					required
					name='username'
					label='Username'
					placeholder='Enter your username'
					onChange={change}
					error={!!errors.username}
					helperText={errors.username}
				/>
				<Mui.FormControl error={!!errors.password}>
					<Mui.InputLabel required htmlFor='password'>
						Password
					</Mui.InputLabel>
					<Mui.OutlinedInput
						id='password'
						name='password'
						type={showPassword ? 'text' : 'password'}
						label='Password'
						placeholder='Enter your password'
						onChange={change}
						endAdornment={
							<Mui.InputAdornment position='end'>
								<Mui.IconButton
									aria-label={showPassword ? 'hide the password' : 'display the password'}
									onClick={toggleShowPassword}
									edge='end'
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</Mui.IconButton>
							</Mui.InputAdornment>
						}
					/>
					<Mui.FormHelperText className='whitespace-pre'>{errors.password}</Mui.FormHelperText>
				</Mui.FormControl>
				<div className='flex justify-between'>
					<Mui.Button onClick={() => navigate('/auth/register')}> Register </Mui.Button>
					<Mui.Button type='submit' variant='contained'>
						Login
					</Mui.Button>
				</div>
			</form>
		</Mui.Card>
	);
}
