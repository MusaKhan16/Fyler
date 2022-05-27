import React from 'react';
import { GenericComponentProps } from '../../utils/interfaces';

interface AuthContextInterface {
	id: number;
	name: string;
	signIn: (username: string, id: number) => void;
	signOut: () => void;
}

const UserContext = React.createContext<object>({});

/* To be used later */
const useFilePath = (filePath: string = '') => {
	const [currentPath, setPath] = React.useState<string>(filePath);

	const goTo = (name: string) => {
		setPath(currentPath + '/' + name);
	};

	const goBack = () => {
		const splitPath = currentPath.split('/');
		setPath(splitPath.slice(0, splitPath.length - 1).join('/'));
	};

	return [currentPath, goTo, goBack, setPath];
};

/** Higher Level User Context Provider for global user state */
const UserContextProvider: React.FC<GenericComponentProps> = ({ children }) => {
	const [name, setName] = React.useState<string>('');
	const [id, setUserId] = React.useState<number | null>();

	const signOut = () => {
		setName('');
		setUserId(null);
	};

	const signIn = (username: string, id: number) => {
		setName(username);
		setUserId(id);
	};

	return (
		<UserContext.Provider
			value={{
				name,
				id,
				signOut,
				signIn,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

const useUserContext = () => {
	return React.useContext(UserContext) as AuthContextInterface;
};

export default UserContextProvider;
export { useUserContext, useFilePath };
