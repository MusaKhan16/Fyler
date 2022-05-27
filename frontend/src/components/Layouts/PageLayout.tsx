import type React from 'react';

import Header from '../Header';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';

const PageLayout: React.FC = () => {
	return (
		<div className="grid grid-rows-burger-layout min-h-screen bg-gray-800">
			<Header className="flex justify-around items-center bg-slate-200 py-4 text-gray-800 shadow-lg" />
			<Outlet />
			<Footer className="p-4 bg-white text-gray-800 text-center font-bold" />
		</div>
	);
};

export default PageLayout;
