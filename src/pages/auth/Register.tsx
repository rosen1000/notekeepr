import * as Mui from '@mui/material';
import api from '../../utils/api';
import z from 'zod';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { passwordLength, passwordRegex } from '../../utils';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Register() {
	const navigate = useNavigate();
	const schema = z
		.object({
			username: z.string().min(6),
			password: z
				.string()
				.min(passwordLength, `Password must be atleast ${passwordLength} characters`)
				.refine(
					(v) => passwordRegex.test(v),
					'Password must contain atleast\n1 lowercase letter,\n1 uppercase letter and\n1 number'
				),
			repeat: z.string(),
		})
		.refine((v) => v.password == v.repeat, 'Both passwords must match');
	type Form = Partial<ReturnType<typeof schema.parse>>;

	const [formData, setFormData] = useState<Form>({});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Form>({});

	useEffect(() => {
		const { success, error } = schema.safeParse(formData);
		if (success) return setErrors({});
		const { password, username, _errors } = error.format();
		setErrors({
			username: formData.username != undefined ? username?._errors.join('\n') : '',
			password: formData.password != undefined ? password?._errors.join('\n') : '',
			repeat: formData.repeat != undefined ? _errors.join('\n') : '',
		});
	}, [formData]);

	const toggleShowPassword = () => setShowPassword((show) => !show);
	const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { success } = schema.safeParse(formData);
		if (!success) return;

		const res = await api.auth.login(formData.username!, formData.password!);
		if (res.status >= 200 && res.status < 300) {
			navigate('/note');
		} else {
			setErrors({
				username: 'Invalid username or password',
			});
		}
	};

	return (
		<div className='flex flex-col  items-center justify-center h-screen'>
			<Mui.Card className='p-8' sx={{ borderRadius: '8px' }}>
				<h1 className='text-4xl font-bold text-center mb-8'>Register</h1>
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
							required
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
						<Mui.FormHelperText className='whitespace-pre' sx={{ margin: 0 }}>
							{errors.password}
						</Mui.FormHelperText>
					</Mui.FormControl>
					<Mui.TextField
						required
						name='repeat'
						label='Repeat Password'
						placeholder='Enter your password again'
						type={showPassword ? 'text' : 'password'}
						onChange={change}
						error={!!errors.repeat}
						helperText={errors.repeat}
					/>
					<div className='flex justify-between'>
						<Mui.Button onClick={() => navigate('/auth/login')}>Login</Mui.Button>
						<Mui.Button type='submit' variant='contained'>
							Register
						</Mui.Button>
					</div>
				</form>
			</Mui.Card>
		</div>
	);
}
