import type React from 'react';
import PageLayout from '../components/Layouts/PageLayout';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FileCard, CustomModal, useModal } from '../components/cards';
import { useUserContext } from '../components/context/AuthContext';
import { AiFillFileAdd, AiFillFolderAdd } from 'react-icons/ai';
import { uploadFiles } from '../utils/api';
import { API } from '../utils/api';

const Dashboard: React.FC = () => {
	const { id, rootPath } = useUserContext();

	const navigate = useNavigate();
	const [fileModalIsOpen, fileModalToggle] = useModal();
	const [folderModalIsOpen, folderModalToggle] = useModal();

	const [files, setFiles] = useState<string[]>([]);
	const [query, setQuery] = useState<string>('');

	const filterFiles = (event: React.KeyboardEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	};

	const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.append('folder_path', rootPath!);

		uploadFiles(formData);
	};

	useEffect(() => {
		if (id) {
			fetch(API(`getFiles/${id}`))
				.then((data) => data.json())
				.then((data) => setFiles(data.files));
		} else {
			navigate('/login');
		}
	}, [id, navigate]);

	return (
		<PageLayout className="bg-gray-800">
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

			<CustomModal
				isOpen={folderModalIsOpen}
				onRequestClose={folderModalToggle}
			>
				<h1>Hello</h1>
			</CustomModal>

			<input
				type="text"
				className="block mx-auto my-12 p-3 rounded-md outline-none border-2 border-zinc-500 sm:w-1/2 w-5/6"
				placeholder="Search.."
				onInput={filterFiles}
			/>
			<div className="text-zinc-500 w-5/6 mx-auto space-x-4">
				<button
					onClick={fileModalToggle}
					className="inline-flex py-4 px-8 bg-zinc-800 border-2 border-zinc-500 cursor-pointer rounded-md"
				>
					<AiFillFileAdd /> Add File
				</button>

				<button
					onClick={folderModalToggle}
					className="inline-flex py-4 px-8 bg-zinc-800 border-2 border-zinc-500 cursor-pointer rounded-md"
				>
					<AiFillFolderAdd /> Add Folder
				</button>
			</div>
			<div className="grid grid-cols-responsive place-items-center gap-y-8 gap-x-8 w-5/6 mx-auto my-12">
				{files
					.filter((filename) => filename.startsWith(query))
					.map((file, idx) => (
						<FileCard filename={file} key={idx} />
					))}
			</div>
		</PageLayout>
	);
};

export default Dashboard;
