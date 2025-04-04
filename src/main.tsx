import App from './pages/App.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { createRoot } from 'react-dom/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import './index.css';
import { green, pink } from '@mui/material/colors';

const theme = createTheme({
	palette: { mode: 'dark', primary: green, secondary: pink },
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route index element={<App />} />
					<Route path='auth'>
						<Route path='login' element={<Login />} />
						<Route path='register' element={<Register />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
);
