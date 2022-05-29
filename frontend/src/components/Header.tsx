import type React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from './context/AuthContext';
import type { GenericComponentProps } from '../utils/interfaces';

const Header: React.FC<GenericComponentProps> = ({ className }) => {
	const { name, id, signOut } = useUserContext();

	return (
		<header className={className}>
			<Link to="/">
				<h1 className="text-3xl font-bold">Fyler</h1>
			</Link>
			<ul className="flex justify-evenly items-center space-x-12  font-bold">
				{name && id ? (
					<>
						<li className="border-b border-transparent hover:border-black">
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li>
							<button
								className="p-2 font-bold text-white bg-gray-800 rounded-md border-2 border-gray-500"
								onClick={signOut}
							>
								Sign Out
							</button>
						</li>
					</>
				) : (
					<>
						{' '}
						<li className="border-b border-transparent hover:border-black">
							<Link to="/login">Login</Link>
						</li>
						<li className="border-b border-transparent hover:border-black">
							<Link to="/sign-up">Sign up</Link>
						</li>
					</>
				)}
			</ul>
		</header>
	);
};

export default Header;
