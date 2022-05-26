import type React from 'react';

import Header from '../Header';
import Footer from '../Footer';

interface LayoutProps {
	children: Array<React.ReactNode> | React.ReactNode;
	className?: string;
}

const PageLayout: React.FC<LayoutProps> = ({ children, className }) => {
	return (
		<div
			className={`grid grid-rows-burger-layout min-h-screen ${className}`}
		>
			<Header className="flex justify-around items-center bg-slate-200 py-4 text-gray-800 shadow-lg" />
			<div>{children}</div>
			<Footer className="p-4 bg-white text-gray-800 text-center font-bold" />
		</div>
	);
};

export default PageLayout;
