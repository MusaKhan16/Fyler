import React from 'react';
import { GenericComponentProps } from '../../utils/interfaces';

interface AuthContextInterface {
	id: number;
	name: string;
	rootPath?: string;
	goToPath: Function;
	goBackPath: Function;
	setName: React.Dispatch<React.SetStateAction<string>>;
	setUserId: React.Dispatch<React.SetStateAction<number>>;
	setRootPath: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = React.createContext<object>({});

export const useFilePath = (filePath: string = '') => {
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

const useUserContext = () => {
	return React.useContext(UserContext) as AuthContextInterface;
};

/** Higher Level User Context Provider for global user state */
const UserContextProvider: React.FC<GenericComponentProps> = ({ children }) => {
	const [name, setName] = React.useState<string>('');
	const [id, setUserId] = React.useState<number>();
	const [rootPath, setRootPath] = React.useState<string>('');

	return (
		<UserContext.Provider
			value={{
				name,
				id,
				rootPath,
				setName,
				setUserId,
				setRootPath,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
export { useUserContext };
