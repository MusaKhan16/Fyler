import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContextProvider from './components/context/AuthContext';
import Modal from 'react-modal';

// Styles
import './css/index.css';

// Pages Directory
import * as Pages from './pages';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

Modal.setAppElement('#root');

root.render(
	<React.StrictMode>
		<UserContextProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Pages.Home />} />
					<Route path="login" element={<Pages.Login />} />
					<Route path="sign-up" element={<Pages.SignUp />} />
					<Route path="dashboard" element={<Pages.Dashboard />} />
					<Route path="*" element={<Pages.PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</UserContextProvider>
	</React.StrictMode>
);
