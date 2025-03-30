import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './pages/auth/Login.tsx';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const theme = createTheme({
	palette: { mode: 'dark', },
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
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
);
