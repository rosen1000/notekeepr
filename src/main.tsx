import App from './pages/App.tsx';
import Login from './pages/auth/Login.tsx';
import NewNote from './pages/note/NewNote.tsx';
import Note from './pages/note/Note.tsx';
import Register from './pages/auth/Register.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { createRoot } from 'react-dom/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { green, pink } from '@mui/material/colors';
import './index.css';

const theme = createTheme({
	palette: { mode: 'dark', primary: green, secondary: pink },
});

createRoot(document.getElementById('root')!).render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<BrowserRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path='auth'>
					<Route path='login' element={<Login />} />
					<Route path='register' element={<Register />} />
				</Route>
				<Route path='note'>
					<Route index element={<Note />} />
					<Route path='new' element={<NewNote />} />
					<Route path=':id' element={<Note />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</ThemeProvider>
);
