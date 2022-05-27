import { useEffect, useState } from 'react';

export function API(url: string) {
	return `${process.env.REACT_APP_API_URL}${url}`;
}

export async function createUserAccount(
	loginDetails: object
): Promise<{ id: number; name: string; status_code: number }> {
	const response = await fetch(API('createUser'), {
		method: 'POST',
		body: JSON.stringify(loginDetails),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	return { ...data, status_code: response.status };
}

export async function loginUser(loginDetails: object): Promise<{
	id: number;
	name: string;
	root_path: string;
	status_code: number;
}> {
	const response = await fetch(API('loginUser'), {
		method: 'POST',
		body: JSON.stringify(loginDetails),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	return { ...data, status_code: response.status };
}

export async function createUserRoot(
	userId: number
): Promise<{ root_path: string; status_code: number }> {
	const response = await fetch(API('createUserRoot'), {
		method: 'POST',
		body: JSON.stringify({ user_id: userId }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	return { ...data, status_code: response.status };
}

export async function uploadFiles(userFormData: FormData) {
	const response = await fetch(API('uploadFiles'), {
		method: 'POST',
		body: userFormData,
	});

	const data = await response.json();

	return { ...data, status_code: response.status };
}

export const useFiles = (user_id: number | null) => {
	const [files, setFiles] = useState<string[]>([]);

	const fetchFiles = async () => {
		const response = await fetch(API(`getFiles/${user_id}`));

		if (response.ok) {
			const fileData = await response.json();
			setFiles(fileData.files);
		}
	};

	useEffect(() => {
		user_id && fetchFiles();
	}, [user_id]);

	return { files, refetch: fetchFiles };
};
