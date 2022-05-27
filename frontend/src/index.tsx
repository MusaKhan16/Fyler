import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContextProvider from './components/context/AuthContext';
import Modal from 'react-modal';

// Styles
import './css/index.css';

// Pages Directory
// PS implement code splitting with react lazy
import { Login, Home, SignUp, Dashboard, PageNotFound } from './pages';
import PageLayout from './components/Layouts/PageLayout';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

Modal.setAppElement('#root');

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<UserContextProvider>
				<Routes>
					<Route path="/" element={<PageLayout />}>
						<Route index element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="sign-up" element={<SignUp />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
				</Routes>
			</UserContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
