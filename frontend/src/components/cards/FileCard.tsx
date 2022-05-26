import type React from 'react';
import { API } from '../../utils/api';
import { getIcon } from '../../utils/file_icons';
import { useUserContext } from '../context/AuthContext';
interface FileCardProps {
	filename: string;
	thumbnail_url?: string;
}

const FileCard: React.FC<FileCardProps> = ({ filename, thumbnail_url }) => {
	const FileIcon = getIcon(
		filename.slice(filename.indexOf('.') + 1).toLowerCase()
	);

	const { id: user_id } = useUserContext();

	return (
		<div className="bg-zinc-800 rounded-md object-cover overflow-hidden border-2 border-zinc-500 w-full transition transform hover:-translate-y-2 cursor-pointer">
			{thumbnail_url ? (
				<img src={thumbnail_url} alt="file-icon" className="w-full" />
			) : (
				<div className="flex w-full bg-white h-64 rounded-sm">
					<FileIcon size={64} className="m-auto text-sky-600" />
				</div>
			)}

			<div className="flex border-solid border-t-2 border-t-gray-500 text-zinc-500 font-bold p-4">
				<FileIcon className="text-sky-600" size={24} />{' '}
				<h3 className="ml-2">
					{filename.length > 20
						? filename.slice(0, 20) + '...'
						: filename}
				</h3>
				<a
					type="submit"
					className="ml-auto"
					href={API(`files/${user_id}/${filename}`)}
				>
					Download
				</a>
			</div>
		</div>
	);
};

export default FileCard;
