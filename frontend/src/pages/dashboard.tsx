import type React from 'react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FileCard, CustomModal, useModal } from '../components/cards';
import { useUserContext } from '../components/context/AuthContext';
import { AiFillFileAdd } from 'react-icons/ai';
import { uploadFiles, useFiles } from '../utils/api';

const Dashboard: React.FC = () => {
	const { id } = useUserContext();

	const navigate = useNavigate();
	const [fileModalIsOpen, fileModalToggle] = useModal();

	const { files, refetch } = useFiles(id);
	const [query, setQuery] = useState<string>('');

	const filterFiles = (event: React.KeyboardEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	};

	const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.append('user_id', String(id));

		uploadFiles(formData).then(refetch);
		fileModalToggle();
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

			<input
				type="text"
				className="block mx-auto my-12 p-3 rounded-md outline-none border-2 border-zinc-500 sm:w-1/2 w-5/6"
				placeholder="Search.."
				onInput={filterFiles}
			/>
			<div className="text-zinc-500 w-5/6 mx-auto ">
				<button
					onClick={fileModalToggle}
					className="inline-flex py-4 px-8 bg-zinc-800 border-2 border-zinc-500 cursor-pointer rounded-md"
				>
					<AiFillFileAdd /> Add File
				</button>
			</div>
			<div className="grid grid-cols-responsive place-items-center gap-y-8 gap-x-8 w-5/6 mx-auto my-12">
				{files
					.filter((filename) => filename.startsWith(query))
					.map((file, idx) => (
						<FileCard filename={file} key={idx} />
					))}
			</div>
		</div>
	);
};

export default Dashboard;
