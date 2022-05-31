import type React from 'react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FileCard, CustomModal, useModal } from '../components/cards';
import { useUserContext } from '../components/context/AuthContext';
import { AiFillFileAdd } from 'react-icons/ai';
import { uploadFiles, useFiles } from '../utils/api';
import Input from '../components/Input';

const Dashboard: React.FC = () => {
	const navigate = useNavigate();

	const [fileModalIsOpen, fileModalToggle] = useModal();
	const [query, setQuery] = useState<string>('');

	const { id } = useUserContext();
	const { files, refetch } = useFiles(id);

	const filterFiles = (event: React.KeyboardEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	};

	const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.append('user_id', String(id));

		uploadFiles(formData).then(refetch).then(fileModalToggle);
	};

	useEffect(() => {
		!id && navigate('/login');
	});

	return (
		<div>
			<CustomModal
				isOpen={fileModalIsOpen}
				onRequestClose={fileModalToggle}
			>
				<form onSubmit={handleFormSubmission}>
					<input type="file" name="files" id="files" multiple />
					<button formAction="submit" className="btn-primary">
						Upload
					</button>
				</form>
			</CustomModal>

			<Input
				icon="🔍"
				type="text"
				className="block mx-auto my-12 lg:w-1/2 w-5/6 bg-gray-900"
				placeholder="Search..."
				onInput={filterFiles}
			/>
			<div className="text-zinc-500 w-5/6 mx-auto">
				<button
					onClick={fileModalToggle}
					className="inline-flex items-center justify-center py-4 px-8 bg-gray-900 border-2 border-zinc-600 cursor-pointer rounded-md w-full sm:w-auto"
				>
					<AiFillFileAdd /> Add File
				</button>
			</div>
			<div className="grid grid-cols-responsive place-items-center gap-y-8 gap-x-8 w-5/6 mx-auto my-12">
				{files
					.filter((filename) =>
						filename.toLowerCase().includes(query.toLowerCase())
					)
					.map((file, idx) => (
						<FileCard filename={file} key={idx} refetch={refetch} />
					))}
			</div>
		</div>
	);
};

export default Dashboard;
