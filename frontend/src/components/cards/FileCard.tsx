import type React from 'react';
import { API, deleteFile } from '../../utils/api';
import { getIcon } from '../../utils/file_icons';
import { useUserContext } from '../context/AuthContext';
import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg';
import { ReactComponent as TrashIcon } from '../../assets/icons/trash.svg';

interface FileCardProps {
	filename: string;
	thumbnail_url?: string;
	refetch: () => Promise<void>;
}

const FileCard: React.FC<FileCardProps> = ({
	filename,
	thumbnail_url,
	refetch,
}) => {
	const FileIcon = getIcon(filename.split('.').at(-1)!.toLowerCase());

	const { id: user_id } = useUserContext();

	const fileDelete = async () => {
		await deleteFile(user_id, filename);
		refetch();
	};

	return (
		<div className="bg-gray-900 rounded-md object-cover overflow-hidden border-2 border-zinc-600 w-full transition duration-300 ease-bubble transform hover:-translate-y-3 cursor-pointer">
			{thumbnail_url ? (
				<img src={thumbnail_url} alt="file-icon" className="w-full" />
			) : (
				<div className="flex w-full bg-white h-64 rounded-sm">
					<FileIcon size={64} className="m-auto text-sky-600" />
				</div>
			)}

			<div className="flex items-center border-solid border-t-2 border-t-gray-500 text-zinc-500 font-bold p-3">
				<FileIcon className="text-sky-600" size={24} />{' '}
				<h3 className="ml-2">
					{filename.length > 20
						? filename.slice(0, 16) + '...'
						: filename}
				</h3>
				<a
					type="submit"
					className="ml-auto"
					href={API(`files/${user_id}/${filename}`)}
				>
					<DownloadButton />
				</a>
				<button
					onClick={fileDelete}
					className="group p-2 rounded-md hover:bg-zinc-700 text-zinc-500 active:outline-zinc-600"
				>
					<TrashIcon className="w-6 h-6 fill-zinc-600 group-hover:stroke-white group-hover:fill-red-500" />
				</button>
			</div>
		</div>
	);
};

const DownloadButton: React.FC<
	React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
	<button
		{...props}
		className="group p-2 rounded-md hover:bg-zinc-700 text-zinc-500 active:outline-zinc-600"
	>
		<DownloadIcon className="w-6 h-6 fill-zinc-600 stroke-zinc-600 group-hover:stroke-zinc-200 group-hover:fill-slate-400" />
	</button>
);

export default FileCard;
